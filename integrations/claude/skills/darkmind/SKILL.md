---
name: darkmind
description: Use when the user asks Claude Code to read or write DarkMind data (todos, email, calendar, memory, documents) through the scoped Claude Agent API. Requires DARKMIND_URL and DARKMIND_API_TOKEN.
---

# DarkMind-AI

Usa esta habilidad cuando un usuario pida interactuar con DarkMind-AI desde Claude Code.

## Configuración

Espera estas variables de entorno:

- `DARKMIND_URL`: URL base de la instancia DarkMind-AI del usuario, por ejemplo `http://127.0.0.1:7000`.
- `DARKMIND_API_TOKEN`: Token de API con ámbito creado en Configuración de DarkMind-AI > Integraciones > Añadir integración > Agente Claude.

Si falta alguno de los dos valores, no adivines las credenciales. Indica al usuario que cree un token de Agente Claude en la Configuración de DarkMind-AI y exponga ambos valores a la sesión de terminal.

## Cuándo usar qué

- **Recordatorio («recuérdame a las 5 pm hacer X»)** → TODO con `due_date`. La due_date ES el recordatorio — dispara una notificación automáticamente a través del canal configurado por el usuario (navegador/correo/ntfy). **NO crees un evento de calendario para un recordatorio.** Crear un evento de calendario llamado «Recordatorio» NO dispara una notificación — es solo un bloque de tiempo en el calendario.
- **Evento de calendario («reunión a las 3 pm», «dentista el martes a las 10 h»)** → evento de calendario. Úsalo para bloques de tiempo programados, reuniones, citas, horarios recurrentes. Aparecen en la cuadrícula del calendario; los recordatorios para ellos se configuran por separado en la configuración de DarkMind-AI.
- **Nota / información sin formato («anota que la contraseña del wifi es ...»)** → memoria o todo sin due_date (dependiendo de si es un dato sobre el usuario o un elemento de acción).
- **Dato persistente / preferencia sobre el usuario** → memoria.

Si el usuario dice «recordatorio» + una hora, usa por defecto TODO con due_date. Solo cambia a calendario si el usuario dice explícitamente «calendario», «evento», «reunión», «cita» o describe un *rango* de tiempo.

## Seguridad

- Todo acceso a datos de DarkMind-AI DEBE pasar por la API HTTP con ámbito bajo `/api/codex/*` (la API canónica con ámbito de agente, compartida por todas las integraciones de agente).
- Comprueba `/api/codex/capabilities` antes de usar una superficie de herramienta.
- Trata `403` como una restricción intencional de Configuración. No la eludes.
- No uses SSH, Docker, importaciones directas de Python, consultas SQLite, internos de MCP, *cookies* de navegador ni archivos locales para leer/escribir datos de usuario de DarkMind-AI.
- No llames a ayudantes como `do_manage_notes`, internos de MCP de correo ni sesiones de base de datos directamente para datos de usuario, aunque exista acceso a la shell.
- Nunca envíes correo electrónico directamente a menos que el usuario lo pida explícitamente y el token tenga un ámbito con capacidad de envío.
- Mantén las acciones dentro del ámbito del propietario del token.

## Tareas pendientes

La API de agente con ámbito admite tareas pendientes/listas de verificación:

- `GET /api/codex/todos`
- `POST /api/codex/todos`

Usa el script de ayuda incluido cuando esté disponible:

```bash
python3 ~/.claude/skills/darkmind/scripts/darkmind_api.py capabilities
python3 ~/.claude/skills/darkmind/scripts/darkmind_api.py todos list
python3 ~/.claude/skills/darkmind/scripts/darkmind_api.py todos add "Follow up"
```

Las acciones de todo admitidas son `list`, `add`, `update`, `delete` y `toggle_item`.

**Recordatorios (todos con fecha de vencimiento)** — el backend analiza lenguaje natural. Envía `due_date` en el cuerpo mediante el POST genérico para que la hora se convierta en un recordatorio estructurado, NO como subcadena literal dentro del título. El acceso directo `todos add TITULO` solo establece el título, así que usa el formulario POST para cualquier cosa con una hora:

```bash
python3 ~/.claude/skills/darkmind/scripts/darkmind_api.py POST /api/codex/todos '{"action":"add","title":"Call dentist","due_date":"tomorrow at 5pm"}'
```

El backend acepta tanto marcas de tiempo ISO como lenguaje natural como `"tomorrow 5pm"`, `"next Monday 9am"`, `"in 2 hours"`. Se ancla a la zona horaria del usuario.

## Correo electrónico

La API de agente con ámbito admite lecturas de correo:

- `GET /api/codex/emails?folder=INBOX&limit=10&offset=0&filter=all`
- `GET /api/codex/emails/{uid}?folder=INBOX`

Usa el script de ayuda incluido cuando esté disponible:

```bash
python3 ~/.claude/skills/darkmind/scripts/darkmind_api.py emails list 5
python3 ~/.claude/skills/darkmind/scripts/darkmind_api.py emails read UID
```

Si `/api/codex/capabilities` no muestra `email.read: true`, no inspecciones el correo. Pide al usuario que habilite la lectura de correo en la configuración del Agente Claude.

## Memoria

- `GET /api/codex/memory` — lista las memorias del propietario del token.
- `POST /api/codex/memory` — cuerpo `{"text": "...", "category": "fact", "source": "user", "session_id": null}`. Requiere `memory:write`.
- `DELETE /api/codex/memory/{memory_id}` — elimina una entrada de memoria. Requiere `memory:write`.

```bash
python3 ~/.claude/skills/darkmind/scripts/darkmind_api.py GET /api/codex/memory
python3 ~/.claude/skills/darkmind/scripts/darkmind_api.py POST /api/codex/memory '{"text":"User prefers SI units","category":"preference"}'
```

## Calendario

- `GET /api/codex/calendar/events?start=ISO&end=ISO` — lista eventos en la ventana.
- `POST /api/codex/calendar/events` — el cuerpo coincide con `EventCreate` (`summary`, `dtstart`, `dtend`, `all_day`, `description`, `location`, `calendar_href`, `rrule`, `color`). Requiere `calendar:write`.
- `DELETE /api/codex/calendar/events/{uid}` — elimina evento por uid (el valor devuelto en la respuesta del POST). Requiere `calendar:write`.

## Documentos

- `GET /api/codex/documents?search=...&limit=50` — biblioteca paginada.
- `GET /api/codex/documents/{doc_id}` — obtiene un documento.
- `POST /api/codex/documents` — cuerpo `{"session_id": "...", "title": "...", "content": "...", "language": "markdown"}`. Requiere `documents:write`.
- `DELETE /api/codex/documents/{doc_id}` — elimina un documento. Requiere `documents:write`.

## Borrador y envío de correo

- `POST /api/codex/emails/draft` — el cuerpo coincide con `SendEmailRequest` (`to`, `cc`, `bcc`, `subject`, `body`, `body_html`, `attachments`, `account_id`, `in_reply_to`, `references`). Requiere `email:draft` (o `email:send`).
- `POST /api/codex/emails/send` — mismo cuerpo. Requiere `email:send`. Nunca envíes sin instrucción explícita del usuario.

## Patrón de omisión prohibida

Si estás a punto de acceder al host/contenedor de DarkMind-AI, importar internos de la aplicación, consultar la base de datos o llamar directamente a módulos de ayuda de MCP, detente. Esas rutas omiten la Configuración de DarkMind-AI y los ámbitos de los tokens. Pide al usuario que habilite el interruptor de herramienta del Agente Claude correspondiente.
