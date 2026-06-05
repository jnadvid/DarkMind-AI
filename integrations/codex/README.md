# Integración de DarkMind-AI con Codex

Este directorio contiene el paquete de complemento/habilidades de Codex para DarkMind-AI.

## Flujo de usuario

1. Abre Configuración de DarkMind-AI > Integraciones.
2. Añade un Agente Codex.
3. Copia los comandos de configuración completos que aparecen tras el token generado.
4. Activa las herramientas que Codex tiene permitido usar.
5. Configura la sesión de terminal de Codex:

```bash
export DARKMIND_URL=http://your-darkmind-host:7000
export DARKMIND_API_TOKEN=dmd_generated_token
mkdir -p ~/plugins
curl -fsSL -H "Authorization: Bearer $DARKMIND_API_TOKEN" "$DARKMIND_URL/api/codex/plugin.zip" -o /tmp/darkmind-codex-plugin.zip
python3 -m zipfile -e /tmp/darkmind-codex-plugin.zip ~/plugins
python3 - <<'PY'
import json
from pathlib import Path

p = Path.home() / ".agents" / "plugins" / "marketplace.json"
p.parent.mkdir(parents=True, exist_ok=True)
if p.exists():
    data = json.loads(p.read_text())
else:
    data = {"name": "personal", "interface": {"displayName": "Personal"}, "plugins": []}

data.setdefault("name", "personal")
data.setdefault("interface", {}).setdefault("displayName", "Personal")
plugins = data.setdefault("plugins", [])
entry = {
    "name": "darkmind",
    "source": {"source": "local", "path": "./plugins/darkmind"},
    "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
    "category": "Productivity",
}
data["plugins"] = [item for item in plugins if item.get("name") != "darkmind"] + [entry]
p.write_text(json.dumps(data, indent=2) + "\n")
PY
codex plugin add darkmind@personal
```

6. Verifica:

```bash
python3 ~/plugins/darkmind/scripts/darkmind_api.py capabilities
```

Codex debe usar los endpoints `/api/codex/*`. SSH, Docker, importaciones directas de Python, consultas de base de datos e internos de MCP omiten la Configuración de DarkMind-AI y no deben usarse para acceder a datos de usuario.
