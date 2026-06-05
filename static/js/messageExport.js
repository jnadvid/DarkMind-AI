// Exportación de respuestas del asistente a Markdown (.md), PDF (.pdf) y Word (.docx).
//
// Incluye un pequeño parser de Markdown propio para que el PDF y el DOCX salgan
// bien formateados (encabezados, listas con y sin orden y anidadas, negrita,
// cursiva, código en línea y en bloque, citas, reglas horizontales, enlaces y
// tablas). Las librerías html2pdf y docx se cargan de forma diferida.
//
// Autor del proyecto: José Israel Nadal Vidal
import uiModule from './ui.js';

// ===========================================================================
//  Carga diferida de librerías
// ===========================================================================
let _docxReady = null;
function ensureDocx() {
  if (_docxReady) return _docxReady;
  if (window.docx) return (_docxReady = Promise.resolve());
  _docxReady = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = '/static/lib/docx.umd.min.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('No se pudo cargar la librería DOCX'));
    document.head.appendChild(s);
  });
  return _docxReady;
}

let _html2pdfReady = null;
function ensureHtml2Pdf() {
  if (_html2pdfReady) return _html2pdfReady;
  if (window.html2pdf) return (_html2pdfReady = Promise.resolve());
  _html2pdfReady = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = '/static/lib/html2pdf.bundle.min.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('No se pudo cargar la librería PDF'));
    document.head.appendChild(s);
  });
  return _html2pdfReady;
}

// ===========================================================================
//  Utilidades
// ===========================================================================
function _escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function _escAttr(s) {
  return _escHtml(s).replace(/"/g, '&quot;');
}
function _baseName() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `darkmind-respuesta-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}
function _getRaw(msgElement) {
  if (!msgElement) return '';
  return msgElement.dataset.raw || msgElement.querySelector('.body')?.textContent || '';
}
function _download(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function _empty() { uiModule.showToast?.('No hay contenido que exportar'); }

// Elimina emojis e iconos para obtener documentos serios. Mantiene la
// puntuación normal (guiones, comillas, etc.); solo quita pictogramas,
// símbolos/dingbats, banderas y selectores de variación.
function stripEmojis(s) {
  return String(s)
    .replace(/[\u{1F000}-\u{1FAFF}]/gu, '')   // emoticonos y pictogramas
    .replace(/[\u{2600}-\u{27BF}]/gu, '')     // símbolos varios y dingbats (✓ ✗ ★ ☎ …)
    .replace(/[\u{2B00}-\u{2BFF}]/gu, '')     // estrellas/flechas decorativas
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')   // banderas
    .replace(/[\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu, '') // selectores de variación / ZWJ / keycap
    .replace(/[ \t]{2,}/g, ' ')               // colapsa espacios dobles que deja el filtrado
    .replace(/[ \t]+$/gm, '');                // espacios finales
}

// ===========================================================================
//  Parser de Markdown -> bloques
// ===========================================================================
function _splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

function parseBlocks(md) {
  const lines = String(md).replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  const indentStack = [0]; // para los niveles de lista
  function levelFor(indent) {
    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) indentStack.pop();
    if (indent > indentStack[indentStack.length - 1]) indentStack.push(indent);
    return indentStack.length - 1;
  }
  function resetLists() { indentStack.length = 1; indentStack[0] = 0; }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Bloque de código cercado ``` o ~~~
    const fence = line.match(/^(\s*)(```|~~~)(.*)$/);
    if (fence) {
      const lang = fence[3].trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].match(/^(\s*)(```|~~~)\s*$/)) { code.push(lines[i]); i++; }
      i++; // salta el cierre
      blocks.push({ type: 'code', lang, lines: code });
      resetLists();
      continue;
    }

    // Línea en blanco
    if (/^\s*$/.test(line)) { blocks.push({ type: 'blank' }); resetLists(); i++; continue; }

    // Encabezado
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { blocks.push({ type: 'heading', level: h[1].length, text: h[2].replace(/\s+#+\s*$/, '') }); resetLists(); i++; continue; }

    // Regla horizontal (---, ***, ___)
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { blocks.push({ type: 'hr' }); resetLists(); i++; continue; }

    // Tabla (encabezado + fila separadora con guiones)
    if (line.includes('|') && i + 1 < lines.length &&
        /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes('-')) {
      const headers = _splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') { rows.push(_splitRow(lines[i])); i++; }
      blocks.push({ type: 'table', headers, rows });
      resetLists();
      continue;
    }

    // Cita
    const bq = line.match(/^\s*>\s?(.*)$/);
    if (bq) {
      const ql = [bq[1]];
      i++;
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { ql.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      blocks.push({ type: 'quote', text: ql.join('\n') });
      resetLists();
      continue;
    }

    // Elemento de lista (con o sin orden, anidado por indentación)
    const li = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
    if (li) {
      const indent = li[1].length;
      const level = levelFor(indent);
      const ordered = /\d/.test(li[2]);
      blocks.push({ type: 'li', ordered, level, num: ordered ? parseInt(li[2], 10) : null, text: li[3] });
      i++;
      continue;
    }

    // Párrafo (une líneas consecutivas que no sean especiales)
    resetLists();
    const para = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) &&
           !lines[i].match(/^(#{1,6})\s|^\s*([-*+]|\d+[.)])\s|^(\s*)(```|~~~)|^\s*>/)) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'para', text: para.join('\n') });
  }
  return blocks;
}

// ===========================================================================
//  Formato en línea (negrita / cursiva / código / tachado / enlaces)
// ===========================================================================
function parseInline(text) {
  const tokens = [];
  // Primero aislamos el código en línea para no tocar su contenido.
  const codeSplit = String(text).split(/(`[^`]+`)/g);
  for (const seg of codeSplit) {
    if (!seg) continue;
    if (seg.length >= 2 && seg[0] === '`' && seg[seg.length - 1] === '`') {
      tokens.push({ text: seg.slice(1, -1), code: true });
      continue;
    }
    // Enlaces [texto](url)
    const linkRe = /\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g;
    let last = 0, m;
    while ((m = linkRe.exec(seg))) {
      if (m.index > last) _emph(seg.slice(last, m.index), null, tokens);
      _emph(m[1], m[2], tokens);
      last = linkRe.lastIndex;
    }
    if (last < seg.length) _emph(seg.slice(last), null, tokens);
  }
  return tokens;
}

function _emph(t, href, out) {
  const re = /(\*\*\*([^*]+)\*\*\*|___([^_]+)___|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|~~([^~]+)~~)/g;
  let last = 0, m;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push({ text: t.slice(last, m.index), href });
    if (m[2] !== undefined || m[3] !== undefined) out.push({ text: m[2] ?? m[3], bold: true, italic: true, href });
    else if (m[4] !== undefined || m[5] !== undefined) out.push({ text: m[4] ?? m[5], bold: true, href });
    else if (m[6] !== undefined || m[7] !== undefined) out.push({ text: m[6] ?? m[7], italic: true, href });
    else if (m[8] !== undefined) out.push({ text: m[8], strike: true, href });
    last = re.lastIndex;
  }
  if (last < t.length) out.push({ text: t.slice(last), href });
}

function inlineHtml(text) {
  return parseInline(text).map((t) => {
    let s = _escHtml(t.text);
    if (t.code) {
      s = `<code>${s}</code>`;
    } else {
      if (t.bold) s = `<strong>${s}</strong>`;
      if (t.italic) s = `<em>${s}</em>`;
      if (t.strike) s = `<del>${s}</del>`;
    }
    if (t.href) s = `<a href="${_escAttr(t.href)}">${s}</a>`;
    return s;
  }).join('');
}

// ===========================================================================
//  Renderizado a HTML (para PDF)
// ===========================================================================
function _tableHtml(b) {
  let h = '<table><thead><tr>' + b.headers.map((c) => `<th>${inlineHtml(c)}</th>`).join('') + '</tr></thead><tbody>';
  for (const r of b.rows) h += '<tr>' + r.map((c) => `<td>${inlineHtml(c)}</td>`).join('') + '</tr>';
  return h + '</tbody></table>';
}

function blocksToHtml(blocks) {
  let html = '';
  const listStack = [];
  const closeOne = () => { const l = listStack.pop(); html += l.ordered ? '</ol>' : '</ul>'; };
  for (const b of blocks) {
    if (b.type === 'li') {
      while (listStack.length && listStack[listStack.length - 1].level > b.level) closeOne();
      if (!listStack.length || listStack[listStack.length - 1].level < b.level) {
        html += b.ordered ? '<ol>' : '<ul>';
        listStack.push({ ordered: b.ordered, level: b.level });
      } else if (listStack[listStack.length - 1].ordered !== b.ordered) {
        closeOne();
        html += b.ordered ? '<ol>' : '<ul>';
        listStack.push({ ordered: b.ordered, level: b.level });
      }
      html += `<li>${inlineHtml(b.text)}</li>`;
      continue;
    }
    while (listStack.length) closeOne();
    if (b.type === 'heading') html += `<h${b.level}>${inlineHtml(b.text)}</h${b.level}>`;
    else if (b.type === 'hr') html += '<hr>';
    else if (b.type === 'code') html += `<pre><code>${_escHtml(b.lines.join('\n'))}</code></pre>`;
    else if (b.type === 'quote') html += `<blockquote>${inlineHtml(b.text).replace(/\n/g, '<br>')}</blockquote>`;
    else if (b.type === 'table') html += _tableHtml(b);
    else if (b.type === 'para') html += `<p>${inlineHtml(b.text).replace(/\n/g, '<br>')}</p>`;
    // 'blank' se ignora
  }
  while (listStack.length) closeOne();
  return html;
}

const _PDF_CSS = `
.dm-export{font-family:Georgia,'Times New Roman',serif;font-size:12.5px;line-height:1.5;color:#1a1a1a;}
.dm-export .dm-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #222;padding-bottom:6px;margin-bottom:18px;}
.dm-export .dm-title{font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#222;}
.dm-export .dm-date{font-family:Arial,Helvetica,sans-serif;font-size:9.5px;color:#666;}
.dm-export h1{font-family:Arial,Helvetica,sans-serif;font-size:19px;margin:18px 0 9px;font-weight:700;color:#111;border-bottom:1px solid #ccc;padding-bottom:3px;}
.dm-export h2{font-family:Arial,Helvetica,sans-serif;font-size:16px;margin:16px 0 8px;font-weight:700;color:#111;}
.dm-export h3{font-family:Arial,Helvetica,sans-serif;font-size:13.5px;margin:14px 0 6px;font-weight:700;color:#222;}
.dm-export h4,.dm-export h5,.dm-export h6{font-family:Arial,Helvetica,sans-serif;font-size:12px;margin:12px 0 5px;font-weight:700;color:#333;}
.dm-export p{margin:7px 0;text-align:justify;}
.dm-export ul,.dm-export ol{margin:7px 0 7px 26px;padding:0;}
.dm-export li{margin:4px 0;text-align:justify;}
.dm-export hr{border:none;border-top:1px solid #d8d8d8;margin:16px 0;}
.dm-export code{font-family:Consolas,'Courier New',monospace;background:#f0f0f0;padding:1px 4px;border-radius:2px;font-size:11.5px;}
.dm-export pre{background:#f6f6f6;border:1px solid #e0e0e0;border-radius:3px;padding:10px 12px;white-space:pre-wrap;word-break:break-word;font-size:11.5px;line-height:1.45;}
.dm-export pre code{background:none;padding:0;}
.dm-export blockquote{margin:9px 0;padding:4px 14px;border-left:3px solid #bbb;color:#444;font-style:italic;}
.dm-export table{border-collapse:collapse;width:100%;margin:12px 0;font-size:11.5px;font-family:Arial,Helvetica,sans-serif;}
.dm-export th,.dm-export td{border:1px solid #bbb;padding:6px 9px;text-align:left;vertical-align:top;}
.dm-export th{background:#ececec;font-weight:700;}
.dm-export a{color:#1a1a1a;text-decoration:underline;}
.dm-export h1,.dm-export h2,.dm-export h3,.dm-export h4{page-break-after:avoid;}
.dm-export pre,.dm-export table,.dm-export blockquote{page-break-inside:avoid;}
`;

// ===========================================================================
//  Exportar a Markdown
// ===========================================================================
export function exportMarkdown(msgElement) {
  const raw = _getRaw(msgElement);
  if (!raw.trim()) return _empty();
  _download(new Blob([raw], { type: 'text/markdown;charset=utf-8' }), _baseName() + '.md');
  uiModule.showToast?.('Exportado como Markdown');
}

// ===========================================================================
//  Exportar a PDF
// ===========================================================================
export async function exportPdf(msgElement) {
  const raw = stripEmojis(_getRaw(msgElement));
  if (!raw.trim()) return _empty();
  try {
    await ensureHtml2Pdf();
  } catch (e) {
    uiModule.showError?.('No se pudo cargar la librería PDF');
    return;
  }
  const bodyHtml = blocksToHtml(parseBlocks(raw));
  const fecha = new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
  // El contenedor se renderiza dentro del documento (no fuera de pantalla, que
  // dejaba el PDF en blanco), colocado detrás de la app con z-index negativo.
  const container = document.createElement('div');
  container.className = 'dm-export';
  container.style.cssText = 'position:absolute;left:0;top:0;z-index:-1;width:794px;padding:28px 32px;background:#ffffff;';
  container.innerHTML =
    `<style>${_PDF_CSS}</style>` +
    `<div class="dm-head"><span class="dm-title">DarkMind-AI · Documento exportado</span><span class="dm-date">${_escHtml(fecha)}</span></div>` +
    bodyHtml;
  document.body.appendChild(container);
  try {
    const worker = window.html2pdf().set({
      margin: [18, 16, 20, 16],
      filename: _baseName() + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    }).from(container).toPdf();

    const pdf = await worker.get('pdf');
    // Pie de página con numeración, estilo documento serio.
    const total = pdf.internal.getNumberOfPages();
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    for (let i = 1; i <= total; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(130);
      pdf.text(`Página ${i} de ${total}`, w / 2, h - 8, { align: 'center' });
    }
    await worker.save();
    uiModule.showToast?.('Exportado como PDF');
  } catch (e) {
    uiModule.showError?.('No se pudo generar el PDF');
  } finally {
    container.remove();
  }
}

// ===========================================================================
//  Exportar a DOCX (Word)
// ===========================================================================
function _docxRuns(text, TextRun, extra) {
  const base = extra || {};
  const runs = parseInline(text)
    .filter((t) => t.text !== '')
    .map((t) => {
      const opt = Object.assign({ text: t.text }, base);
      if (t.bold) opt.bold = true;
      if (t.italic) opt.italics = true;
      if (t.strike) opt.strike = true;
      if (t.code) { opt.font = 'Consolas'; }
      return new TextRun(opt);
    });
  return runs.length ? runs : [new TextRun(Object.assign({ text: '' }, base))];
}

function _docxTable(b, docx) {
  const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType } = docx;
  const pct = (n) => ({ size: n, type: WidthType.PERCENTAGE });
  const cols = b.headers.length || 1;
  const colW = Math.floor(100 / cols);
  const mkCell = (txt, bold) => new TableCell({
    width: pct(colW),
    children: [new Paragraph({ children: _docxRuns(txt, TextRun, bold ? { bold: true } : undefined) })],
  });
  const rows = [new TableRow({ tableHeader: true, children: b.headers.map((c) => mkCell(c, true)) })];
  for (const r of b.rows) {
    const cells = [];
    for (let c = 0; c < cols; c++) cells.push(mkCell(r[c] || '', false));
    rows.push(new TableRow({ children: cells }));
  }
  return new Table({ width: pct(100), rows });
}

function blocksToDocx(blocks, docx) {
  const { Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType } = docx;
  const JUSTIFY = AlignmentType ? AlignmentType.JUSTIFIED : undefined;
  const HL = [null, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];
  const out = [];
  for (const b of blocks) {
    if (b.type === 'heading') {
      out.push(new Paragraph({ children: _docxRuns(b.text, TextRun), heading: HL[b.level] || HeadingLevel.HEADING_6 }));
    } else if (b.type === 'hr') {
      out.push(new Paragraph({ text: '', border: { bottom: { color: 'CCCCCC', space: 1, size: 6, style: BorderStyle.SINGLE } } }));
    } else if (b.type === 'code') {
      const lns = b.lines.length ? b.lines : [''];
      for (const ln of lns) {
        out.push(new Paragraph({
          children: [new TextRun({ text: ln || ' ', font: 'Consolas', size: 18 })],
          shading: { type: 'clear', fill: 'F2F2F2' },
        }));
      }
    } else if (b.type === 'quote') {
      out.push(new Paragraph({
        children: _docxRuns(b.text.replace(/\n/g, ' '), TextRun, { italics: true }),
        indent: { left: 480 },
        border: { left: { color: 'BBBBBB', space: 8, size: 18, style: BorderStyle.SINGLE } },
      }));
    } else if (b.type === 'li') {
      if (b.ordered) {
        out.push(new Paragraph({
          children: [new TextRun({ text: (b.num || 1) + '. ' }), ..._docxRuns(b.text, TextRun)],
          indent: { left: 360 * (b.level + 1), hanging: 260 },
        }));
      } else {
        out.push(new Paragraph({ children: _docxRuns(b.text, TextRun), bullet: { level: b.level } }));
      }
    } else if (b.type === 'table') {
      try {
        out.push(_docxTable(b, docx));
        out.push(new Paragraph({ text: '' }));
      } catch (_) {
        out.push(new Paragraph({ children: _docxRuns(b.headers.join('  |  '), TextRun, { bold: true }) }));
        for (const r of b.rows) out.push(new Paragraph({ children: _docxRuns(r.join('  |  '), TextRun) }));
      }
    } else if (b.type === 'para') {
      out.push(new Paragraph({ children: _docxRuns(b.text.replace(/\n/g, ' '), TextRun), alignment: JUSTIFY }));
    }
    // 'blank' se omite (Word ya separa los párrafos)
  }
  return out.length ? out : [new Paragraph({ text: '' })];
}

export async function exportDocx(msgElement) {
  const raw = stripEmojis(_getRaw(msgElement));
  if (!raw.trim()) return _empty();
  try {
    await ensureDocx();
  } catch (e) {
    uiModule.showError?.('No se pudo cargar la librería DOCX');
    return;
  }
  try {
    const docx = window.docx;
    const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } = docx;
    const fecha = new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
    // Cabecera seria: título, fecha y una regla.
    const header = [
      new Paragraph({
        children: [new TextRun({ text: 'DARKMIND-AI · DOCUMENTO EXPORTADO', bold: true, font: 'Arial', size: 20, color: '222222' })],
      }),
      new Paragraph({
        children: [new TextRun({ text: fecha, font: 'Arial', size: 16, color: '777777' })],
        border: { bottom: { color: '222222', space: 4, size: 12, style: BorderStyle.SINGLE } },
        spacing: { after: 240 },
      }),
    ];
    const children = header.concat(blocksToDocx(parseBlocks(raw), docx));
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: 'Georgia', size: 22 },           // 11 pt
            paragraph: { spacing: { line: 288, after: 120 } }, // ~1,2 de interlineado
          },
        },
      },
      sections: [{ children }],
    });
    const blob = await Packer.toBlob(doc);
    _download(blob, _baseName() + '.docx');
    uiModule.showToast?.('Exportado como DOCX');
  } catch (e) {
    uiModule.showError?.('No se pudo generar el DOCX');
  }
}

// ===========================================================================
//  Despachador
// ===========================================================================
export function exportMessage(msgElement, format) {
  if (format === 'md') return exportMarkdown(msgElement);
  if (format === 'pdf') return exportPdf(msgElement);
  if (format === 'docx') return exportDocx(msgElement);
}

export default { exportMessage, exportMarkdown, exportPdf, exportDocx };
