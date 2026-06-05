# Agradecimientos

DarkMind-AI se apoya en los hombros de mucho trabajo de código abierto. Este archivo da crédito a los proyectos cuyo código, activos o diseños están incluidos en este repositorio o han sido adaptados por él, y anota sus licencias.

Si crees que algo aquí está mal atribuido o falta, abre un *issue* — se corregirá rápidamente.

---

## Código adaptado / prestado

Partes de este proyecto se adaptaron de otros repositorios de código abierto. Sus autores originales conservan los derechos de autor sobre las partes adaptadas, bajo las licencias indicadas a continuación.

Las fuentes que se indican a continuación están bajo licencias permisivas (MIT / Apache-2.0), que permiten este uso siempre que se conserven los avisos originales de copyright y licencia. Los textos completos de las licencias se mantienen en [`licenses/`](licenses/).

- **[opencode](https://github.com/anomalyco/opencode)** — agente de codificación IA de código abierto (originalmente [opencode-ai/opencode](https://github.com/opencode-ai/opencode), archivado en septiembre de 2025; ahora mantenido en `anomalyco/opencode`). Copyright © los autores de opencode. **Licencia MIT.** Adaptado para los patrones de bucle de agente / ejecución de herramientas y conceptos de interfaz.
- **[llmfit](https://github.com/AlexsJones/llmfit)** de **Alex Jones** — el motor detrás de la función de descarga / servicio / «¿Qué encaja?» del Cookbook. Copyright © Alex Jones. **Licencia MIT.** Adaptado en `services/hwfit/` (detección de hardware, puntuación de ajuste con conciencia de cuantización, catálogo de modelos), `routes/cookbook_*.py`, `routes/hwfit_routes.py`, `static/js/cookbook*.js` y `scripts/darkmind-cookbook`.
- **[Tongyi DeepResearch](https://github.com/Alibaba-NLP/DeepResearch)** de **Alibaba-NLP / Tongyi Lab** — el pipeline de agente de investigación profunda de múltiples pasos. Copyright © Alibaba-NLP / Tongyi Lab. **Apache-2.0.** Adaptado para la función de Investigación Profunda de DarkMind-AI (`services/research/`, `src/research_handler.py`, `routes/research_routes.py`, `services/search/`). Texto completo en [`licenses/DeepResearch-Apache-2.0.txt`](licenses/DeepResearch-Apache-2.0.txt).

---

## Servicios que pueden ejecutarse junto a DarkMind-AI

Estos servicios pueden ejecutarse junto a DarkMind-AI en tu entorno. No están modificados — solo se interoperan.

| Servicio | Imagen / referencia | Propósito | Licencia |
|---|---|---|---|
| [SearXNG](https://github.com/searxng/searxng) | `searxng/searxng` | Backend de metabúsqueda por defecto | AGPL-3.0 |
| [ChromaDB](https://github.com/chroma-core/chroma) | `chromadb/chroma` | Almacén vectorial para memoria / RAG | Apache-2.0 |
| [ntfy](https://github.com/binwiederhier/ntfy) | `binwiederhier/ntfy` | Notificaciones push (recordatorios autoalojados) | Apache-2.0 / GPL-2.0 |

## Bibliotecas de frontend incluidas

Vendorizadas en `static/lib/` y servidas directamente:

| Biblioteca | Propósito | Licencia |
|---|---|---|
| [highlight.js](https://github.com/highlightjs/highlight.js) v11.9.0 | Resaltado de sintaxis de código | BSD-3-Clause |
| [SheetJS / xlsx](https://github.com/SheetJS/sheetjs) (`xlsx.full.min.js`) | Lectura/escritura de hojas de cálculo (`.xlsx`) | Apache-2.0 |
| [docx](https://github.com/dolanmiu/docx) (`docx.umd.min.js`) | Generar documentos `.docx` | MIT |
| [mammoth.js](https://github.com/mwilliamson/mammoth.js) | Convertir `.docx` → HTML | BSD-2-Clause |
| [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) | Exportación HTML → PDF (incluye jsPDF + html2canvas) | MIT |
| [jsPDF](https://github.com/parallax/jsPDF) (incluido en html2pdf) | Generación de PDF | MIT |
| [html2canvas](https://github.com/niklasvh/html2canvas) (incluido en html2pdf) | Rasterización DOM → canvas | MIT |
| [node-qrcode](https://github.com/soldair/node-qrcode) (`qrcode.min.js`) | Renderizado de códigos QR (configuración 2FA) | MIT |

## Bibliotecas de frontend cargadas en tiempo de ejecución (CDN)

Referenciadas desde `cdn.jsdelivr.net` / `cdnjs.cloudflare.com` en tiempo de ejecución — no vendorizadas:

| Biblioteca | Propósito | Licencia |
|---|---|---|
| [KaTeX](https://github.com/KaTeX/KaTeX) 0.16.22 | Composición matemática | MIT |
| [Mermaid](https://github.com/mermaid-js/mermaid) 11 | Diagramas a partir de texto | MIT |
| [Pyodide](https://github.com/pyodide/pyodide) 0.27.5 | Entorno de ejecución Python en el navegador | MPL-2.0 |
| [PDFObject](https://github.com/pipwerks/PDFObject) 2.1.1 | Incrustación de PDF en línea | MIT |

## Fuentes

Incluidas en `static/fonts/`:

| Fuente | Licencia | Autor |
|---|---|---|
| [Fira Code](https://github.com/tonsky/FiraCode) | SIL Open Font License 1.1 | Nikita Prokopov y colaboradores |
| [Inter](https://github.com/rsms/inter) | SIL Open Font License 1.1 | Rasmus Andersson |
| [GohuFont](https://font.gohu.org/) (`fonts/custom/GohuFont.ttf`) | WTFPL | Hugo Chargois |

## Dependencias Python

Principales (`requirements.txt`) y opcionales (`requirements-optional.txt`):

| Paquete | Licencia |
|---|---|
| FastAPI | MIT |
| Uvicorn | BSD-3-Clause |
| python-multipart | Apache-2.0 |
| python-dotenv | BSD-3-Clause |
| HTTPX | BSD-3-Clause |
| Pydantic / pydantic-settings | MIT |
| SQLAlchemy | MIT |
| pypdf | BSD-3-Clause |
| BeautifulSoup4 | MIT |
| charset-normalizer | MIT |
| NumPy | BSD-3-Clause |
| ChromaDB (chromadb-client) | Apache-2.0 |
| fastembed | Apache-2.0 |
| youtube-transcript-api | MIT |
| markdown | BSD-3-Clause |
| icalendar | BSD-2-Clause |
| caldav | GPL-3.0-or-later O Apache-2.0 (doble; usado bajo Apache-2.0) |
| cryptography | Apache-2.0 / BSD-3-Clause |
| bcrypt | Apache-2.0 |
| MCP (Model Context Protocol SDK) | MIT |
| pyotp | MIT |
| qrcode\[pil] | BSD-3-Clause |
| croniter | MIT |
| pytest / pytest-asyncio | MIT / Apache-2.0 |
| duckduckgo-search (opcional) | MIT |
| markitdown (opcional — extracción de texto Office/EPUB) | MIT |
| **PyMuPDF** *(opcional — solo relleno de formularios)* | **AGPL-3.0** — ver nota más abajo |

## Servicios compañeros (interoperados, no incluidos)

DarkMind-AI se comunica con estos a través de la red/API. **No** se distribuyen con este proyecto; sus licencias no vinculan este código base, pero merecen reconocimiento:

- [Ollama](https://github.com/ollama/ollama) — servicio de modelos locales (MIT)
- [Radicale](https://github.com/Kozea/Radicale) — servidor CardDAV/CalDAV (GPL-3.0)
- [Dovecot](https://www.dovecot.org/) — servidor IMAP
- [isync / mbsync](https://isync.sourceforge.io/) — sincronización de buzón IMAP (GPL-2.0)
- [tmux](https://github.com/tmux/tmux) — multiplexor de terminal; Cookbook lo usa en Linux/macOS para descargas y servicios de modelos en segundo plano (ISC)
- [OpenSSH](https://www.openssh.com/) (`ssh`, `ssh-keygen`, `ssh-copy-id`) — Cookbook lo usa para gestionar servidores de modelos remotos y aprovisionar claves (permisiva estilo BSD)
- Proveedores de modelos/API: Anthropic, OpenAI, Google (Gemini), DuckDuckGo

---

### Notas de compatibilidad de licencias (para la elección de LICENSE del repositorio)

El **núcleo se distribuye completamente bajo licencias permisivas** (compatibles con MIT), por lo que los dos problemas de *copyleft* anteriores están resueltos:

- La **extracción de texto de PDF** ahora usa **`pypdf`** (BSD-3-Clause) y la **detección de codificación** usa **`charset-normalizer`** (MIT). chardet (LGPL-2.1) se ha eliminado completamente.
- **PyMuPDF (AGPL-3.0)** ya no es una dependencia principal. Es **opcional** y se usa *únicamente* por la función de relleno de formularios PDF (`src/pdf_forms.py` y los endpoints de formularios en `routes/document_routes.py`), importada de forma diferida y listada en `requirements-optional.txt`. El núcleo MIT funciona sin ella. Si decides instalarlo, la cláusula de red de la AGPL se aplica entonces a *esa función* en tu despliegue (Artifex también vende una licencia comercial de PyMuPDF que elimina esto).
- **`caldav`** (biblioteca Python) tiene **doble licencia GPL-3.0-or-later O Apache-2.0**. DarkMind-AI la usa bajo **Apache-2.0**, que es permisiva y compatible con MIT.
- **`markitdown`** (Microsoft) es **MIT** y se usa solo como dependencia *opcional* para la extracción de texto de Office/EPUB (`src/markitdown_runtime.py`), importada de forma diferida con fallback elegante — el núcleo MIT funciona sin ella. El extra de `az-doc-intel` en la nube **no** se instala deliberadamente, manteniendo la extracción completamente local.

---

## Gracias a

La mayor parte del código de DarkMind-AI fue escrito *con* modelos de IA, no solo por un humano. El proyecto no existiría sin ellos — crédito donde se debe:

- **gpt-oss-120b** — la leyenda que inició este proyecto.
- **Qwen3-235B**
- **DeepSeek V3.1 · DeepSeek V4 Pro · DeepSeek V4 Flash**
- **Claude** (Anthropic)
- **Codex** (OpenAI)
- Amigos, por ayudarme a depurar.
