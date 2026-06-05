# Política de Seguridad

DarkMind-AI es un espacio de trabajo de IA autoalojado con capacidades locales privilegiadas. Por favor, no lo ejecutes como un servicio público sin autenticación.

## Versiones Compatibles

Los arreglos de seguridad se gestionan en la rama predeterminada hasta que se publiquen versiones formales.

## Orientación sobre el Despliegue

- Mantén `AUTH_ENABLED=true` para cualquier despliegue accesible por red.
- Mantén `LOCALHOST_BYPASS=false` fuera del desarrollo local.
- Establece `SECURE_COOKIES=true` cuando DarkMind-AI se sirva a través de HTTPS mediante un proxy inverso de confianza o una puerta de acceso privada.
- Usa HTTPS cuando expongas la aplicación más allá de *localhost*.
- Coloca el punto de entrada web/API autenticado de DarkMind-AI detrás de un proxy inverso de confianza o capa de acceso privada, como Cloudflare Access, Tailscale o una VPN.
- Mantén ChromaDB, SearXNG, ntfy, Ollama, vLLM, llama.cpp, bases de datos y las APIs de modelos/proveedores sin procesar solo de uso interno.
- Protege `.env`, `data/`, `logs/`, cargas, multimedia generada, copias de seguridad, archivos de autenticación/sesión, archivos de base de datos, claves de API y tokens de modelo/proveedor.
- Desactiva el registro abierto a menos que quieras nuevas cuentas intencionadamente.
- Mantén los usuarios de demostración/prueba como no administradores y elimínalos por completo en despliegues serios.
- Da a las cuentas de administrador contraseñas fuertes y habilita 2FA donde sea posible.
- Deja las herramientas de agente de alto riesgo restringidas a administradores: shell, Python, lectura/escritura de archivos, envío/lectura de correo, MCP, API de aplicación, gestión de tareas/habilidades/memoria, configuración, tokens y servicio de modelos.
- Rota las claves de API, secretos de *webhook* y tokens de API de DarkMind-AI si aparecen en registros, capturas de pantalla, demos o chats compartidos.
- Trata las funciones de shell, servicio de modelos, MCP, correo, calendario y bóveda como funcionalidad de administrador privilegiada.
- Los puertos solo de uso interno habituales son DarkMind-AI `7000`, SearXNG `8080`, ntfy `8091`, ChromaDB `8100`, Ollama `11434` y las APIs de modelos/proveedores locales como `8000-8020`.

## Publicar un Fork

Antes de publicar un *fork* público, ejecuta:

```bash
git status --short
git check-ignore -v .env data/auth.json data/app.db logs/compound.log darkmind.db
git grep -n -I -E "(sk-[A-Za-z0-9_-]{20,}|xox[baprs]-|AIza[0-9A-Za-z_-]{20,}|Bearer [A-Za-z0-9._~+/-]{20,})" -- . ':!static/lib/**' ':!package-lock.json'
```

Solo deberían confirmarse `.env.example`, documentación, código fuente, pruebas y activos estáticos. Nunca confirmes valores en vivo de `.env`, contenidos de `data/`, bases de datos locales, archivos subidos, multimedia generada, registros, copias de seguridad, archivos de autenticación/sesión, claves de API, tokens de modelo/proveedor, hashes de contraseñas ni documentos personales.

## Notificación de Vulnerabilidades

Por favor, notifica las vulnerabilidades de forma privada a través de los avisos de seguridad de GitHub si están disponibles, o abriendo un *issue* mínimo que no revele detalles del exploit.
