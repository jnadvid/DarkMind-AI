// Exportación de respuestas del asistente a Markdown (.md), PDF (.pdf) y Word (.docx).
//
// Reutiliza las librerías ya incluidas en el editor de documentos
// (/static/lib/html2pdf.bundle.min.js y /static/lib/docx.umd.min.js), que se
// cargan de forma diferida solo cuando el usuario exporta por primera vez.
//
// Autor del proyecto: José Israel Nadal Vidal
import markdownModule from './markdown.js';
import uiModule from './ui.js';

// ---- Carga diferida de librerías -----------------------------------------
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

// ---- Utilidades ----------------------------------------------------------
function _esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function _baseName() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `darkmind-respuesta-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

// El markdown crudo de cada respuesta se guarda en msgElement.dataset.raw
// (es lo mismo que usa el botón «Copiar»). Como respaldo, el texto del cuerpo.
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

function _empty() {
  uiModule.showToast?.('No hay contenido que exportar');
}

// ---- Markdown ------------------------------------------------------------
export function exportMarkdown(msgElement) {
  const raw = _getRaw(msgElement);
  if (!raw.trim()) return _empty();
  _download(new Blob([raw], { type: 'text/markdown;charset=utf-8' }), _baseName() + '.md');
  uiModule.showToast?.('Exportado como Markdown');
}

// ---- PDF -----------------------------------------------------------------
export async function exportPdf(msgElement) {
  const raw = _getRaw(msgElement);
  if (!raw.trim()) return _empty();
  try {
    await ensureHtml2Pdf();
  } catch (e) {
    uiModule.showError?.('No se pudo cargar la librería PDF');
    return;
  }
  let html = '';
  try {
    if (markdownModule && markdownModule.mdToHtml) {
      html = markdownModule.mdToHtml(raw, { shortcodes: false });
    }
  } catch (_) { html = ''; }
  if (!html) {
    html = '<pre style="white-space:pre-wrap;font-family:monospace;font-size:11px;">' + _esc(raw) + '</pre>';
  }
  const container = document.createElement('div');
  container.style.cssText = 'padding:20px;font-family:sans-serif;font-size:12px;color:#000;background:#fff;line-height:1.6;';
  container.innerHTML = html;
  window.html2pdf().set({
    margin: 10,
    filename: _baseName() + '.pdf',
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(container).save();
  uiModule.showToast?.('Exportando PDF...');
}

// ---- DOCX (Word) ---------------------------------------------------------
export async function exportDocx(msgElement) {
  const raw = _getRaw(msgElement);
  if (!raw.trim()) return _empty();
  try {
    await ensureDocx();
  } catch (e) {
    uiModule.showError?.('No se pudo cargar la librería DOCX');
    return;
  }
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx;
  // Conversión sencilla de Markdown a párrafos de Word: encabezados (#, ##, ###)
  // y negrita/cursiva en línea. (Mismo enfoque que el editor de documentos.)
  const paragraphs = raw.split('\n').map((line) => {
    const h1 = line.match(/^# (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h1) return new Paragraph({ text: h1[1], heading: HeadingLevel.HEADING_1 });
    if (h2) return new Paragraph({ text: h2[1], heading: HeadingLevel.HEADING_2 });
    if (h3) return new Paragraph({ text: h3[1], heading: HeadingLevel.HEADING_3 });
    const runs = [];
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
    for (const part of parts) {
      if (part.startsWith('**') && part.endsWith('**')) {
        runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
      } else if (part.startsWith('*') && part.endsWith('*')) {
        runs.push(new TextRun({ text: part.slice(1, -1), italics: true }));
      } else if (part) {
        runs.push(new TextRun(part));
      }
    }
    return new Paragraph({ children: runs });
  });
  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  _download(blob, _baseName() + '.docx');
  uiModule.showToast?.('Exportado como DOCX');
}

// ---- Despachador ---------------------------------------------------------
export function exportMessage(msgElement, format) {
  if (format === 'md') return exportMarkdown(msgElement);
  if (format === 'pdf') return exportPdf(msgElement);
  if (format === 'docx') return exportDocx(msgElement);
}

export default { exportMessage, exportMarkdown, exportPdf, exportDocx };
