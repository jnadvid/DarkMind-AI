# Modelo de Amenazas

DarkMind-AI es un **espacio de trabajo de IA autoalojado con acceso local privilegiado**. Este documento establece el límite de confianza para que los contribuidores puedan razonar sobre las decisiones de seguridad sin necesidad de leer toda la pila de autenticación y middleware.

## Límite de Confianza

DarkMind-AI está diseñado para **usuarios de confianza en una red privada**, no para exposición pública. El README lo describe como «trátalo como una consola de administración» — ese enfoque es preciso. Un administrador conectado puede ejecutar comandos de shell, leer y escribir archivos, enviar correo electrónico y controlar el servicio de modelos. Esto es intencional. El modelo de amenazas no intenta impedir que los administradores hagan estas cosas. Lo que sí intenta impedir es:

- Acceso no autenticado
- Usuarios no administradores que accedan a capacidades exclusivas de administrador
- El agente de IA que actúa según instrucciones inyectadas a través de contenido no confiable (resultados web, correos electrónicos, páginas obtenidas, memorias)
- Servicios internos (ChromaDB, Ollama, SearXNG, etc.) accesibles desde fuera del host

## Roles y Capacidades

| Capacidad | Administrador | No administrador (por defecto) |
|---|---|---|
| Chat con agente | ✓ | ✓ |
| Herramienta de navegador | ✓ | ✓ |
| Documentos | ✓ | ✓ |
| Modo investigación | ✓ | ✓ |
| Generación de imágenes | ✓ | ✓ |
| Gestión de memoria | ✓ | ✓ |
| Shell / Ejecución Python | ✓ | ✗ |
| Lectura / escritura de archivos | ✓ | ✗ |
| Envío / lectura de correo | ✓ | ✗ |
| Herramientas MCP | ✓ | ✗ |
| Gestión del calendario | ✓ | ✗ |
| Gestión de tokens / webhooks | ✓ | ✗ |
| Servicio de modelos | ✓ | ✗ |
| Bóveda | ✓ | ✗ |
| Configuración | ✓ | ✗ |

Los valores predeterminados de no administrador están en `core/auth.py:DEFAULT_PRIVILEGES`. La aplicación de herramientas está en `src/tool_security.py:NON_ADMIN_BLOCKED_TOOLS`. Cualquier herramienta cuyo nombre comience con `mcp__` también está bloqueada para los no administradores. Los administradores siempre tienen acceso completo independientemente de los valores de privilegio almacenados.

## Autenticación

- **Sesiones:** contraseñas bcrypt, tokens de sesión de 7 días almacenados atómicamente en `data/sessions.json` mediante `core/atomic_io.py`.
- **2FA:** TOTP con 8 códigos de respaldo de un solo uso. Verificado tras la comprobación de contraseña, antes de la emisión de sesión.
- **Nombres de usuario reservados:** `internal-tool`, `api`, `demo`, `system` no pueden registrarse ni cambiarse a ninguno de ellos. Definidos en `core/auth.py:RESERVED_USERNAMES`.
  - `internal-tool` es crítico para la seguridad: `core/middleware.py:require_admin` trata cualquier solicitud donde `request.state.current_user == "internal-tool"` como el *loopback* de herramienta en proceso y concede acceso de administrador incondicionalmente. Una cuenta real con ese nombre pasaría silenciosamente cada comprobación de `require_admin`.
- **Sesiones huérfanas:** `validate_token` vuelve a comprobar que el registro de usuario aún existe en cada llamada. La *cookie* de un usuario eliminado se descarta en la siguiente solicitud en lugar de continuar autenticando.

## Loopback Interno de Herramientas

Las llamadas a herramientas del agente llegan a las rutas HTTP restringidas a administradores a través de un *loopback* HTTP en proceso. El mecanismo:

1. Al iniciar la aplicación, `core/middleware.py` genera un `INTERNAL_TOOL_TOKEN` aleatorio mediante `secrets.token_hex(32)`. Nunca se persiste y nunca se envía a los clientes.
2. Las solicitudes de *loopback* llevan `X-DarkMind-Internal-Token: <token>` o tienen `request.state.current_user` ya establecido en `"internal-tool"` por el middleware de autenticación.
3. `require_admin` reconoce cualquiera de las dos señales y concede acceso sin comprobar el usuario de la sesión.

El agente puede estar ejecutándose en la sesión de un usuario no administrador, pero el despacho de herramientas llama primero a `src/tool_security.py:owner_is_admin_or_single_user` para verificar que el propietario de la sesión es un administrador antes de emitir cualquier llamada de *loopback*. Los usuarios no administradores no pueden invocar herramientas de administrador ni siquiera a través del agente.

## Refuerzo contra Inyección de Instrucciones

El contenido externo que llega al LLM se trata como no confiable mediante `src/prompt_security.py`:

- `untrusted_context_message(label, content)` envuelve el contenido en un mensaje con rol `user` con un bloque de encabezado que instruye al modelo a no seguir instrucciones dentro de él. El contenido se introduce como datos, no como instrucción del sistema.
- `UNTRUSTED_CONTEXT_POLICY` es un preámbulo del *prompt* del sistema que establece la misma política al inicio de cada sesión donde puedan aparecer datos no confiables.

**Superficies no confiables que deben pasar por este envoltorio:** resultados de búsqueda web, URLs obtenidas, correos electrónicos (lectura), memorias guardadas, texto de habilidades, notas y cualquier salida de herramientas procedente de fuera del servidor. Inyectar contenido no confiable directamente en el rol del sistema es un error de seguridad.

## Cabeceras de Seguridad

`core/middleware.py:SecurityHeadersMiddleware` establece cabeceras en cada respuesta:

- `X-Frame-Options: DENY` + `frame-ancestors 'none'` en todas las rutas excepto los iframes de renderizado de herramientas (que están en *sandbox* a nivel HTML).
- `X-Content-Type-Options: nosniff` y `Referrer-Policy: no-referrer` en todas partes.
- **CSP:** `script-src` basado en nonce: `'self' 'nonce-{nonce}' https://cdn.jsdelivr.net`. `style-src 'unsafe-inline'` se mantiene intencionadamente — `static/index.html` incluye bloques `<style>` en línea y los módulos JS establecen atributos `style=""` en tiempo de ejecución. Los estilos en línea no ejecutan scripts, por lo que el riesgo es solo visual. Eliminar esto requeriría convertir los archivos HTML en plantillas y auditar todos los atributos de estilo establecidos por JS.

## Brechas Conocidas

Estas son abiertas, reconocidas, y se agradece la ayuda de contribuidores:

1. **Sin sandbox de shell/sistema de archivos.** Las herramientas `bash` del agente y `read_file`/`write_file` se ejecutan como el usuario del proceso de la aplicación sin filtrado de salida de red ni confinamiento del sistema de archivos. Una inyección de instrucciones exitosa que llegue a una sesión de administrador con shell habilitado puede realizar solicitudes salientes a los servicios internos. Consulta #1058 para la propuesta de sandbox.

2. **SSRF mediante el parámetro `base_url` en `/api/v1/chat`.** Un token de API con ámbito de chat puede suministrar un `base_url` arbitrario; el servidor reenvía la solicitud LLM a ese host sin validar el esquema ni la dirección. El PR #1039 soluciona esto.

3. **Consolidación parcial de `src/search/`.** `src.search.core` y `src.search.providers` alisan correctamente `services.search` mediante la sustitución de `sys.modules`. `analytics`, `cache`, `content`, `query` y `ranking` siguen siendo copias independientes que pueden divergir. Las pruebas de regresión de SSRF en `tests/test_webhook_ssrf_resilience.py` prueban `src.webhook_manager` directamente (independiente de la búsqueda), por lo que la red de seguridad allí está intacta. Consulta #1058.

4. **Los ámbitos de token son gruesos.** No hay forma de conceder a una sesión un subconjunto de los privilegios del usuario propietario. Los tokens de compañero/móvil llevan ámbito `chat` o `admin` sin granularidad por capacidad.
