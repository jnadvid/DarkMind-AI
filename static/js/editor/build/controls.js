/**
 * Build the editor's right-panel controls innerHTML.
 *
 * Returns the string — caller creates the wrapper element, attaches its
 * own touch / swipe-to-dismiss listeners, then sets innerHTML. Per-tool
 * sections are all toggled `display:none` here; the tool-switch handler
 * in galleryEditor.js shows the section matching the active tool.
 *
 * @param {{ color: string, brushSize: number, wandTolerance: number }} ctx
 * @returns {string}
 */
export function controlsHTML({ color, brushSize, wandTolerance }) {
  const brushSliderValue = Math.round(Math.log(Math.max(1, brushSize)) / Math.log(800) * 1000);
  return `
    <div id="ge-brush-controls">
      <div class="ge-control-row" id="ge-color-row">
        <label>Color</label>
        <input type="color" class="ge-color-picker" value="${color}" />
      </div>
      <div class="ge-control-row">
        <label>Tamaño <span class="ge-size-label">${brushSize}px</span></label>
      <input type="range" class="ge-size-slider" min="0" max="1000" value="${brushSliderValue}" />
    </div>
    </div>
    <div class="ge-lasso-section" id="ge-lasso-section" style="display:none;">
      <div class="ge-control-row ge-eraser-row ge-sel-refine" id="ge-lasso-refine-feather" style="display:none;">
        <span class="ge-eraser-preview" id="ge-lasso-feather-preview" aria-hidden="true"></span>
        <label>Suavizar borde <span id="ge-lasso-feather-label">0px</span></label>
        <input type="range" id="ge-lasso-feather" min="0" max="200" value="0" title="Suaviza el borde de la selección — aplica desenfoque al alfa de la máscara." />
      </div>
      <div class="ge-control-row ge-eraser-row ge-sel-refine" id="ge-lasso-refine-grow" style="display:none;">
        <span class="ge-eraser-preview" id="ge-lasso-grow-preview" aria-hidden="true"></span>
        <label>Trazo de borde <span id="ge-lasso-grow-label">0px</span></label>
        <input type="range" id="ge-lasso-grow" min="-40" max="40" value="0" title="Expandir (+) o contraer (−) la selección antes de aplicar." />
      </div>
      <div class="ge-control-row ge-actions" style="margin-top:4px;flex-wrap:wrap;">
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-lasso-invert" title="Invertir selección (Ctrl+Alt+I)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          Invertir
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-lasso-delete" title="Eliminar píxeles seleccionados de la capa">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          Eliminar
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-lasso-copy" title="Copiar selección a nueva capa">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copiar capa
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-lasso-mask" title="Convertir selección en máscara de inpaint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
          A máscara
        </button>
      </div>
      <p style="font-size:9px;opacity:0.4;margin:4px 0 0;">Dibuja una selección a mano alzada. Esc para cancelar.</p>
    </div>
    <div class="ge-wand-section" id="ge-wand-section" style="display:none;">
      <div class="ge-control-row" style="display:flex;gap:4px;margin-bottom:4px;" title="How the next click combines with the current selection. Shift / Alt held during a click override this for one click.">
        <button type="button" class="ge-btn ge-btn-sm ge-wand-mode-btn active" data-wand-mode="replace" title="Reemplazar selección en cada clic">Nueva</button>
        <button type="button" class="ge-btn ge-btn-sm ge-wand-mode-btn" data-wand-mode="add" title="Añadir a la selección (Shift)">+ Añadir</button>
        <button type="button" class="ge-btn ge-btn-sm ge-wand-mode-btn" data-wand-mode="subtract" title="Restar de la selección (Alt)">− Restar</button>
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-wand-tol-preview" aria-hidden="true"></span>
        <label>Tolerancia <span id="ge-wand-tol-label">${wandTolerance}</span></label>
        <button type="button" class="ge-btn ge-btn-sm ge-wand-live-btn" id="ge-wand-live" title="Reajustar la selección al arrastrar la tolerancia" aria-pressed="false">En vivo</button>
        <input type="range" id="ge-wand-tolerance" min="0" max="100" value="${wandTolerance}" />
      </div>
      <div class="ge-control-row ge-eraser-row ge-sel-refine" id="ge-wand-refine-feather" style="display:none;">
        <span class="ge-eraser-preview" id="ge-wand-feather-preview" aria-hidden="true"></span>
        <label>Suavizar borde <span id="ge-wand-feather-label">0px</span></label>
        <input type="range" id="ge-wand-feather" min="0" max="200" value="0" title="Suaviza el borde de la selección — aplica desenfoque al alfa de la máscara." />
      </div>
      <div class="ge-control-row ge-eraser-row ge-sel-refine" id="ge-wand-refine-grow" style="display:none;">
        <span class="ge-eraser-preview" id="ge-wand-grow-preview" aria-hidden="true"></span>
        <label>Trazo de borde <span id="ge-wand-grow-label">0px</span></label>
        <input type="range" id="ge-wand-grow" min="-40" max="40" value="0" title="Expandir (+) o contraer (−) la selección antes de aplicar." />
      </div>
      <div class="ge-control-row ge-actions" style="margin-top:4px;flex-wrap:wrap;">
        <button class="ge-btn ge-btn-sm ge-mask-vis-btn visible" id="ge-wand-vis" title="Ocultar superposición de selección" aria-label="Alternar superposición de selección">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-wand-clear" title="Limpiar la selección">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          Limpiar
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-wand-invert" title="Invertir selección (Ctrl+Alt+I)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          Invertir
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-wand-delete" title="Eliminar píxeles seleccionados de la capa">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          Borrar
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-wand-copy" title="Copiar selección a nueva capa">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copiar capa
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-wand-mask" title="Añadir selección a la máscara de inpaint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
          A máscara
        </button>
      </div>
      <p style="font-size:9px;opacity:0.4;margin:4px 0 0;">Haz clic en una región para seleccionar píxeles similares. Shift+clic para añadir, Alt+clic para restar. Esc para limpiar.</p>
    </div>
    <div class="ge-inpaint-section" id="ge-inpaint-section" style="display:none;">
      <div class="ge-inpaint-popover-head" data-inpaint-drag>
        <div class="ge-section-title ge-section-title-with-help ge-inpaint-popover-title"><span>INPAINT</span><span class="ge-section-help" tabindex="0" role="img" aria-label="Cómo funciona el inpaint" title="Pinta el área que quieres que redibuje la IA — la previsualización roja marca la región de la máscara. Usa Pintar para añadir, Borrar para restar (o mantén Ctrl+Alt para invertir durante un trazo). Generar rellena con lo que describe tu prompt; Eliminar rellena con el fondo circundante.">?</span></div>
        <button class="ge-inpaint-popover-close" id="ge-inpaint-popover-close" type="button" title="Cerrar panel de inpaint" aria-label="Cerrar panel de inpaint">&times;</button>
      </div>
      <div class="ge-section-title ge-section-title-with-help"><span>INPAINT</span><span class="ge-section-help" tabindex="0" role="img" aria-label="Cómo funciona el inpaint" title="Pinta el área que quieres que redibuje la IA — la previsualización roja marca la región de la máscara. Usa Pintar para añadir, Borrar para restar (o mantén Ctrl+Alt para invertir durante un trazo). Generar rellena con lo que describe tu prompt; Eliminar rellena con el fondo circundante.">?</span></div>
      <p class="ge-section-hint" style="margin-top:0;">
        Genera o elimina a partir de la máscara seleccionada. Ajusta <strong>Fuerza</strong> antes y <strong>Suavizar / trazo de borde</strong> después.
      </p>
      <div class="ge-section-title" style="margin-top:8px;display:flex;align-items:center;gap:6px;">
        <span>Pincel de máscara</span>
        <input type="color" class="ge-color-picker ge-inpaint-mask-color" value="#ff6e6e" title="Color de superposición de la máscara — solo visual; el modelo siempre ve una máscara dura." />
      </div>
      <div class="ge-control-row" style="display:flex;gap:4px;margin-bottom:4px;" title="Mantén Ctrl+Alt para invertir temporalmente durante un trazo.">
        <button type="button" class="ge-btn ge-btn-sm ge-inpaint-mode-btn active" id="ge-inpaint-mode-paint" style="flex:1 1 0;display:inline-flex;align-items:center;justify-content:center;gap:4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
          Pintar
        </button>
        <button type="button" class="ge-btn ge-btn-sm ge-inpaint-mode-btn" id="ge-inpaint-mode-erase" style="flex:1 1 0;display:inline-flex;align-items:center;justify-content:center;gap:4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 14.6 14.6 19.4a2 2 0 0 1-2.83 0L4.6 12.23a2 2 0 0 1 0-2.83l7.17-7.17a2 2 0 0 1 2.83 0l4.8 4.8a2 2 0 0 1 0 2.83Z"/><line x1="22" y1="21" x2="7" y2="21"/><line x1="14" y1="3" x2="9" y2="8"/></svg>
          Borrar
        </button>
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-inpaint-brush-preview" aria-hidden="true"></span>
        <label>Tamaño del pincel de máscara <span id="ge-inpaint-brush-label">${brushSize}px</span></label>
        <input type="range" id="ge-inpaint-brush-slider" min="0" max="1000" value="${brushSliderValue}" title="Brush diameter (log scale 1→800px). Use [ and ] for ±10%." />
      </div>
      <div class="ge-control-row ge-actions ge-inpaint-mask-row" style="margin-top:4px;">
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel ge-mask-vis-btn visible" id="ge-mask-vis" title="Ocultar máscara">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span id="ge-mask-vis-label">Ocultar</span>
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-inpaint-invert" title="Invertir máscara">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          Invertir
        </button>
        <button class="ge-btn ge-btn-sm ge-btn-iconlabel" id="ge-inpaint-clear" title="Limpiar máscara">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          Limpiar
        </button>
      </div>
      <hr class="ge-section-divider" />
      <div class="ge-section-title" style="margin-top:8px;"><span>PROMPT</span></div>
      <input type="text" class="ge-inpaint-prompt" id="ge-inpaint-prompt" placeholder="Con qué rellenar el área enmascarada..." />
      <div class="ge-control-row ge-inpaint-model-row" style="margin-top:6px;">
        <label for="ge-ai-inpaint">Modelo</label>
        <select id="ge-ai-inpaint" class="ge-ai-model" title="Modelo para inpainting">
          <option value="">Auto</option>
          <option value="" disabled>──────────</option>
          <option value="__serve_cookbook__">+ Serve a model in Cookbook…</option>
        </select>
      </div>
      <div class="ge-control-row ge-eraser-row" style="margin-top:6px;">
        <span class="ge-eraser-preview" id="ge-strength-preview" aria-hidden="true"></span>
        <label>Fuerza <span id="ge-strength-label">0.75</span><span class="ge-section-help" tabindex="0" role="img" aria-label="Ayuda de fuerza" title="Cuánto redibuja la IA dentro de la máscara. 0 = sin cambio · 1 = regeneración completa desde tu prompt. Recomendado: 0.9–1.0 para añadir/reemplazar un objeto, 0.6–0.8 para cambiar material o color, 0.3–0.5 para retoques sutiles. El valor predeterminado 0.75 funciona para la mayoría de ediciones.">?</span></label>
        <input type="range" id="ge-strength-slider" min="10" max="100" value="75" title="Cuánto redibuja la IA dentro de la máscara (0 = sin cambio, 1 = difusión completa)." />
      </div>
      <div class="ge-control-row ge-actions" style="margin-top:6px;display:flex;gap:6px;align-items:center;min-width:0;">
        <button class="ge-btn ge-btn-primary ge-btn-ai" id="ge-inpaint-run" style="flex:1 1 0;display:inline-flex;align-items:center;justify-content:center;gap:6px;" title="Rellena el área enmascarada con lo que describe tu prompt.">
          <span class="ge-btn-ai-mark" aria-hidden="true">✦</span>
          <span id="ge-inpaint-run-label">Generar</span>
        </button>
        <button class="ge-btn ge-btn-ai" id="ge-inpaint-remove" style="flex:1 1 0;display:inline-flex;align-items:center;justify-content:center;gap:6px;" title="Borra el contenido enmascarado y rellena con el fondo circundante. Ignora el prompt.">
          <span class="ge-btn-ai-mark" aria-hidden="true">✦</span>
          <span id="ge-inpaint-remove-label">Eliminar</span>
        </button>
        <button class="ge-btn ge-btn-ai" id="ge-inpaint-outpaint" style="flex:1 1 0;display:inline-flex;align-items:center;justify-content:center;gap:6px;" title="Rellena las áreas vacías (transparentes) del lienzo con contenido generado por IA que se integra con la imagen existente. Ignora el pincel de máscara.">
          <span class="ge-btn-ai-mark" aria-hidden="true">✦</span>
          <span id="ge-inpaint-outpaint-label">Outpaint</span>
        </button>
      </div>
      <hr class="ge-section-divider" id="ge-inpaint-postedge-divider" style="margin-top:14px;" />
      <div class="ge-section-title ge-section-title-with-help" id="ge-inpaint-postedge-title"><span>POSTPROCESO</span><span class="ge-section-help" tabindex="0" role="img" aria-label="Qué hace esto" title="Recorte de borde en vivo para la última capa de resultado Inpaint. Suavizar borde suaviza el límite alfa; Trazo de borde expande (+) o contrae (−) el borde visible hacia el buffer de IA generado alrededor de tu pincel.">?</span></div>
      <p class="ge-section-hint" id="ge-inpaint-postedge-hint" style="margin-top:0;opacity:0.45;">
        Disponible tras Generar.
      </p>
      <div class="ge-control-row ge-eraser-row" id="ge-inpaint-postfeather-row" style="display:none;">
        <span class="ge-eraser-preview" id="ge-feather-preview" aria-hidden="true"></span>
        <label>Suavizar borde <span id="ge-feather-label">0px</span></label>
        <input type="range" id="ge-feather-slider" min="0" max="200" value="0" title="Desenfoca el borde alfa del resultado del inpaint — arrastra para integrar el relleno de IA con la imagen circundante. Se actualiza en vivo." />
      </div>
      <div class="ge-control-row ge-eraser-row" id="ge-inpaint-edgestroke-row" style="display:none;">
        <span class="ge-eraser-preview" id="ge-edgestroke-preview" aria-hidden="true"></span>
        <label>Trazo de borde <span id="ge-edgestroke-label">0px</span></label>
        <input type="range" id="ge-edgestroke-slider" min="-80" max="80" value="0" title="Expandir (+) o contraer (−) el borde de la capa inpaint antes de suavizar. Usa el buffer de IA generado alrededor de tu pincel." />
      </div>
    </div>
    <div class="ge-eraser-section" id="ge-clone-section" style="display:none;">
      <div class="ge-section-title ge-section-title-with-help"><span>Clonar</span><span class="ge-section-help" tabindex="0" role="img" aria-label="Cómo funciona el clonar" title="Alt+clic (escritorio) o doble toque (móvil) en el lienzo para fijar el origen. Luego arrastra para clonar esos píxeles en la capa activa. El punto de origen se mueve con el pincel para que el desplazamiento sea constante. Tamaño / Opacidad / Flujo / Suavidad provienen del panel Pincel.">?</span></div>
      <p class="ge-section-hint" style="margin-top:0;">
        <strong class="ge-clone-hint-desktop">Alt+clic</strong><strong class="ge-clone-hint-mobile">Doble toque</strong> para fijar origen · arrastra para pintar
      </p>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-clone-preview-opacity" aria-hidden="true"></span>
        <label>Opacidad <span id="ge-clone-opacity-label">100%</span></label>
        <input type="range" id="ge-clone-opacity" min="10" max="100" value="100" />
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-clone-preview-flow" aria-hidden="true"></span>
        <label>Flujo <span id="ge-clone-flow-label">100%</span></label>
        <input type="range" id="ge-clone-flow" min="5" max="100" value="100" />
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-clone-preview-softness" aria-hidden="true"></span>
        <label>Suavidad <span id="ge-clone-softness-label">100%</span></label>
        <input type="range" id="ge-clone-softness" min="0" max="300" value="100" title="Borde suave del pincel — desenfoca cada sello para un fundido suave." />
      </div>
    </div>
    <div class="ge-eraser-section" id="ge-brush-section" style="display:none;">
      <div class="ge-section-title">Pincel</div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-brush-preview-opacity" aria-hidden="true"></span>
        <label>Opacidad <span id="ge-brush-opacity-label">100%</span></label>
        <input type="range" id="ge-brush-opacity" min="10" max="100" value="100" />
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-brush-preview-flow" aria-hidden="true"></span>
        <label>Flujo <span id="ge-brush-flow-label">100%</span></label>
        <input type="range" id="ge-brush-flow" min="5" max="100" value="100" />
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-brush-preview-softness" aria-hidden="true"></span>
        <label>Suavidad <span id="ge-brush-softness-label">100%</span></label>
        <input type="range" id="ge-brush-softness" min="0" max="300" value="100" title="Borde suave del pincel — desenfoca el alfa del trazo para un fundido suave en el perímetro." />
      </div>
    </div>
    <div class="ge-eraser-section" id="ge-eraser-section" style="display:none;">
      <div class="ge-section-title">Borrador</div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-eraser-preview-opacity" aria-hidden="true"></span>
        <label>Opacidad <span id="ge-eraser-opacity-label">100%</span></label>
        <input type="range" id="ge-eraser-opacity" min="10" max="100" value="100" />
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-eraser-preview-flow" aria-hidden="true"></span>
        <label>Flujo <span id="ge-eraser-flow-label">100%</span></label>
        <input type="range" id="ge-eraser-flow" min="5" max="100" value="100" />
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-eraser-preview-softness" aria-hidden="true"></span>
        <label>Suavidad <span id="ge-eraser-softness-label">100%</span></label>
        <input type="range" id="ge-eraser-softness" min="0" max="300" value="100" title="Borde suave del pincel — desenfoca el alfa del trazo para que el borrador se desvanezca en el perímetro." />
      </div>
    </div>
    <div class="ge-sharpen-section" id="ge-sharpen-section" style="display:none;">
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-sharpen-preview" aria-hidden="true"></span>
        <label>Cantidad <span id="ge-sharpen-label">50%</span></label>
        <input type="range" id="ge-sharpen-amount" min="10" max="100" value="50" />
      </div>
      <div class="ge-control-row ge-actions" style="margin-top:4px;">
        <button class="ge-btn ge-btn-primary" id="ge-sharpen-run">Enfocar</button>
      </div>
    </div>
    <div class="ge-rembg-section" id="ge-rembg-section" style="display:none;">
      <div class="ge-section-title ge-section-title-with-help"><span>Eliminar fondo</span><span class="ge-section-help" tabindex="0" role="img" aria-label="Qué hace esto" title="Ejecuta un modelo de ML que conserva lo que aprendió a llamar primer plano (normalmente una persona, producto o animal). Si tienes una selección de Lazo o Varita activa, se usa como pista — el modelo solo mira dentro de esa región y lo que está fuera se vuelve transparente.">?</span></div>
      <div class="ge-dep-notice" id="ge-rembg-dep-missing" style="display:none;">
        <div class="ge-dep-notice-text">
          <strong>rembg no instalado.</strong>
          Eliminar fondo necesita el paquete <code>rembg</code> en este
          servidor. Haz clic para instalarlo desde Cookbook → Dependencias.
        </div>
        <button type="button" class="ge-btn ge-btn-sm" id="ge-rembg-install-link">Instalar rembg</button>
      </div>
      <div class="ge-control-row ge-actions" id="ge-rembg-run-row">
        <button class="ge-btn ge-btn-primary ge-btn-ai" id="ge-rembg-run">
          <span class="ge-btn-ai-mark" aria-hidden="true">✦</span>
          Elim. fondo
        </button>
      </div>
      <hr class="ge-section-divider" />
      <div class="ge-section-title ge-section-title-with-help"><span>Limpieza de bordes</span><span class="ge-section-help" tabindex="0" role="img" aria-label="Qué hace esto" title="Se aplica en vivo a la última capa con fondo eliminado. Suavizar suaviza el borde; Borde lo desplaza hacia dentro (−) o fuera (+).">?</span></div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-rembg-feather-preview" aria-hidden="true"></span>
        <label>Suavizar <span id="ge-rembg-feather-label">0px</span></label>
        <input type="range" id="ge-rembg-feather" min="0" max="20" value="0" />
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-rembg-grow-preview" aria-hidden="true"></span>
        <label>Borde <span id="ge-rembg-grow-label">0px</span></label>
        <input type="range" id="ge-rembg-grow" min="-10" max="10" value="0" />
      </div>
    </div>
    <div class="ge-import-section" id="ge-import-section" style="display:none;">
      <p style="font-size:10px;opacity:0.5;margin:0 0 6px;">Importa una imagen como nueva capa. Arrástrala para posicionarla.</p>
      <div class="ge-control-row ge-actions">
        <button class="ge-btn" id="ge-import-file">Archivo</button>
        <button class="ge-btn" id="ge-import-paste">Portapapeles</button>
        <button class="ge-btn" id="ge-import-gallery">Galería</button>
      </div>
    </div>
    <div class="ge-harmonize-section" id="ge-harmonize-section" style="display:none;">
      <div class="ge-section-title">Armonizar <span class="ge-section-help" tabindex="0" role="img" title="Integra las capas pegadas en la foto base. Igualar color ajusta la iluminación/tono de la capa para que coincida con el entorno (sin redibujado de píxeles). Corregir costura usa inpaint para limpiar bordes irregulares del recorte (necesita un modelo img2img/inpaint propio).">?</span></div>
      <div class="ge-control-row ge-tool-model-row">
        <label>Modelo</label>
        <select class="ge-tool-model" data-ge-tool-model="harmonize" title="Modelo para armonizar">
          <option value="">Auto</option>
        </select>
      </div>
      <div class="ge-control-row">
        <label style="font-size:11px;opacity:0.6;">Prompt (solo si Corregir costura &gt; 0)</label>
      </div>
      <input type="text" class="ge-inpaint-prompt" id="ge-harmonize-prompt" placeholder="fotorrealista, iluminación natural, integración perfecta..." />
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-harmonize-color-preview" aria-hidden="true"></span>
        <label>Igualar color <span id="ge-harmonize-color-label">0.65</span></label>
        <input type="range" id="ge-harmonize-color" min="0" max="100" value="65" title="Cuánto del desplazamiento de color/luminancia de Reinhard aplicar. 0 = sin ajuste, 1 = igualar totalmente el entorno." />
      </div>
      <div class="ge-control-row ge-eraser-row">
        <span class="ge-eraser-preview" id="ge-harmonize-seam-preview" aria-hidden="true"></span>
        <label>Corregir costura <span id="ge-harmonize-seam-label">0.00</span></label>
        <input type="range" id="ge-harmonize-seam" min="0" max="100" value="0" title="Fuerza del pasado de inpaint estrecho en la banda del borde alfa. 0 = desactivado, 1 = mezcla máxima en el límite." />
      </div>
      <div class="ge-control-row ge-actions" style="margin-top:4px;">
        <button class="ge-btn ge-btn-primary" id="ge-harmonize-run">Armonizar</button>
      </div>
    </div>
    <div class="ge-style-section" id="ge-style-section" style="display:none;">
      <p style="font-size:10px;opacity:0.5;margin:0 0 6px;">Aplica un estilo artístico a la imagen usando img2img. Requiere un modelo de difusión en ejecución.</p>
      <div class="ge-control-row ge-tool-model-row">
        <label>Modelo</label>
        <select class="ge-tool-model" data-ge-tool-model="style" title="Modelo para transferencia de estilo">
          <option value="">Auto</option>
        </select>
      </div>
      <div class="ge-control-row">
        <label style="font-size:11px;opacity:0.6;">Prompt de estilo</label>
      </div>
      <input type="text" class="ge-inpaint-prompt" id="ge-style-prompt" placeholder="óleo, impresionista, Van Gogh..." />
      <div class="ge-control-row">
        <label style="font-size:11px;opacity:0.6;">Fuerza <span id="ge-style-strength-label">0.55</span></label>
        <input type="range" id="ge-style-strength" min="10" max="90" value="55" style="flex:1;" />
      </div>
      <div class="ge-control-row ge-actions" style="margin-top:4px;">
        <button class="ge-btn ge-btn-primary" id="ge-style-run">Aplicar estilo</button>
      </div>
    </div>
  `;
}


/**
 * Layer-panel header markup. Static; static IDs are wired by the caller.
 * @returns {string}
 */
export function layerPanelHTML() {
  return `<div class="ge-layers-header">
      <span class="ge-layers-grab"></span>
      <span class="ge-layers-title">Capas</span>
      <button class="ge-btn ge-btn-sm ge-icon-btn" id="ge-merge-down" title="Fusionar hacia abajo" aria-label="Fusionar hacia abajo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="6 13 12 19 18 13"/></svg>
      </button>
      <button class="ge-btn ge-btn-sm ge-icon-btn" id="ge-merge-all" title="Fusionar todo" aria-label="Fusionar todo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6M9 6l3-3 3 3M3 14h18M12 14v7M9 18l3 3 3-3"/></svg>
      </button>
      <button class="ge-btn ge-btn-sm ge-icon-btn" id="ge-flatten" title="Copia aplanada (conserva los originales)" aria-label="Copia aplanada">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 L4 6 L4 18 L12 22 L20 18 L20 6 Z"/><path d="M12 2 L12 22"/><path d="M4 6 L20 6"/><path d="M4 18 L20 18"/></svg>
      </button>
      <button class="ge-btn ge-btn-sm" id="ge-add-layer" title="Añadir capa vacía">+ Añadir</button>
    </div><div class="ge-layers-list" id="ge-layers-list"></div>`;
}
