/**
 * Static markup for misc floating popups that live above the canvas.
 *
 * All pure DOM. Caller wires every ID via document.getElementById /
 * el.querySelector after appending.
 */

/** Keyboard-shortcuts popover. */
export function shortcutsPopupHTML() {
  return `
      <div id="ge-shortcuts-handle" style="display:flex;align-items:center;gap:6px;margin:-4px -6px 4px;padding:4px 6px;cursor:grab;user-select:none;touch-action:none;">
        <span style="display:inline-flex;flex-direction:column;gap:2px;margin-right:2px;opacity:0.35;">
          <span style="display:block;width:18px;height:2px;border-radius:1px;background:currentColor;"></span>
          <span style="display:block;width:18px;height:2px;border-radius:1px;background:currentColor;"></span>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.8"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></svg>
        <strong style="font-size:12px;letter-spacing:0.3px;">Atajos del editor</strong>
        <span style="flex:1"></span>
        <button id="ge-shortcuts-close" class="ge-btn ge-btn-sm" style="padding:0 6px;height:20px;line-height:1;background:none;border:none;opacity:0.55;cursor:pointer;color:var(--fg);">✖</button>
      </div>
      <div class="ge-shortcuts-grid">
        <div class="ge-shortcuts-col">
          <h5>Herramientas</h5>
          <div><kbd>V</kbd> Mover</div>
          <div><kbd>T</kbd> Transformar</div>
          <div><kbd>B</kbd> Pincel</div>
          <div><kbd>E</kbd> Borrador</div>
          <div><kbd>K</kbd> Sello de clonar <span style="opacity:0.5">(Alt+clic = fijar origen)</span></div>
          <div><kbd>L</kbd> Lazo</div>
          <div><kbd>W</kbd> Varita</div>
          <div><kbd>M</kbd> Inpaint</div>
          <div><kbd>E</kbd> Borrador</div>
          <div><kbd>C</kbd> Recortar</div>
          <div><kbd>S</kbd> Enfocar</div>
        </div>
        <div class="ge-shortcuts-col">
          <h5>Editar</h5>
          <div><kbd>Ctrl</kbd>+<kbd>Z</kbd> Deshacer</div>
          <div><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> Rehacer</div>
          <div><kbd>Ctrl</kbd>+<kbd>S</kbd> Guardar</div>
          <div><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> Guardar en galería</div>
          <div><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>J</kbd> Nueva capa</div>
          <div><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> Transformación libre</div>
          <div><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> Tamaño del lienzo…</div>
        </div>
        <div class="ge-shortcuts-col">
          <h5>Selección</h5>
          <div><kbd>Ctrl</kbd>+<kbd>A</kbd> Seleccionar todo</div>
          <div><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> Deseleccionar</div>
          <div><kbd>Ctrl</kbd>+<kbd>C</kbd> Copiar a capa</div>
          <div><kbd>Ctrl</kbd>+<kbd>X</kbd> Cortar lazo</div>
          <div><kbd>Ctrl</kbd>+<kbd>D</kbd> Eliminar píxeles</div>
          <div><kbd>Esc</kbd> Cancelar selección / recorte</div>
        </div>
        <div class="ge-shortcuts-col">
          <h5>Pincel / Máscara</h5>
          <div><kbd>[</kbd> Tamaño del pincel −</div>
          <div><kbd>]</kbd> Tamaño del pincel +</div>
          <div>Arrastra el control de tolerancia → reajuste en vivo de la varita</div>
        </div>
      </div>
      <div style="margin-top:8px;font-size:10px;opacity:0.5;text-align:center;">Pulsa <kbd>?</kbd> o haz clic en el icono del teclado para alternar.</div>
    `;
}


/**
 * History panel — sidebar listing all undo entries.
 * @param {string} historyIcon  Inline SVG markup for the title icon.
 */
export function historyPanelHTML(historyIcon) {
  return `
    <div class="ge-history-head" data-history-drag>
      <span class="ge-adj-icon">${historyIcon}</span>
      <span class="ge-history-title">Historial</span>
      <span class="ge-head-btns">
        <button class="ge-adj-min" type="button" title="Minimizar">&minus;</button>
      </span>
    </div>
    <div class="ge-history-list" id="ge-history-list"></div>
  `;
}


/**
 * Empty-canvas size-prompt modal — body markup (caller controls show /
 * hide and wires the Cancel / Create buttons).
 */
export function canvasSizePromptHTML() {
  return `
        <div class="modal-content ge-canvas-prompt">
          <div class="modal-header"><h4 id="ge-canvas-prompt-title">Nuevo lienzo</h4></div>
          <div class="modal-body">
            <div class="ge-canvas-prompt-row">
              <label class="ge-canvas-prompt-field">
                <span>Ancho</span>
                <input type="text" id="ge-canvas-prompt-w" inputmode="numeric" value="1024">
              </label>
              <span class="ge-canvas-prompt-x">×</span>
              <label class="ge-canvas-prompt-field">
                <span>Alto</span>
                <input type="text" id="ge-canvas-prompt-h" inputmode="numeric" value="1024">
              </label>
            </div>
            <p class="ge-canvas-prompt-hint">Píxeles, o escribe una relación como 3x5 / 16:9 en cualquier campo.</p>
          </div>
          <div class="modal-footer">
            <button class="confirm-btn confirm-btn-secondary" id="ge-canvas-prompt-cancel">Cancelar</button>
            <button class="confirm-btn confirm-btn-primary" id="ge-canvas-prompt-ok">Crear</button>
          </div>
        </div>`;
}
