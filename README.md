# DarkMind-AI

```
───────────────────────────────────────────────
 ⊹ ࣪ ˖ ૮( ˶ᵔ ᵕ ᵔ˶ )っ  DarkMind-AI vers. 1.0
───────────────────────────────────────────────
```

**Autor: José Israel Nadal Vidal**

> Este software se ofrece «tal cual» (*as is*), sin garantías de ningún tipo, expresas ni implícitas. Su uso es responsabilidad exclusiva del usuario.

Un espacio de trabajo de IA **autoalojado** — pensado para ofrecer la experiencia de ChatGPT y Claude, pero con más carácter y en tu propio hardware, con tus propios datos: local primero, privacidad primero, y sin telemetría oculta.

DarkMind-AI funciona de forma **nativa, sin Docker**, en Windows, macOS y Linux.

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Requisitos previos](#requisitos-previos)
- [Instalación detallada por sistema operativo](#instalación-detallada-por-sistema-operativo)
  - [Windows](#windows)
  - [macOS](#macos)
  - [Linux / Ubuntu / Debian](#linux--ubuntu--debian)
- [Primer inicio de sesión](#primer-inicio-de-sesión)
- [Ejecutar como servicio (arranque automático)](#ejecutar-como-servicio-arranque-automático)
- [Actualizar y desinstalar](#actualizar-y-desinstalar)
- [Solución de problemas](#solución-de-problemas)
- [Notas de seguridad](#notas-de-seguridad)
- [Configuración (.env)](#configuración-env)
- [Arquitectura](#arquitectura)
- [Datos](#datos)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Funcionalidades

- **Chat** — conversa con cualquier modelo local o de API; añadirlos es muy sencillo.<br><sub>vLLM · llama.cpp · Ollama · OpenRouter · OpenAI · GitHub Copilot</sub>
- **Agente** — dale herramientas y deja que ejecute la tarea completa por sí solo.<br><sub>basado en [opencode](https://github.com/anomalyco/opencode) · MCP · web · archivos · shell · habilidades · memoria</sub>
- **Cookbook** — analiza tu hardware, recomienda modelos, y con un clic los descarga y sirve.<br><sub>basado en [llmfit](https://github.com/AlexsJones/llmfit) · consciente de la VRAM · GGUF / FP8 / AWQ · puntuación de ajuste · servicio vLLM / llama.cpp</sub>
- **Investigación Profunda** — ejecuciones de varios pasos que recopilan, leen y sintetizan fuentes en un informe visual.<br><sub>adaptado de [Tongyi DeepResearch](https://github.com/Alibaba-NLP/DeepResearch)</sub>
- **Comparar** — compara modelos en paralelo, incluso a ciegas para evitar sesgos.<br><sub>multimodelo · prueba ciega · síntesis</sub>
- **Documentos** — tú escribes, la IA ayuda; editor multipestaña con ediciones y sugerencias en vivo.<br><sub>markdown · HTML · CSV · resaltado de sintaxis · ediciones de IA</sub>
- **Memoria / Habilidades** — memoria y habilidades persistentes; el agente evoluciona contigo.<br><sub>ChromaDB · fastembed (ONNX) · recuperación vectorial + por palabras clave · importar/exportar</sub>
- **Correo electrónico** — bandeja IMAP/SMTP con triaje de IA: urgencia, etiquetado, resumen y borradores automáticos.<br><sub>IMAP · SMTP · enrutamiento por cuenta · compatible con CalDAV</sub>
- **Notas y tareas** — notas con recordatorios, listas de tareas y tareas programadas que el agente puede ejecutar.<br><sub>recordatorios · listas de verificación · tareas estilo cron · canales ntfy / navegador / correo</sub>
- **Calendario** — calendario local con sincronización CalDAV (Radicale / Nextcloud / Apple / Fastmail).<br><sub>importar/exportar .ics · colores por calendario · compatible con agente</sub>
- **Funciona en el móvil** — interfaz adaptable e instalable como PWA.<br><sub>adaptable · instalable (PWA) · gestos táctiles</sub>
- **Extras** — editor de imágenes, editor de temas, carga de archivos (visión + PDF), búsqueda web, preajustes, sesiones y 2FA.

---

## Requisitos previos

Válido para **todos** los sistemas operativos:

| Requisito | Necesario | Notas |
|---|---|---|
| **Python 3.11 o superior** | Sí | Es la única dependencia obligatoria para la app principal. |
| **Git** | Recomendado | Para clonar y actualizar el repositorio. En Windows aporta además `bash.exe` para Cookbook. |
| `tmux` | Opcional | Necesario en Linux/macOS para las descargas y el servicio de modelos en segundo plano de **Cookbook**. |
| Una GPU (NVIDIA/AMD/Apple) | Opcional | Solo para *servir* modelos locales con aceleración. La app en sí es ligera. |

> La aplicación principal (chat, agente, memoria, documentos, correo, calendario, investigación profunda) funciona sin GPU. Servir modelos grandes localmente es la parte pesada; en equipos modestos puedes conectarte a una **API** (OpenAI, OpenRouter…) o a un **servidor de modelos remoto**.

Comprueba tu versión de Python:

```bash
python --version    # o: python3 --version   /   py --version
```

Si es inferior a 3.11, instálalo desde [python.org/downloads](https://www.python.org/downloads/).

---

## Instalación detallada por sistema operativo

Primero, **clona el repositorio** (igual en todos los SO):

```bash
git clone https://github.com/jnadvid/DarkMind-AI.git
cd DarkMind-AI
```

> Si no tienes Git, descarga el ZIP del repositorio, descomprímelo y entra en la carpeta resultante.

Lo que hará la instalación en cualquier caso:
1. Crear un entorno virtual de Python (`venv`) aislado.
2. Instalar las dependencias de `requirements.txt`.
3. Ejecutar `setup.py` (crea las carpetas de datos, la base de datos y un usuario administrador; **la primera vez imprime una contraseña temporal de administrador** en la consola).
4. Arrancar el servidor web en `http://127.0.0.1:7000`.

---

### Windows

**Opción A — Lanzador automático `.bat` (lo más sencillo).**

Haz **doble clic** en `iniciar.bat`, o desde una consola (`cmd`):

```cmd
iniciar.bat
```

Acepta puerto y host opcionales:

```cmd
iniciar.bat 8080            REM puerto personalizado
iniciar.bat 7000 0.0.0.0    REM accesible desde la red local
```

El script comprueba Python 3.11+, crea el `venv`, instala dependencias, ejecuta la configuración inicial y arranca el servidor. Es seguro volver a ejecutarlo.

**Opción B — Lanzador de PowerShell:**

```powershell
powershell -ExecutionPolicy Bypass -File .\launch-windows.ps1
```

**Opción C — Manual (paso a paso):**

```powershell
py -3.11 -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python setup.py
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

> Si `python` apunta a una versión antigua, usa `py -3.12` (o la versión 3.11+ que tengas) en el paso del `venv`.

**Notas para Windows:**
- Para las descargas de modelos en segundo plano de **Cookbook** y la herramienta de *shell* del agente, instala [Git for Windows](https://git-scm.com/download/win) (aporta `bash.exe`).
- El servicio GPU local con vLLM/SGLang requiere Linux o WSL2. Para un modelo local en Windows, lo más sencillo es [Ollama](https://ollama.com/download): inícialo y apunta DarkMind-AI a `http://localhost:11434/v1` en **Configuración**.

---

### macOS

**Apple Silicon (M1/M2/M3…) y también Intel — script todo en uno:**

```bash
./start-macos.sh
```

Instala las dependencias de Homebrew, crea el `venv`, ejecuta la configuración e inicia el servidor en `http://127.0.0.1:7860` (se usa el `7860` porque AirPlay suele ocupar el `7000`).

Para exponerlo a otros dispositivos por una LAN de confianza o VPN (p. ej. Tailscale):

```bash
DARKMIND_HOST=0.0.0.0 ./start-macos.sh
# luego abre http://<ip-de-tailscale>:7860
```

El script también lee `.env` al arrancar, por lo que `APP_BIND=0.0.0.0` y `APP_PORT` definidos ahí se aplican sin pasar argumentos.

**Manual (alternativa):**

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python setup.py
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

**Notas para macOS:**
- Para Cookbook con aceleración por GPU (Metal) usa llama.cpp/Ollama. vLLM/SGLang son exclusivos de CUDA/ROCm y **no** funcionan en macOS.
- Instala `tmux` (`brew install tmux`) para las descargas y el servicio de modelos en segundo plano.
- Para crear un envoltorio de aplicación `.app`: `./build-macos-app.sh`.

---

### Linux / Ubuntu / Debian

**Vía rápida — instalar como servicio desde esta rama (recomendado en Ubuntu):**

Copia y pega todo el bloque. Clona **esta rama** (`claude/exciting-noether-lyOYa`), prepara todo y registra el servicio de systemd:

```bash
# 1. Dependencias del sistema
sudo apt update
sudo apt install -y git python3 python3-venv python3-pip tmux

# 2. Clonar ESTA rama del repositorio
git clone -b claude/exciting-noether-lyOYa https://github.com/jnadvid/DarkMind-AI.git
cd DarkMind-AI

# 3. Instalar y registrar como servicio (crea venv, instala deps, configura y arranca)
chmod +x desplegar-servicio.sh
sudo ./desplegar-servicio.sh
```

Al terminar, DarkMind-AI quedará arrancando con el sistema y reiniciándose solo. Abre **http://127.0.0.1:7000** e inicia sesión con la contraseña de administrador que el script habrá impreso (también puedes verla con `sudo journalctl -u darkmind-ai`).

Opciones útiles del script:

```bash
sudo ./desplegar-servicio.sh --host 0.0.0.0       # accesible desde la red local
sudo ./desplegar-servicio.sh --port 8080          # otro puerto
sudo ./desplegar-servicio.sh --user juan          # usuario que ejecuta el servicio
./desplegar-servicio.sh --help                    # todas las opciones
```

Gestión del servicio:

```bash
sudo systemctl status darkmind-ai      # estado
sudo journalctl -u darkmind-ai -f      # registros en vivo (y la contraseña inicial)
sudo systemctl restart darkmind-ai     # reiniciar
sudo systemctl stop darkmind-ai        # detener
```

> Cuando esta rama se fusione con `main`, sustituye `-b claude/exciting-noether-lyOYa` por `-b main` (o clona sin `-b`).

**Manual (paso a paso, sin servicio):**

```bash
# Dependencias del sistema (Ubuntu/Debian)
sudo apt update
sudo apt install -y python3 python3-venv python3-pip git tmux

# Instalación de la app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python setup.py
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

**Requisitos:** Python 3.11+. `tmux` es necesario para las descargas y el servicio de modelos en segundo plano de Cookbook. La aplicación es ligera; servir modelos locales depende del modelo, el entorno de ejecución, la GPU y la VRAM, por lo que los equipos pequeños pueden conectarse a APIs o a servidores de modelos remotos. Usa `--host 0.0.0.0` solo cuando quieras intencionadamente acceso desde la LAN o un proxy inverso (`0.0.0.0` only when you intentionally want LAN/reverse-proxy access).

> Para dejarlo arrancando con el sistema y reiniciándose solo, usa el despliegue como servicio de la siguiente sección.

---

## Primer inicio de sesión

1. Abre **http://127.0.0.1:7000** en el navegador (en macOS con `start-macos.sh`, el puerto es **7860**).
2. La primera vez, `setup.py` imprime en la consola un usuario (`admin`, salvo que definas `DARKMIND_ADMIN_USER`) y una **contraseña temporal de administrador**. Úsala para iniciar sesión.
3. Cámbiala después en **Configuración → Cuenta**.
4. Configura modelos, búsqueda y correo desde **Configuración** (o escribe `/setup` en el chat).

Los valores por defecto funcionan directamente; solo necesitas editar `.env` para anulaciones a nivel de despliegue (como `AUTH_ENABLED`, `DATABASE_URL` o una contraseña de administrador predefinida).

---

## Ejecutar como servicio (arranque automático)

### Linux (systemd) — recomendado

El script `desplegar-servicio.sh` automatiza todo el despliegue: detecta Python, crea el `venv`, instala dependencias, ejecuta la configuración inicial, genera la *unit* de systemd y habilita y arranca el servicio.

```bash
sudo ./desplegar-servicio.sh                 # 127.0.0.1:7000 (solo local, recomendado)
sudo ./desplegar-servicio.sh --host 0.0.0.0  # accesible desde la red local
sudo ./desplegar-servicio.sh --port 8080 --user juan
./desplegar-servicio.sh --help               # todas las opciones
```

Gestión posterior del servicio:

```bash
sudo systemctl status darkmind-ai      # estado
sudo journalctl -u darkmind-ai -f      # registros en vivo
sudo systemctl restart darkmind-ai     # reiniciar
sudo systemctl stop darkmind-ai        # detener
```

### Windows

Deja abierta la ventana de `iniciar.bat`, o registra una tarea programada que ejecute al iniciar sesión:

```
venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 7000
```

### macOS

Ejecuta `./start-macos.sh` (o el `.app` generado con `./build-macos-app.sh`), o crea un `launchd` *plist* que llame al `uvicorn` del `venv`.

---

## Actualizar y desinstalar

**Actualizar** (con Git):

```bash
git pull
# vuelve a instalar dependencias por si cambiaron:
#   Windows: venv\Scripts\python.exe -m pip install -r requirements.txt
#   Linux/macOS: ./venv/bin/pip install -r requirements.txt
```

Si lo ejecutas como servicio en Linux, reejecuta `sudo ./desplegar-servicio.sh` (es idempotente) o reinicia con `sudo systemctl restart darkmind-ai`.

**Desinstalar:** detén el proceso/servicio y borra la carpeta del proyecto. En Linux, si instalaste el servicio:

```bash
sudo systemctl disable --now darkmind-ai
sudo rm /etc/systemd/system/darkmind-ai.service
sudo systemctl daemon-reload
```

> Tus datos personales viven en `data/`. Haz una copia de seguridad de esa carpeta (y de `.env`) antes de borrar nada.

---

## Solución de problemas

**El servidor no arranca / falta una dependencia.** Asegúrate de tener Python 3.11+ y de haber instalado `requirements.txt` dentro del `venv`. Vuelve a ejecutar el lanzador de tu SO (es seguro).

**Conflicto entre `chromadb-client` y ChromaDB embebido.** Si está instalado `chromadb-client` (la variante ligera solo-HTTP) junto al paquete completo `chromadb`, la memoria vectorial puede fallar. Solución:

```bash
./venv/bin/pip uninstall chromadb-client -y
./venv/bin/pip install --force-reinstall chromadb
```

**Exponer por HTTPS en LAN/Tailscale.**
1. Cambia la escucha a `0.0.0.0` en `.env` (`APP_BIND=0.0.0.0` o `DARKMIND_HOST=0.0.0.0`).
2. Genera un certificado de confianza local con [mkcert](https://github.com/FiloSottile/mkcert):
   ```bash
   mkcert -install
   mkcert -cert-file cert.pem -key-file key.pem 192.168.1.100 tailscale-ip
   ```
3. Arranca uvicorn con los certificados:
   ```bash
   python -m uvicorn app:app --host 0.0.0.0 --port 7000 --ssl-certfile=cert.pem --ssl-keyfile=key.pem
   ```
4. Instala la CA de `mkcert` en los demás dispositivos desde los que accedas.

**Comprobaciones útiles.**

```bash
ps aux | grep uvicorn        # ¿está corriendo el servidor?
tail -f logs/compound.log    # registros del servidor
```

**Dependencias opcionales** (`requirements-optional.txt`, no se instalan por defecto):

| Paquete | Función que desbloquea |
|---|---|
| `faster-whisper` | Transcripción de voz a texto local (micrófono → texto) con el proveedor STT «local». |
| `duckduckgo-search` | DuckDuckGo como proveedor de búsqueda. |
| `PyMuPDF` | Renderizado de páginas PDF y relleno de formularios. (Licencia AGPL-3.0) |
| `markitdown` | Extracción de texto de Office/EPUB (.docx/.xlsx/.pptx/.xls/.epub → Markdown). |

---

## Notas de seguridad

DarkMind-AI es un espacio de trabajo autoalojado con herramientas potentes (acceso a shell, carga de archivos, descarga de modelos, investigación web, integraciones de correo/calendario y tokens de API). **Trátalo como una consola de administración.**

- Mantén `AUTH_ENABLED=true` en cualquier despliegue accesible por red.
- Mantén `LOCALHOST_BYPASS=false` fuera del desarrollo local.
- Usa `SECURE_COOKIES=true` cuando se sirva por HTTPS detrás de un proxy inverso de confianza.
- No lo expongas directamente a internet sin HTTPS y un proxy inverso de confianza.
- Mantén `.env`, `data/`, `logs/`, bases de datos, cargas, multimedia generada, copias de seguridad, claves de API y tokens fuera de Git (ya se ignoran por defecto).
- Revisa `data/auth.json` tras el primer arranque: desactiva el registro abierto salvo que lo quieras, deja solo tu cuenta como administradora.
- Prefiere vincular las ejecuciones manuales a `127.0.0.1`; usa `0.0.0.0` solo cuando quieras intencionadamente acceso LAN/proxy-inverso.
- Crea tokens de API/webhook separados por integración y elimina los que no uses.
- Mantén ChromaDB, SearXNG, ntfy, Ollama, vLLM, llama.cpp y las APIs de modelos solo para uso interno; expón únicamente el punto de entrada web/API autenticado de DarkMind-AI.

### Despliegues privados o tras proxy

DarkMind-AI sirve HTTP plano en su puerto. Una configuración típica:

1. Mantén DarkMind-AI en *localhost* (`127.0.0.1:7000`).
2. Termina HTTPS en un proxy inverso de confianza (Caddy, nginx, Traefik, Cloudflare Access, Tailscale…).
3. Coloca el punto de entrada autenticado detrás de esa capa, con `AUTH_ENABLED=true`, `LOCALHOST_BYPASS=false` y `SECURE_COOKIES=true`.

Puertos solo de uso interno por defecto:

| Puerto | Servicio |
|---|---|
| `7000` | Puerto de aplicación de DarkMind-AI |
| `8080` | SearXNG |
| `8091` | ntfy |
| `8100` | Host de ChromaDB para acceso manual |
| `11434` | Ollama |
| `8000-8020` | APIs de modelos/proveedores locales comunes |

---

## Configuración (.env)

La mayoría de la configuración se hace en la app con `/setup` o **Configuración**. Usa `.env` para los valores por defecto a nivel de despliegue y los secretos que deban existir antes del primer arranque.

| Variable | Por defecto | Descripción |
|---|---|---|
| `LLM_HOST` | `localhost` | Tu servidor LLM (p. ej. `llm-host.local:8000`). |
| `LLM_HOSTS` | — | Lista separada por comas para el descubrimiento de modelos. |
| `OPENAI_API_KEY` | — | Clave de OpenAI opcional. Mejor añade proveedores en la app. |
| `SEARXNG_INSTANCE` | `http://localhost:8080` | URL de SearXNG. |
| `AUTH_ENABLED` | `true` | Activar/desactivar el inicio de sesión. |
| `LOCALHOST_BYPASS` | `false` | Omisión de autenticación solo para desarrollo en *loopback*. |
| `SECURE_COOKIES` | `false` | Ponlo en `true` cuando se sirva por HTTPS tras un proxy de confianza. |
| `DATABASE_URL` | `sqlite:///./data/app.db` | Cadena de conexión a la base de datos. |
| `CHROMADB_HOST` | `localhost` | Host de ChromaDB para la memoria vectorial. |
| `CHROMADB_PORT` | `8100` | Puerto de ChromaDB para ejecuciones manuales. |
| `EMBEDDING_URL` | — | Endpoint de *embeddings* compatible con OpenAI. |

### Servidores MCP integrados (opcional)

DarkMind-AI registra algunos servidores MCP integrados al arrancar. Los basados en `npx` (como el servidor de navegador `@playwright/mcp`) solo se inician si su paquete ya está en la caché local de npx; si no, se omiten con un aviso en el registro de inicio. Para habilitar el MCP de navegador, ejecuta una vez:

```bash
npx -y @playwright/mcp@latest --version
```

Esto instala `@playwright/mcp` y Playwright (~300 MB). Reinicia DarkMind-AI y el servidor se registrará al arrancar.

---

## Arquitectura

```
app.py                   # Punto de entrada FastAPI
core/      auth, database, middleware, constants
src/       llm_core, agent_loop, agent_tools, chat_processor, search/
routes/    chat, session, document, memory, model … endpoints
services/  docs, memory, search, hwfit (Cookbook) …
static/    index.html + app.js + style.css + js/ (front-end modular)
docs/      página de inicio (index.html)
```

## Datos

Todos los datos de usuario residen en `data/` (ignorado por git): `app.db` (sesiones, mensajes, documentos), `memory.json`, `presets.json`, `uploads/`, `personal_docs/`, `chroma/`, `settings.json`.

## Contribuciones

Las contribuciones son bienvenidas. Buenos puntos de entrada: pruebas de instalación limpia, errores de configuración de proveedores, pulido de la interfaz móvil/editor, documentación y refactorizaciones pequeñas. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) y [ROADMAP.md](ROADMAP.md).

## Licencia

MIT — consulta [LICENSE](LICENSE), [NOTICE](NOTICE) y [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md).

```
                                  |
                                 |||
                                |||||
                  |    |    |   |||||||
                 )_)  )_)  )_)   ~|~
                )___))___))___)\  |
               )____)____)_____)\\|
             _____|____|____|_____\\\__
             \                       /
       ~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~
               ~^~  ¡todos a bordo!  ~^~
       ~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~
```
