# Contribuir a DarkMind-AI

Gracias por tu ayuda. El proyecto avanza rápidamente, así que las mejores contribuciones son las que están enfocadas, son fáciles de revisar y fáciles de probar.

## Modelo de ramas

DarkMind-AI tiene dos ramas:

- **`dev`** — donde aterrizan todos los PRs. Las cosas pueden estar en flujo aquí; el botón de fusión se usa con libertad.
- **`main`** — lo que ejecutan los usuarios. Curado y probado por el mantenedor. Se avanza en forma rápida a un commit estable de `dev` en cada versión.

**Abre tu PR contra `dev`, no contra `main`.** El desplegable «base» de GitHub tiene `dev` por defecto. Si abriste un PR contra `main` por error, haz clic en «Edit» en el PR y cambia la base — no es necesario hacer *rebase*.

Los usuarios que clonen el repositorio aterrizarán en `dev` por defecto. Para ejecutar la versión curada/estable: `git checkout main` tras clonar.

## Antes de empezar

- Busca en los *issues* y *pull requests* existentes antes de abrir uno nuevo.
- Prefiere un solo arreglo de error o funcionalidad por *pull request*.
- Evita reescrituras amplias, cambios solo de formato o mover muchos archivos a menos que el *issue* trate específicamente de estructura.
- Si quieres trabajar en una funcionalidad grande, abre primero un *issue* y describe el enfoque.

## Configuración

El desarrollo manual usa Python 3.11+:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python setup.py
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

En Windows, usa `launch-windows.ps1` o `iniciar.bat` para un lanzamiento en un solo paso.

## Ejecución de comprobaciones

Ejecuta las comprobaciones más pequeñas relevantes para tu cambio:

```bash
python -m pytest
python -m py_compile app.py routes/*.py src/*.py
node --check static/js/<archivo-que-cambiaste>.js
```

Menciona qué ejecutaste en la descripción del *pull request*. Si no pudiste ejecutar alguna comprobación, indícalo.

## Pull Requests

Los buenos *pull requests* suelen incluir:

- Una breve explicación del error o la funcionalidad.
- Los archivos o áreas modificados.
- Pasos de prueba manual o resultados de pruebas automatizadas de la ejecución real de la aplicación, no solo del conjunto de pruebas.
- Capturas de pantalla o grabaciones cortas para cambios de interfaz.
- Vínculos a los *issues* relacionados, por ejemplo `Fixes #123`.

Mantén los PRs pequeños. Los PRs grandes que mezclan limpieza no relacionada, formato, refactorizaciones y cambios de comportamiento son mucho más difíciles de revisar.

> **PRs generados automáticamente.** Si estás ejecutando un agente LLM (Devin, Cursor, OpenHands, Claude Code, etc.) contra este repositorio: por favor, abre primero un *issue* describiendo el problema en lugar de abrir un PR directamente. Los PRs generados en masa por agentes que no coinciden con el estilo visual o el formato de contribución del proyecto se cerrarán sin revisión, aunque el arreglo subyacente sea correcto.

## Estilo y cambios visuales

DarkMind-AI tiene un estilo visual intencional. Los PRs que lo ignoren se cerrarán sin fusión, sin importar lo correcto que sea el código subyacente.

Antes de enviar cualquier cambio que afecte al aspecto de la aplicación — botones, iconos, fuentes, colores, espaciado, diseño, CSS, HTML, SVG o cualquier módulo `static/js/` que dibuje en el DOM — por favor:

1. **Ejecuta la aplicación localmente** y visualiza el cambio en un navegador. Las comprobaciones de tipos y las pruebas unitarias no son suficientes.
2. **Adjunta una captura de pantalla o un clip corto** del cambio en la aplicación en ejecución. Añade también una captura de pantalla en móvil si el cambio afecta al móvil.
3. **Respeta el lenguaje visual existente.** En concreto:
   - Reutiliza las variables CSS existentes (`--red`, `--fg`, `--bg`, `--card`, `--border`, …). No introduzcas nuevos valores de color, tamaños de fuente ni unidades de espaciado.
   - Reutiliza las clases existentes de botón, entrada, tarjeta y borde. No inventes estilos paralelos para widgets similares.
   - **Sin emoji Unicode en la interfaz ni en el código.** Usa SVG en línea (siguiendo el estilo de iconos monocromo ya presente en `static/index.html`) o texto plano.
   - Fuente monoespaciada (`Fira Code`) para el texto principal de la interfaz. No la sobreescribas.
   - El tema oscuro es el predeterminado; cualquier trabajo en modo claro va a través del sistema de temas existente, sin valores codificados directamente.
4. **No añadas componentes paralelos.** Si ya existe un widget similar en la aplicación, extiéndelo en lugar de escribir uno nuevo.

Si no estás seguro de si un cambio es «visual», lo es. Por defecto, adjunta una captura de pantalla.

## Informes de errores

Para los errores, incluye:

- Método de instalación: Python manual, WSL, etc.
- Sistema operativo, navegador y dispositivo si son relevantes.
- Pasos exactos para reproducir el error.
- Comportamiento esperado y comportamiento real.
- Registros, capturas de pantalla o salida del terminal.

Para problemas de servicio de modelos, incluye:

- Backend: Ollama, vLLM, SGLang, llama.cpp, LM Studio, etc.
- Nombre del modelo.
- GPU/CPU y sistema operativo.
- Registros de tareas de Cookbook o registros del servidor.

Los *issues* con solo «ayuda», «no funciona» o una captura de pantalla sin contexto pueden cerrarse por no ser accionables.

## Seguridad

No publiques secretos, claves de API, registros privados, documentos personales o IPs públicas en *issues* o *pull requests*.

Para informes de seguridad, sigue [SECURITY.md](SECURITY.md).
