// static/js/models.js

/**
 * Model and provider management
 */

import Storage from './storage.js';
import uiModule from './ui.js';
import sessionModule from './sessions.js';
import dragSortModule from './dragSort.js';
import spinnerModule from './spinner.js';
import { modelColor } from './chatRenderer.js';
import { providerLogo } from './providers.js';
import { sortModelIds } from './modelSort.js';

// Frases célebres (filosofía e inteligencia artificial) que rotan en el
// subtítulo de bienvenida. Se recorren en orden, guardando el índice en
// localStorage para que cada arranque muestre la siguiente.
const _FRASES_CELEBRES = [
  '«Pienso, luego existo.» — René Descartes',
  '«Sólo sé que no sé nada.» — Sócrates',
  '«La vida no examinada no merece ser vivida.» — Sócrates',
  '«Lo único permanente es el cambio.» — Heráclito',
  '«El conocimiento es poder.» — Francis Bacon',
  '«La filosofía comienza con el asombro.» — Aristóteles',
  '«El hombre es la medida de todas las cosas.» — Protágoras',
  '«La ciencia es lo que sabemos; la filosofía es lo que no sabemos.» — Bertrand Russell',
  '«¿Pueden pensar las máquinas?» — Alan Turing',
  '«La pregunta de si una máquina puede pensar es tan relevante como la de si un submarino puede nadar.» — Edsger W. Dijkstra',
  '«La verdadera cuestión no es si las máquinas piensan, sino si los hombres lo hacen.» — B. F. Skinner',
  '«Toda tecnología lo bastante avanzada es indistinguible de la magia.» — Arthur C. Clarke',
  '«La inteligencia es la capacidad de adaptarse al cambio.» — Stephen Hawking',
  '«El verdadero signo de la inteligencia no es el conocimiento, sino la imaginación.» — Albert Einstein',
  '«Moldeamos nuestras herramientas y, después, ellas nos moldean a nosotros.» — Marshall McLuhan',
  '«La inteligencia artificial es la nueva electricidad.» — Andrew Ng',
  '«No basta con tener un buen ingenio; lo principal es aplicarlo bien.» — René Descartes',
  '«La mente que se abre a una nueva idea jamás vuelve a su tamaño original.» — Albert Einstein',
  '«Dos cosas colman el ánimo de admiración: el cielo estrellado sobre mí y la ley moral en mí.» — Immanuel Kant',
  '«Conócete a ti mismo.» — Sócrates',
  '«El obstáculo no es el camino; el obstáculo es el camino.» — Marco Aurelio',
  '«No somos lo que logramos, sino lo que superamos. Lo demás es solo ruido.» — Friedrich Nietzsche (adaptación)',
  '«La vida no se trata de esperar a que pase la tormenta, sino de aprender a bailar bajo la lluvia.» — Vivian Greene',
  '«El presente es el único lugar donde el pasado se redime y el futuro se construye.» — Eckhart Tolle',
  '«No preguntes qué puede hacer el mundo por ti; pregunta qué puedes hacer tú con el mundo.» — John F. Kennedy (variación)',
  '«La mente es como un paracaídas: solo funciona si se abre.» — Albert Einstein',
  '«El sufrimiento es inevitable, pero el sufrimiento por el sufrimiento es opcional.» — Viktor Frankl',
  '«No eres un árbol: si no te gusta dónde estás, muévete.» — Jim Rohn',
  '«La sabiduría no es acumular respuestas, sino aprender a vivir con las preguntas.» — Rainer Maria Rilke',
  '«El universo no conspira contra ti, pero tampoco a favor: simplemente te da las herramientas. El resto es tu elección.» — Paulo Coelho (adaptación)',
  '«La noche más oscura es la que precede al amanecer… pero solo si decides seguir caminando.» — Anónimo',
];

function _fraseCelebreRotativa() {
  const KEY = 'darkmind-frase-idx';
  let idx = 0;
  try { idx = (parseInt(localStorage.getItem(KEY), 10) || 0) % _FRASES_CELEBRES.length; } catch (_) { idx = 0; }
  try { localStorage.setItem(KEY, String((idx + 1) % _FRASES_CELEBRES.length)); } catch (_) {}
  return _FRASES_CELEBRES[idx];
}

let API_BASE = '';
let _cachedItems = []; // cached /api/models items for model-switch dropdown
let _lastFetchTime = 0;
let _fetchInflight = null;
const _FETCH_CACHE_TTL = 30000; // 30s client-side cache for /api/models
const COLLAPSE_KEY = 'darkmind-models-collapsed';
const FAVORITES_KEY = 'darkmind-model-favorites';
const USAGE_KEY = 'darkmind-model-usage';
const SORT_KEY = 'darkmind-model-sort';

export function init(apiBase) {
  API_BASE = apiBase;
}

// ── Collapse state persistence ──
function _loadCollapsed() {
  return Storage.getJSON(COLLAPSE_KEY, {});
}
function _saveCollapsed(state) {
  Storage.setJSON(COLLAPSE_KEY, state);
}

// ── Favorites persistence ──
function _loadFavorites() {
  return Storage.getJSON(FAVORITES_KEY, []);
}
function _saveFavorites(list) {
  Storage.setJSON(FAVORITES_KEY, list);
}
function _isFavorite(mid) {
  return _loadFavorites().includes(mid);
}
function _toggleFavorite(mid) {
  const favs = _loadFavorites();
  const idx = favs.indexOf(mid);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(mid);
  _saveFavorites(favs);
  return idx < 0; // returns true if now favorited
}

// ── Usage tracking ──
function _loadUsage() {
  return Storage.getJSON(USAGE_KEY, {});
}
function _trackUsage(mid) {
  const usage = _loadUsage();
  if (!usage[mid]) usage[mid] = { count: 0, last: 0 };
  usage[mid].count++;
  usage[mid].last = Date.now();
  Storage.setJSON(USAGE_KEY, usage);
}
function _getSortMode() {
  return Storage.get(SORT_KEY, '');
}
function _setSortMode(mode) {
  Storage.set(SORT_KEY, mode);
}

/**
 * Build a single model row element.
 */
function _startChat(url, mid, endpointId) {
  // Block model switching while compare mode is active
  if (window.compareModule && window.compareModule.isActive()) return;
  _trackUsage(mid);
  if (sessionModule) {
    sessionModule.createDirectChat(url, mid, endpointId);
  } else if (uiModule) {
    uiModule.showError('Módulo de sesión no cargado');
  }
}

function _buildModelRow(mid, url, displayName, endpointId, offline, modelType) {
  const row = document.createElement('div');
  row.className = 'models-row' + (offline ? ' models-row-offline' : '');
  row.setAttribute('data-model-id', mid);
  if (modelType === 'image') row.setAttribute('data-model-type', 'image');

  const handle = document.createElement('span');
  handle.className = 'item-drag-handle';
  handle.textContent = '\u22EE\u22EE';
  handle.title = 'Arrastra para reordenar';
  row.appendChild(handle);

  // Favorite indicator — provider logo or colored dot
  const fav = document.createElement('span');
  const _favColor = modelColor(mid);
  const _logo = providerLogo(mid);
  if (_logo) {
    fav.className = 'model-fav-btn provider-logo' + (_isFavorite(mid) ? ' active' : '');
    fav.innerHTML = _logo;
    fav.style.opacity = '0.4';
  } else {
    fav.className = 'model-fav-btn' + (_isFavorite(mid) ? ' active' : '');
  }
  fav.title = 'Alternar favorito';
  fav.addEventListener('click', (e) => {
    e.stopPropagation();
    const nowFav = _toggleFavorite(mid);
    fav.classList.toggle('active', nowFav);
    uiModule.showToast(nowFav ? 'Añadido a favoritos' : 'Quitado de favoritos');
    refreshModels();
  });
  const span = document.createElement('span');
  span.className = 'grow';
  span.textContent = displayName.split('/').pop();
  if (modelType === 'image') {
    const badge = document.createElement('span');
    badge.className = 'model-type-badge';
    badge.textContent = 'IMG';
    badge.title = 'Modelo de generación de imágenes';
    badge.style.cssText = 'font-size:0.65em;padding:1px 4px;border-radius:3px;background:var(--accent,#7c3aed);color:#fff;margin-left:6px;vertical-align:middle;';
    span.appendChild(badge);
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = offline ? 'Sin conexión' : (modelType === 'image' ? '+ Imagen' : '+ Chat');
  btn.className = 'model-chat-btn';
  btn.style.transition = 'all 0.2s ease';
  if (offline) {
    btn.disabled = true;
    btn.style.opacity = '0.4';
    btn.style.cursor = 'not-allowed';
  } else {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      _startChat(url, mid, endpointId);
    });
  }

  // Clicking anywhere on the row (except drag handle and fav) starts a chat
  if (!offline) {
    let _touchMoved = false;
    row.addEventListener('touchstart', () => { _touchMoved = false; }, { passive: true });
    row.addEventListener('touchmove', () => { _touchMoved = true; }, { passive: true });
    row.addEventListener('click', (e) => {
      if (e.target.closest('.item-drag-handle') || e.target.closest('.model-fav-btn')) return;
      if (_touchMoved) { _touchMoved = false; return; }
      _startChat(url, mid, endpointId);
    });
  }

  row.appendChild(fav);
  row.appendChild(span);
  row.appendChild(btn);
  return row;
}

export async function refreshModels(force = false) {
  const box = document.getElementById('models');
  if (!box) return;

  // Skip network fetch if cache is fresh and not forced — still re-render UI
  const now = Date.now();
  const needsFetch = force || _cachedItems.length === 0 || (now - _lastFetchTime) >= _FETCH_CACHE_TTL;

  box.innerHTML = '';
  if (needsFetch) {
    const _loadingSpinner = spinnerModule.create('', 'right', 'wave');
    box.appendChild(_loadingSpinner.createElement());
    _loadingSpinner.start();
    try {
      if (!_fetchInflight) {
        _fetchInflight = fetch(`${API_BASE}/api/models`, { credentials: 'same-origin' })
          .then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .finally(() => { _fetchInflight = null; });
      }
      const data = await _fetchInflight;
      _lastFetchTime = Date.now();
      _cachedItems = data.items || [];
    } catch (e) {
      console.error(e);
      box.textContent = '(scan failed)';
      return;
    } finally {
      box.innerHTML = '';
    }
  }
  try {

    const collapseState = _loadCollapsed();
    let groupIdx = 0; // unique ID counter for drag-sort containers

    // Collect models grouped by category → endpoint
    const groups = { local: {}, api: {} };
    // Also track extra (non-curated) models per endpoint
    const extraGroups = { local: {}, api: {} };
    if (_cachedItems && _cachedItems.length > 0) {
      _cachedItems.forEach(item => {
        const cat = item.category === 'local' ? 'local' : 'api';
        const epName = item.endpoint_name || 'Unknown';
        const isOffline = !!item.offline;
        if (!groups[cat][epName]) groups[cat][epName] = [];
        if (!extraGroups[cat][epName]) extraGroups[cat][epName] = [];
        const displayNames = item.models_display || item.models || [];
        const epModelType = item.model_type || 'llm';
        (item.models || []).forEach((mid, i) => {
          groups[cat][epName].push({
            mid, url: item.url,
            displayName: displayNames[i] || mid,
            endpointId: item.endpoint_id || null,
            offline: isOffline,
            modelType: epModelType,
          });
        });
        // Extra (non-curated) models from server
        const extraDisplayNames = item.models_extra_display || item.models_extra || [];
        (item.models_extra || []).forEach((mid, i) => {
          extraGroups[cat][epName].push({
            mid, url: item.url,
            displayName: extraDisplayNames[i] || mid,
            endpointId: item.endpoint_id || null,
            offline: isOffline,
            modelType: epModelType,
          });
        });
      });
    }

    // ── Render Favorites section on top ──
    const favs = _loadFavorites();
    if (favs.length > 0) {
      const favModels = [];
      // Collect favorited models from all groups (keep them in originals too)
      for (const cat of ['local', 'api']) {
        for (const [epName, epModels] of Object.entries(groups[cat])) {
          for (const m of epModels) {
            if (favs.includes(m.mid)) {
              favModels.push(m);
            }
          }
        }
      }
      // Sort favorites by active sort mode, or by favorited order as default
      const favSort = _getSortMode();
      if (favSort === 'alpha') {
        favModels.sort((a, b) => a.displayName.split('/').pop().localeCompare(b.displayName.split('/').pop()));
      } else if (favSort === 'last-used') {
        const usage = _loadUsage();
        favModels.sort((a, b) => ((usage[b.mid] || {}).last || 0) - ((usage[a.mid] || {}).last || 0));
      } else if (favSort === 'most-used') {
        const usage = _loadUsage();
        favModels.sort((a, b) => ((usage[b.mid] || {}).count || 0) - ((usage[a.mid] || {}).count || 0));
      } else {
        favModels.sort((a, b) => favs.indexOf(a.mid) - favs.indexOf(b.mid));
      }

      if (favModels.length > 0) {
        const favHeader = document.createElement('div');
        favHeader.className = 'models-category-header';
        const favToggle = document.createElement('span');
        favToggle.className = 'folder-toggle';
        const favCollapsed = collapseState['cat:favorites'] === true;
        favToggle.textContent = favCollapsed ? '\u25B6' : '\u25BC';
        favHeader.appendChild(favToggle);
        const favLabel = document.createElement('span');
        favLabel.textContent = 'Favorites';
        favHeader.appendChild(favLabel);
        const favCount = document.createElement('span');
        favCount.className = 'folder-count';
        favCount.textContent = '(' + favModels.length + ')';
        favHeader.appendChild(favCount);
        favHeader.addEventListener('click', () => {
          const s = _loadCollapsed();
          s['cat:favorites'] = !favCollapsed;
          _saveCollapsed(s);
          refreshModels();
        });
        box.appendChild(favHeader);

        if (!favCollapsed) {
          const favContainer = document.createElement('div');
          favContainer.className = 'models-group-content';
          favContainer.id = 'models-group-' + (groupIdx++);
          favModels.forEach(({ mid, url, displayName, endpointId, offline, modelType }) => {
            favContainer.appendChild(_buildModelRow(mid, url, displayName, endpointId, offline, modelType));
          });
          box.appendChild(favContainer);
        }
      }
    }

    const localCount = Object.values(groups.local).reduce((s, a) => s + a.length, 0);
    const apiCount = Object.values(groups.api).reduce((s, a) => s + a.length, 0);
    const hasMultipleCategories = localCount > 0 && apiCount > 0;
    const needsGrouping = hasMultipleCategories ||
      Object.keys(groups.local).length > 1 || Object.keys(groups.api).length > 1;

    const categoryOrder = [
      { key: 'local', label: 'Local' },
      { key: 'api', label: 'API' },
    ];

    categoryOrder.forEach(({ key, label }) => {
      const endpoints = groups[key];
      const models = Object.values(endpoints).flat();
      if (models.length === 0) return;

      const multiEndpoints = Object.keys(endpoints).length > 1;

      // --- Category-level collapsible group ---
      if (hasMultipleCategories) {
        const catCollapsed = collapseState['cat:' + key] === true;

        const header = document.createElement('div');
        header.className = 'models-category-header';

        const toggle = document.createElement('span');
        toggle.className = 'folder-toggle';
        toggle.textContent = catCollapsed ? '\u25B6' : '\u25BC';
        header.appendChild(toggle);

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        header.appendChild(labelSpan);

        const count = document.createElement('span');
        count.className = 'folder-count';
        count.textContent = '(' + models.length + ')';
        header.appendChild(count);

        header.addEventListener('click', () => {
          const s = _loadCollapsed();
          s['cat:' + key] = !catCollapsed;
          _saveCollapsed(s);
          refreshModels();
        });

        box.appendChild(header);

        if (catCollapsed) return;
      }

      // --- Endpoint sub-groups ---
      const extraEndpoints = extraGroups[key];
      Object.entries(endpoints).forEach(([epName, epModels]) => {
        const epExtra = extraEndpoints[epName] || [];
        const totalCount = epModels.length + epExtra.length;
        const isOfflineEndpoint = epModels.length > 0 && epModels[0].offline;

        if (multiEndpoints) {
          const epKey = 'ep:' + key + ':' + epName;
          const epCollapsed = collapseState[epKey] === true;

          const sub = document.createElement('div');
          sub.className = 'models-endpoint-label';

          const epToggle = document.createElement('span');
          epToggle.className = 'folder-toggle';
          epToggle.textContent = epCollapsed ? '\u25B6' : '\u25BC';
          sub.appendChild(epToggle);

          const epLabel = document.createElement('span');
          epLabel.textContent = epName;
          sub.appendChild(epLabel);

          if (isOfflineEndpoint) {
            const badge = document.createElement('span');
            badge.className = 'endpoint-offline-badge';
            badge.textContent = '(sin conexión)';
            sub.appendChild(badge);
          }

          const epCount = document.createElement('span');
          epCount.className = 'folder-count';
          epCount.textContent = '(' + totalCount + ')';
          sub.appendChild(epCount);

          sub.addEventListener('click', () => {
            const s = _loadCollapsed();
            s[epKey] = !epCollapsed;
            _saveCollapsed(s);
            refreshModels();
          });

          box.appendChild(sub);

          if (epCollapsed) return;
        }

        // Render model rows into a container
        let target;
        if (needsGrouping) {
          target = document.createElement('div');
          target.className = 'models-group-content';
          target.id = 'models-group-' + (groupIdx++);
          if (multiEndpoints) target.classList.add('indented');
        } else {
          target = box;
        }

        // Apply sort mode
        const sortMode = _getSortMode();
        if (sortMode === 'alpha') {
          epModels.sort((a, b) => a.displayName.split('/').pop().localeCompare(b.displayName.split('/').pop()));
        } else if (sortMode === 'last-used') {
          const usage = _loadUsage();
          epModels.sort((a, b) => ((usage[b.mid] || {}).last || 0) - ((usage[a.mid] || {}).last || 0));
        } else if (sortMode === 'most-used') {
          const usage = _loadUsage();
          epModels.sort((a, b) => ((usage[b.mid] || {}).count || 0) - ((usage[a.mid] || {}).count || 0));
        }

        // Show up to MAX_VISIBLE models, rest behind "show more"
        const MAX_VISIBLE = 5;
        const visible = epModels.slice(0, MAX_VISIBLE);
        const overflow = epModels.slice(MAX_VISIBLE);
        const allHidden = [...overflow, ...epExtra];

        visible.forEach(({ mid, url, displayName, endpointId, offline, modelType }) => {
          target.appendChild(_buildModelRow(mid, url, displayName, endpointId, offline, modelType));
        });

        if (allHidden.length > 0) {
          const showMoreBtn = document.createElement('div');
          showMoreBtn.className = 'models-show-all-btn';
          showMoreBtn.style.cssText = 'text-align:center;padding:6px;opacity:0.5;cursor:pointer;font-size:0.82em;';
          showMoreBtn.textContent = `Mostrar ${allHidden.length} modelo${allHidden.length === 1 ? '' : 's'} más`;
          showMoreBtn._target = target;
          showMoreBtn.addEventListener('click', () => {
            showMoreBtn.remove();
            allHidden.forEach(({ mid, url, displayName, endpointId, offline, modelType }) => {
              target.appendChild(_buildModelRow(mid, url, displayName, endpointId, offline, modelType));
            });
          });
          target.appendChild(showMoreBtn);
        }

        if (needsGrouping) box.appendChild(target);
      });
    });

    // Restore saved drag order for flat list before enabling drag-sort
    if (!needsGrouping) {
      const savedModelOrder = Storage.getJSON('models-order', []);
      if (savedModelOrder.length) {
        const rowMap = new Map();
        box.querySelectorAll('.models-row').forEach(r => {
          const mid = r.dataset.modelId;
          if (mid) rowMap.set(mid, r);
        });
        const ordered = [];
        savedModelOrder.forEach(mid => {
          if (rowMap.has(mid)) {
            ordered.push(rowMap.get(mid));
            rowMap.delete(mid);
          }
        });
        // Append remaining rows not in saved order
        rowMap.forEach(r => ordered.push(r));
        ordered.forEach(r => box.appendChild(r));
      }
    }

    // Enable drag sorting
    if (dragSortModule) {
      if (!needsGrouping) {
        // Flat list — sort the whole #models container
        dragSortModule.enable('models', '.models-row', {
          handleSelector: '.item-drag-handle',
          storageKey: 'models-order',
        });
      } else {
        // Grouped — enable sort within each group container
        box.querySelectorAll('.models-group-content').forEach(gc => {
          dragSortModule.enable(gc.id, '.models-row', {
            handleSelector: '.item-drag-handle',
          });
        });
      }
    }

    // ── Search box (shown when >= 5 total models, including hidden overflow) ──
    const totalModelCount = (_cachedItems || []).reduce((n, item) => {
      if (item.offline) return n;
      return n + (item.models || []).length + (item.models_extra || []).length;
    }, 0);
    if (totalModelCount >= 10) {
      const searchBox = document.createElement('input');
      searchBox.type = 'text';
      searchBox.placeholder = 'Buscar modelos...';
      searchBox.className = 'model-search-input';
      searchBox.addEventListener('click', (e) => e.stopPropagation());
      searchBox.addEventListener('touchstart', (e) => e.stopPropagation());
      // Container for flat search results (rendered from _cachedItems, ignores collapse)
      const searchResults = document.createElement('div');
      searchResults.className = 'models-search-results';
      searchResults.style.display = 'none';
      box.appendChild(searchResults);

      searchBox.addEventListener('input', () => {
        const q = searchBox.value.toLowerCase().trim();
        if (!q) {
          // Clear search: hide results, restore normal groups
          searchResults.style.display = 'none';
          searchResults.innerHTML = '';
          for (const ch of box.children) {
            if (ch !== searchBox && ch !== searchResults) ch.style.display = '';
          }
          return;
        }
        // Hide all normal groups/headers, show flat search results
        for (const ch of box.children) {
          if (ch !== searchBox && ch !== searchResults) ch.style.display = 'none';
        }
        searchResults.innerHTML = '';
        searchResults.style.display = '';
        // Build flat results from all cached models
        (_cachedItems || []).forEach(item => {
          if (item.offline) return;
          const allModels = (item.models || []).concat(item.models_extra || []);
          const allDisplay = (item.models_display || []).concat(item.models_extra_display || item.models_extra || []);
          allModels.forEach((mid, i) => {
            const display = allDisplay[i] || mid;
            if (!mid.toLowerCase().includes(q) && !display.toLowerCase().includes(q)) return;
            searchResults.appendChild(
              _buildModelRow(mid, item.url, display, item.endpoint_id || null, false, item.model_type || 'llm')
            );
          });
        });
        if (searchResults.children.length === 0) {
          const empty = document.createElement('div');
          empty.style.cssText = 'text-align:center;padding:12px;opacity:0.4;';
          empty.textContent = 'Ningún modelo coincide con "' + searchBox.value.trim() + '"';
          searchResults.appendChild(empty);
        }
      });
      box.insertBefore(searchBox, box.firstChild);
    }

    if (!_cachedItems || _cachedItems.length === 0) {
      const noModels = document.createElement('div');
      noModels.className = 'models-empty-state';
      if (window._isAdmin) {
        noModels.innerHTML = '<span class="muted">No se encontraron modelos</span><br>'
          + '<a href="#" onclick="document.getElementById(\'user-bar-admin\')?.click();return false;" class="accent-link">Abre el Panel de Administración para añadir endpoints</a>'
          + '<br><span class="muted-sm">Escribe /setup para modelos locales o configuración API.</span>';
      } else {
        noModels.innerHTML = '<span class="muted">No hay modelos disponibles</span><br>'
          + '<span class="muted-sm">Pide a un administrador que configure los endpoints de modelos</span>';
      }
      box.appendChild(noModels);
      // No endpoints yet: keep the welcome screen focused on first setup.
      const welcomeSub = document.getElementById('welcome-sub');
      if (welcomeSub) welcomeSub.innerHTML = 'Escribe <span class="setup-trigger-link" style="color:var(--accent,var(--red));font-weight:600;cursor:pointer;text-decoration:underline;" title="Clic para iniciar la configuración">/setup</span> para empezar.';
      const welcomeTip = document.getElementById('welcome-tip');
      if (welcomeTip) { welcomeTip.style.display = ''; welcomeTip.textContent = 'Escribe /setup y elige modelos locales o API.'; }
    } else {
      // Configured installs should feel ready, not stuck in onboarding.
      // Mostramos solo la frase célebre rotativa; el "Consejo:" se oculta para
      // que la frase quede limpia y protagonice la pantalla de bienvenida.
      const welcomeSub = document.getElementById('welcome-sub');
      if (welcomeSub) welcomeSub.textContent = _fraseCelebreRotativa();
      const welcomeTip = document.getElementById('welcome-tip');
      if (welcomeTip) { welcomeTip.textContent = ''; welcomeTip.style.display = 'none'; }
    }
  } catch (e) {
    console.error(e);
    box.textContent = '(error de renderizado: ' + e.message + ')';
  }
}

/**
 * Refresh and display OpenAI providers
 */
export async function refreshProviders() {
  const sel = document.getElementById('openai-model');
  if (!sel) return; // Exit if element doesn't exist

  sel.innerHTML = '<option disabled>Cargando proveedores…</option>';

  try {
    const res = await fetch(`${API_BASE}/api/providers`);
    const data = await res.json();
    const openai = (data.providers || []).find(p => p.provider === 'openai');

    sel.innerHTML = '';

    if (openai) {
      const models = (openai.items?.[0]?.models) || [];
      sortModelIds(models).forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        sel.appendChild(opt);
      });
    } else {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '(OPENAI_API_KEY not set on server)';
      sel.appendChild(opt);
    }
  } catch (e) {
    console.error(e);
  }
}

export function getCachedItems() { return _cachedItems; }

const modelsModule = {
  init,
  refreshModels,
  refreshProviders,
  getCachedItems,
};

export default modelsModule;
window.modelsModule = modelsModule;
