# Puente companion

Una capa delgada y aditiva para que un cliente en LAN (p. ej. un teléfono) pueda descubrir lo que ofrece un servidor DarkMind-AI y emparejarse con él, sin duplicar ninguna lógica LLM.

| Método | Ruta | Auth | Propósito |
|---|---|---|---|
| GET | `/api/companion/ping` | sesión o token | comprobación de salud barata y validada por autenticación |
| GET | `/api/companion/info` | sesión o token | identidad del servidor + indicadores de capacidad |
| GET | `/api/companion/models` | sesión o token | los endpoints de modelo **del propio solicitante** |
| GET | `/api/companion/pair` | **cookie de administrador** | página de emparejamiento (un formulario; nunca acuña) |
| POST | `/api/companion/pair` | **cookie de administrador** | acuña un token de emparejamiento de un solo uso (`?format=json` para una pantalla en la app) |

`/models` aplica ámbito al propietario real del solicitante más las filas heredadas compartidas de propietario nulo (misma regla que `owner_filter`) y nunca devuelve material de clave de API.

## Postura CSRF del emparejamiento

El acuñamiento ocurre **solo en POST**. La *cookie* de sesión es `SameSite=Lax` (`routes/auth_routes.py`), por lo que un navegador no la enviará en un POST de sitio cruzado — la misma protección en la que confía `POST /api/tokens`. Un `GET` no sería seguro (las *cookies* Lax viajan en navegaciones GET de nivel superior), por lo que `GET /pair` solo renderiza un formulario. El acuñamiento invalida la caché de tokens del middleware de autenticación, por lo que un token recién acuñado funciona en la siguiente solicitud sin necesidad de reiniciar.

Las reglas de emparejamiento/ámbito viven en unidades pequeñas y probadas (`token_owner`, `owner_can_see`, `mint_pairing_token`, `pairing.*`) — consulta `tests/test_companion_readonly.py` y `tests/test_companion_pairing.py`.
