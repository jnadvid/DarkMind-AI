# Integración de DarkMind-AI con Claude Code

Este directorio contiene el paquete de habilidades de Claude Code para DarkMind-AI.

## Flujo de usuario

1. Abre Configuración de DarkMind-AI > Integraciones.
2. Añade un Agente Claude.
3. Copia los comandos de configuración completos que aparecen tras el token generado.
4. Activa las herramientas que Claude tiene permitido usar.
5. Configura la sesión de terminal de Claude Code:

```bash
export DARKMIND_URL=http://your-darkmind-host:7000
export DARKMIND_API_TOKEN=dmd_generated_token
mkdir -p ~/.claude
curl -fsSL -H "Authorization: Bearer $DARKMIND_API_TOKEN" "$DARKMIND_URL/api/claude/plugin.zip" -o /tmp/darkmind-claude-skill.zip
python3 -m zipfile -e /tmp/darkmind-claude-skill.zip ~/.claude/
```

Claude Code carga automáticamente todo lo que hay en `~/.claude/skills/`, por lo que la habilidad `darkmind` está disponible en cualquier sesión que tenga `DARKMIND_URL` y `DARKMIND_API_TOKEN` en su entorno.

## Contenido del paquete

- `skills/darkmind/SKILL.md` — la definición de habilidad que lee Claude Code.
- `skills/darkmind/scripts/darkmind_api.py` — pequeño ayudante que llama a los endpoints `/api/codex/*` con ámbito (estos son el API canónico con ámbito de agente; la ruta `codex` es histórica y la comparten todas las integraciones de agente).

## Aplicación del ámbito

El token está restringido por ámbito. Toda la superficie de herramientas se comprueba en el servidor en DarkMind-AI, por lo que aunque Claude intente llamar a un endpoint prohibido, obtendrá `403` hasta que el usuario habilite el interruptor correspondiente en Configuración > Integraciones > Agente Claude.
