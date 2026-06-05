# DarkMind-AI

```
───────────────────────────────────────────────
 ⊹ ࣪ ˖ ૮( ˶ᵔ ᵕ ᵔ˶ )っ  DarkMind-AI vers. 1.0
───────────────────────────────────────────────
```

![DarkMind-AI](docs/darkmind.jpg)

**Autor: José Israel Nadal Vidal**

> Este software se ofrece «tal cual» (*as is*), sin garantías de ningún tipo, expresas ni implícitas. Su uso es responsabilidad exclusiva del usuario.

Un espacio de trabajo de IA autoalojado — pensado para ser la versión autoalojada de la experiencia que ofrecen ChatGPT y Claude, pero con más carácter y diversión. Funciona en tu propio hardware, con tus propios datos: local primero, privacidad primero, y sin troyanos.

## Funcionalidades
  - **Chat** — conversa con cualquier modelo local o API; añadirlos es muy sencillo.<br>　<sub>vLLM · llama.cpp · Ollama · OpenRouter · OpenAI · GitHub Copilot</sub>
  - **Agente** — dale herramientas y deja que ejecute la tarea completa por sí solo.<br>　<sub>basado en [opencode](https://github.com/anomalyco/opencode) · MCP · web · archivos · shell · habilidades · memoria</sub>
  - **Cookbook** — analiza tu hardware, recomienda modelos, haz clic para descargar y servir... ¡fácil!<br>　<sub>basado en [llmfit](https://github.com/AlexsJones/llmfit) · consciente de VRAM · GGUF / FP8 / AWQ · puntuación de ajuste · servicio vLLM / llama.cpp</sub>
  - **Investigación Profunda** — ejecuciones de múltiples pasos que recopilan, leen y sintetizan fuentes en un informe visual elegante.<br>　<sub>adaptado de [Tongyi DeepResearch](https://github.com/Alibaba-NLP/DeepResearch)</sub>
  - **Comparar** — una herramienta divertida para comparar modelos uno al lado del otro. ¡Prueba completamente a ciegas, sin sesgos!<br>　<sub>multimodelo · prueba ciega · síntesis</sub>
  - **Documentos** — TÚ escribes el texto, la IA está ahí para ayudar, no al contrario.<br>　<sub>editor multipestaña · markdown · HTML · CSV · resaltado de sintaxis · ediciones de IA · sugerencias</sub>
  - **Memoria / Habilidades** — memoria y habilidades persistentes; tu agente evoluciona con el tiempo a medida que te comprende mejor a ti y a tus tareas.<br>　<sub>ChromaDB · fastembed (ONNX) · recuperación vectorial + por palabras clave · importar/exportar</sub>
  - **Correo electrónico** — bandeja de entrada IMAP/SMTP con triaje de IA integrado: avisos de urgencia, etiquetado automático, resumen automático, borradores de respuesta automáticos, spam automático.<br>　<sub>IMAP · SMTP · enrutamiento por cuenta · CalDAV-aware</sub>
  - **Notas y tareas** — notas rápidas con recordatorios, lista de tareas pendientes y tareas programadas sobre las que el agente puede actuar.<br>　<sub>avisos de notas · lista de verificación · tareas estilo cron · canales ntfy / navegador / correo</sub>
  - **Calendario** — calendario local-first con sincronización CalDAV a Radicale / Nextcloud / Apple / Fastmail.<br>　<sub>importación CalDAV · importar/exportar .ics · colores por calendario · compatible con agente</sub>
  - **Funciona en móvil** — se ve y funciona genial en tu teléfono, no solo en el escritorio.<br>　<sub>adaptable · instalable (PWA) · gestos táctiles</sub>
  - **Extras** — más por explorar, ¡feliz si le das una oportunidad!<br>　<sub>editor de imágenes · editor de temas · carga de archivos (visión + PDF) · búsqueda web · preajustes · sesiones · 2FA</sub>

## Demo
Una visita completa, con reproducción al pasar el ratón, vive en la página de inicio (`docs/index.html`).

<details>
<summary>Capturas de pantalla / clips</summary>

### Chat y Agentes
![Chat & Agents](docs/chat.gif)
### Investigación Profunda
![Deep Research](docs/research.gif)
### Comparar
![Compare](docs/compare.gif)
### Documentos
![Documents](docs/document.gif)
### Notas y Tareas
![Notes & Tasks](docs/notes.gif)

</details>

## Inicio Rápido

Los valores por defecto funcionan directamente: clona, ejecuta, y luego configura modelos, búsqueda y correo desde **Configuración**. Solo edita `.env` para anulaciones a nivel de despliegue como `AUTH_ENABLED`, `DATABASE_URL` o una contraseña de administrador predefinida.

Al iniciarse por primera vez, DarkMind-AI crea una cuenta de administrador (`admin` a menos que `DARKMIND_ADMIN_USER` esté definido) e imprime una contraseña temporal en el terminal. Úsala para el primer inicio de sesión y cámbiala después en **Configuración**.

¿Quieres contribuir? Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para instrucciones de configuración, pruebas y directrices para *pull requests*.

### Windows

**Lanzador en un solo comando** (crea el entorno virtual, instala dependencias, ejecuta la configuración e inicia el servidor; es seguro volver a ejecutarlo):

```powershell
git clone https://github.com/pewdiepie-archdaemon/darkmind.git
cd darkmind
powershell -ExecutionPolicy Bypass -File .\launch-windows.ps1
```

O también con el lanzador `.bat`:

```cmd
iniciar.bat
```

O manualmente:

```powershell
git clone https://github.com/pewdiepie-archdaemon/darkmind.git
cd darkmind
py -3.11 -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python setup.py
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

Si `python` apunta a un intérprete más antiguo, usa `py -3.12` (u otra versión 3.11+ instalada) para el paso del entorno virtual.

**Requisitos:** Python 3.11+. La aplicación principal (chat, agente, memoria, documentos, correo, calendario, investigación profunda) funciona completamente de forma nativa. Para las descargas de modelos en segundo plano de **Cookbook** y la herramienta de shell del agente, instala también [Git for Windows](https://git-scm.com/download/win) (que proporciona `bash.exe`). El servicio GPU local de vLLM/SGLang necesita Linux/WSL2; para un modelo local en Windows, [Ollama](https://ollama.com/download) es la vía más sencilla — apunta DarkMind-AI a `http://localhost:11434/v1` en Configuración.

Abre `http://localhost:7000`, inicia sesión con la contraseña de administrador generada y configura todo lo demás desde **Configuración**.

### Linux nativo / macOS

```bash
git clone https://github.com/pewdiepie-archdaemon/darkmind.git
cd darkmind
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python setup.py
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

Requisitos: Python 3.11+. Cookbook también necesita `tmux` para las descargas y servicios de modelos en segundo plano. La aplicación en sí es ligera; el servicio de modelos locales es la parte pesada y depende del modelo, el entorno de ejecución, la GPU y la VRAM, por lo que los hosts pequeños pueden conectarse a APIs o servidores de modelos remotos. Usa `--host 0.0.0.0` solo cuando quieras intencionadamente acceso LAN/proxy-inverso (`0.0.0.0` only when you intentionally want LAN/reverse-proxy access).

### Apple Silicon

Para Cookbook con aceleración GPU en un Mac con chip de la serie M, ejecuta DarkMind-AI de forma nativa:

```bash
git clone https://github.com/pewdiepie-archdaemon/darkmind.git
cd darkmind
./start-macos.sh
```

Se inicia en `http://127.0.0.1:7860`. Para exponerlo a tu teléfono a través de una LAN de confianza/VPN como Tailscale, vincula todas las interfaces:

```bash
DARKMIND_HOST=0.0.0.0 ./start-macos.sh
# luego abre http://<tailscale-ip>:7860
```

El script también lee `.env` al arrancar, por lo que `APP_BIND=0.0.0.0` y `APP_PORT` definidos allí se recogen automáticamente sin necesidad de un argumento en cada ejecución.

Mantén `AUTH_ENABLED=true` (el valor por defecto) antes de vincular fuera del *loopback*. No expongas este puerto directamente a internet público. Para crear un envoltorio de aplicación en macOS:

```bash
./build-macos-app.sh
```

<details>
<summary>Cookbook, GPU, Ollama y notas de solución de problemas</summary>

**Servidores remotos.** En **Cookbook -> Configuración -> Servidores**, genera la clave SSH de DarkMind-AI y añade la clave pública al archivo `~/.ssh/authorized_keys` del servidor remoto. Desde el host también puedes ejecutar:

```bash
ssh-copy-id -i data/ssh/id_ed25519.pub user@server
```

**macOS — detalles.** `start-macos.sh` instala las dependencias de Homebrew, crea el entorno virtual, ejecuta la configuración e inicia uvicorn en el puerto `7860` porque AirPlay suele ocupar el `7000`. Utiliza llama.cpp/Ollama para Metal. vLLM/SGLang son exclusivos de CUDA/ROCm y no funcionan en macOS. Los modelos solo MLX no son servidos por DarkMind-AI.

**Ollama.** Si Ollama se ejecuta en el host, añade este punto de conexión en Configuración:

```text
http://localhost:11434/v1
```

Ollama debe escuchar fuera de su propia interfaz *loopback*:

```bash
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

Cookbook **Serve** es un flujo de trabajo independiente para servir modelos descargados mediante DarkMind-AI/llama.cpp; los usuarios de Windows con una instalación existente de Ollama normalmente solo necesitan añadir el punto de conexión en Configuración.

**Verificaciones útiles.**

```bash
# Comprueba el proceso uvicorn en ejecución
ps aux | grep uvicorn
# Comprueba los logs del servidor
tail -f logs/compound.log
```

</details>

## Solución de Problemas y Configuración Avanzada

### Conflictos entre `chromadb-client` y ChromaDB embebido
Si `chromadb-client` (el paquete ligero solo-HTTP) está instalado junto al paquete completo `chromadb`, DarkMind-AI arranca pero ChromaDB vuelve silenciosamente al modo solo-HTTP y falla.

**Solución:** desinstala `chromadb-client` y reinstala el paquete completo:
```bash
./venv/bin/pip uninstall chromadb-client -y
./venv/bin/pip install --force-reinstall chromadb
```

### Exposición HTTPS + LAN/Tailscale
Para exponer DarkMind-AI en una red local o Tailscale con HTTPS:
1. Cambia la dirección de escucha a `0.0.0.0` en `.env` (`APP_BIND=0.0.0.0` o `DARKMIND_HOST=0.0.0.0`).
2. Genera un certificado de confianza local para tus IPs de LAN/Tailscale con [mkcert](https://github.com/FiloSottile/mkcert):
   ```bash
   mkcert -install
   mkcert -cert-file cert.pem -key-file key.pem 192.168.1.100 tailscale-ip
   ```
3. Ejecuta `uvicorn` con los certificados generados:
   ```bash
   python -m uvicorn app:app --host 0.0.0.0 --port 7000 --ssl-certfile=cert.pem --ssl-keyfile=key.pem
   ```
4. Instala la CA de `mkcert` en cualquier otro dispositivo desde el que quieras acceder a DarkMind-AI (por ejemplo, en iOS, envía el `rootCA.pem` por correo, instala el perfil y confía en él en Configuración de confianza de certificados).

### Dependencias Opcionales
`requirements-optional.txt` contiene paquetes que desbloquean funciones adicionales. No se instalan por defecto.

| Paquete | Función desbloqueada |
|---------|-----------------|
| `faster-whisper` | Transcripción de voz a texto local (micrófono -> texto) mediante el proveedor STT «local». |
| `duckduckgo-search` | DuckDuckGo como opción de proveedor de búsqueda. |
| `PyMuPDF` | Renderizado de páginas PDF en el panel lateral y relleno de formularios. (Nota: AGPL-3.0) |
| `markitdown` | Extracción de texto de documentos Office/EPUB (convierte .docx/.xlsx/.pptx/.xls/.epub a Markdown). |

## Notas de Seguridad
DarkMind-AI es un espacio de trabajo autoalojado con potentes herramientas locales: acceso a la shell, carga de archivos, descarga de modelos, investigación web, integraciones de correo/calendario y tokens de API. Trátalo como una consola de administración.

- Mantén `AUTH_ENABLED=true` para cualquier despliegue accesible por red.
- Mantén `LOCALHOST_BYPASS=false` fuera del desarrollo local.
- Usa `SECURE_COOKIES=true` cuando DarkMind-AI se sirva a través de HTTPS mediante un proxy inverso de confianza o una puerta de acceso privada.
- No lo expongas directamente a internet público sin HTTPS y un proxy inverso de confianza o capa de acceso privada.
- Mantén `.env`, `data/`, `logs/`, bases de datos, cargas, multimedia generada, copias de seguridad, archivos de autenticación/sesión, claves de API y tokens de modelo/proveedor fuera de Git y de los recursos compartidos. Se ignoran por defecto.
- Revisa `data/auth.json` después del primer arranque: desactiva el registro abierto a menos que lo quieras intencionadamente, haz que solo tu propia cuenta sea administradora y mantén las cuentas de demostración/prueba como no administradoras.
- Los usuarios no administradores no tienen acceso a shell/Python/lectura/escritura de archivos por defecto, y las rutas/herramientas de solo administrador, como gestión de MCP, tokens de API, *webhooks*, servicio de modelos/cookbook, copia de seguridad/bóveda y configuración de la aplicación, están restringidas a administradores. Otras funciones se controlan por privilegios por usuario, así que revisa los privilegios de cada usuario antes de exponer un despliegue.
- Rota las claves de API o tokens que hayan sido pegados en un chat compartido, demostración, captura de pantalla o registro.
- Si habilitas tokens de API o *webhooks*, crea tokens separados por integración y elimina los que no uses.
- Prefiere vincular las ejecuciones de desarrollo manual a `127.0.0.1`; vincula a `0.0.0.0` solo cuando quieras intencionadamente acceso LAN/proxy-inverso.
- Mantén ChromaDB, SearXNG, ntfy, Ollama, vLLM, llama.cpp, bases de datos y las APIs de modelos/proveedores solo de uso interno. Expón únicamente el punto de entrada web/API autenticado de DarkMind-AI a través de tu proxy de confianza o capa de acceso privada.
- Antes de publicar un *fork*, ejecuta `git status --short` y confirma que ningún archivo privado de `.env`, `data/`, `logs/`, cargas, copias de seguridad o bases de datos locales está preparado para confirmar.

### Despliegues privados o mediante proxy
DarkMind-AI sirve HTTP plano en su puerto de aplicación. Una configuración de producción/privada típica es:

1. Mantén DarkMind-AI en *localhost*, por ejemplo `127.0.0.1:7000`.
2. Termina HTTPS en un proxy inverso de confianza o puerta de acceso privada.
3. Coloca el punto de entrada web/API autenticado de DarkMind-AI detrás de esa capa.
4. Mantén los puertos de servicio y modelo sin procesar solo de uso interno.

Cloudflare Access, Tailscale, Caddy, nginx y Traefik pueden adaptarse a este patrón; ninguno es requerido por DarkMind-AI. Si tu capa de acceso llega a DarkMind-AI en el mismo host, haz proxy a `http://127.0.0.1:7000` y mantén `AUTH_ENABLED=true`, `LOCALHOST_BYPASS=false` y `SECURE_COOKIES=true`.

Puertos solo de uso interno del despliegue por defecto:

| Puerto | Servicio |
|---|---|
| `7000` | Puerto bruto de aplicación DarkMind-AI |
| `8080` | SearXNG |
| `8091` | ntfy |
| `8100` | Puerto de host ChromaDB para acceso manual |
| `11434` | Ollama |
| `8000-8020` | APIs de modelos/proveedores locales comunes |

## Contribuciones
Las contribuciones son bienvenidas. Los mejores puntos de entrada son las pruebas de instalación limpia, los errores de configuración de proveedores, el pulido de la interfaz en móvil/editor, la documentación y las refactorizaciones pequeñas y enfocadas. Consulta [ROADMAP.md](ROADMAP.md) para la lista actual de ayuda buscada.

## Configuración
La mayor parte de la configuración se realiza dentro de la aplicación con `/setup` o **Configuración**. Usa `.env` para los valores por defecto a nivel de despliegue y los secretos que quieres que estén presentes antes del primer arranque.
Configuraciones clave:

| Variable | Por defecto | Descripción |
|---|---|---|
| `LLM_HOST` | `localhost` | Tu servidor LLM (p. ej. `llm-host.local:8000`) |
| `LLM_HOSTS` | -- | Lista separada por comas para el descubrimiento de modelos |
| `OPENAI_API_KEY` | -- | Clave OpenAI opcional. Prefiere añadir proveedores en la app a menos que estés predefiniendo. |
| `SEARXNG_INSTANCE` | `http://localhost:8080` | URL de SearXNG. |
| `SEARXNG_SECRET` | generado al arrancar | Secreto de cookie/CSRF opcional para SearXNG. Deja en blanco a menos que necesites fijarlo. |
| `AUTH_ENABLED` | `true` | Activar/desactivar inicio de sesión |
| `LOCALHOST_BYPASS` | `false` | Omisión de autenticación solo para desarrollo en solicitudes de *loopback*. Mantén en false para despliegues compartidos/red. |
| `SECURE_COOKIES` | `false` | Establece true cuando DarkMind-AI se sirve a través de HTTPS en un proxy de confianza o puerta de acceso privada. |
| `DATABASE_URL` | `sqlite:///./data/app.db` | Cadena de conexión a la base de datos |
| `CHROMADB_HOST` | `localhost` | Host de ChromaDB para memoria vectorial. |
| `CHROMADB_PORT` | `8100` | Puerto de ChromaDB para ejecuciones manuales en el host. |
| `EMBEDDING_URL` | -- | Punto de conexión de *embeddings* compatible con OpenAI |

### Servidores MCP integrados (configuración opcional)

DarkMind-AI registra automáticamente algunos servidores MCP integrados al arrancar. Los basados en npx (actualmente el servidor de navegador, `@playwright/mcp`) solo se inician cuando su paquete npm ya está en la caché local de npx. Si un paquete no está en caché, ese servidor se omite con un mensaje en el registro de inicio que explica qué hacer, de modo que una instalación nueva no se bloquea esperando una descarga de npm de varios minutos ni se cuelga si faltan las dependencias del sistema de Playwright.

Para habilitar el MCP de navegador (navegación por páginas, capturas de pantalla, visión), ejecuta una vez:

```bash
npx -y @playwright/mcp@latest --version
```

Esto instala `@playwright/mcp` más Playwright (~300 MB en total). Reinicia DarkMind-AI y el servidor se registrará al arrancar.

## Arquitectura
```
app.py                   # Punto de entrada FastAPI
core/      auth, database, middleware, constants
src/       llm_core, agent_loop, agent_tools, chat_processor, search/
routes/    chat, session, document, memory, model … endpoints
services/  docs, memory, search, hwfit (Cookbook) …
static/    index.html + app.js + style.css + js/ (front-end modular)
docs/      página de inicio (index.html) + clips de previsualización
```

## Datos
Todos los datos de usuario residen en `data/` (ignorado por git): `app.db` (sesiones, mensajes, documentos), `memory.json`, `presets.json`, `uploads/`, `personal_docs/`, `chroma/`, `settings.json`.

## Star History

<a href="https://www.star-history.com/?repos=pewdiepie-archdaemon%2Fdarkmind&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=pewdiepie-archdaemon/darkmind&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=pewdiepie-archdaemon/darkmind&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=pewdiepie-archdaemon/darkmind&type=date&legend=top-left" />
 </picture>
</a>

## Licencia
MIT — consulta [LICENSE](LICENSE) y [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md).

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
