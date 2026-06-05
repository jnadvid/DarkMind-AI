#!/usr/bin/env bash
#
# ==========================================================================
#  DarkMind-AI — Despliegue como servicio systemd en Ubuntu/Debian (sin Docker)
#
#  Crea el entorno virtual, instala las dependencias, ejecuta la configuracion
#  inicial y registra DarkMind-AI como servicio de systemd para que arranque
#  con el sistema y se reinicie automaticamente. Es seguro volver a ejecutarlo.
#
#  Uso:
#     sudo ./desplegar-servicio.sh                 # 127.0.0.1:7000 (solo local)
#     sudo ./desplegar-servicio.sh --host 0.0.0.0  # accesible en la red local
#     sudo ./desplegar-servicio.sh --port 8080 --user juan
#     sudo ./desplegar-servicio.sh --no-apt        # no instalar paquetes con apt
#
#  Opciones:
#     --port <n>     Puerto (por defecto 7000)
#     --host <ip>    Interfaz de escucha (por defecto 127.0.0.1)
#     --user <u>     Usuario del sistema que ejecutara el servicio
#     --name <n>     Nombre del servicio (por defecto darkmind-ai)
#     --no-apt       No instalar dependencias del sistema con apt
#
#  Autor del proyecto: Jose Israel Nadal Vidal
# ==========================================================================
set -euo pipefail

# ---- Valores por defecto -------------------------------------------------
PORT=7000
HOST=127.0.0.1
SERVICE_NAME=darkmind-ai
SERVICE_USER=""
USE_APT=1

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

c_ok()   { printf '\033[32m%s\033[0m\n' "$*"; }
c_info() { printf '\033[36m==> %s\033[0m\n' "$*"; }
c_warn() { printf '\033[33m%s\033[0m\n' "$*"; }
c_err()  { printf '\033[31mERROR: %s\033[0m\n' "$*" >&2; }
die()    { c_err "$*"; exit 1; }

# ---- Parseo de argumentos ------------------------------------------------
while [ $# -gt 0 ]; do
  case "$1" in
    --port)  PORT="${2:?--port necesita un valor}"; shift 2 ;;
    --host)  HOST="${2:?--host necesita un valor}"; shift 2 ;;
    --user)  SERVICE_USER="${2:?--user necesita un valor}"; shift 2 ;;
    --name)  SERVICE_NAME="${2:?--name necesita un valor}"; shift 2 ;;
    --no-apt) USE_APT=0; shift ;;
    -h|--help)
      sed -n '2,38p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) die "Opcion desconocida: $1 (usa --help)" ;;
  esac
done

# ---- Privilegios ---------------------------------------------------------
if [ "$(id -u)" -ne 0 ]; then
  die "Este script necesita privilegios de root. Ejecutalo con: sudo $0 $*"
fi

# ---- Usuario del servicio (no debe ser root) -----------------------------
if [ -z "$SERVICE_USER" ]; then
  SERVICE_USER="${SUDO_USER:-}"
fi
if [ -z "$SERVICE_USER" ] || [ "$SERVICE_USER" = "root" ]; then
  die "Indica un usuario del sistema sin privilegios con --user <usuario> (no se recomienda ejecutar el servicio como root)."
fi
id "$SERVICE_USER" >/dev/null 2>&1 || die "El usuario '$SERVICE_USER' no existe."

run_as_user() { sudo -u "$SERVICE_USER" -H "$@"; }

echo
c_ok "========================================="
c_ok " DarkMind-AI — Despliegue como servicio"
c_ok "========================================="
echo "  Directorio : $APP_DIR"
echo "  Usuario    : $SERVICE_USER"
echo "  Escucha    : $HOST:$PORT"
echo "  Servicio   : $SERVICE_NAME.service"
echo

# ---- 1. Dependencias del sistema ----------------------------------------
c_info "1/6 Comprobando dependencias del sistema"

pick_python() {
  for py in python3.13 python3.12 python3.11 python3; do
    if command -v "$py" >/dev/null 2>&1; then
      if "$py" -c 'import sys; raise SystemExit(0 if sys.version_info[:2] >= (3,11) else 1)' >/dev/null 2>&1; then
        command -v "$py"; return 0
      fi
    fi
  done
  return 1
}

if ! PYTHON="$(pick_python)"; then
  if [ "$USE_APT" -eq 1 ] && command -v apt-get >/dev/null 2>&1; then
    c_warn "No se encontro Python 3.11+. Instalando con apt..."
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y python3 python3-venv python3-pip
    PYTHON="$(pick_python)" || die "No se pudo obtener Python 3.11+ tras la instalacion. Instalalo manualmente (p. ej. 'sudo apt install python3.12 python3.12-venv')."
  else
    die "Se requiere Python 3.11 o superior. Instalalo (p. ej. 'sudo apt install python3 python3-venv python3-pip') o ejecuta sin --no-apt."
  fi
fi
c_ok "    Python: $PYTHON ($($PYTHON --version 2>&1))"

# Asegurar el modulo venv (en Ubuntu suele venir aparte)
if ! "$PYTHON" -c 'import venv' >/dev/null 2>&1; then
  if [ "$USE_APT" -eq 1 ] && command -v apt-get >/dev/null 2>&1; then
    pyver="$("$PYTHON" -c 'import sys; print("%d.%d" % sys.version_info[:2])')"
    c_warn "Falta el modulo venv. Instalando python${pyver}-venv..."
    apt-get install -y "python${pyver}-venv" || apt-get install -y python3-venv || true
  fi
  "$PYTHON" -c 'import venv' >/dev/null 2>&1 || die "El modulo 'venv' no esta disponible. Instala el paquete python3-venv."
fi

# ---- 2. Entorno virtual --------------------------------------------------
c_info "2/6 Preparando el entorno virtual (venv)"
if [ ! -x "$APP_DIR/venv/bin/python" ]; then
  run_as_user "$PYTHON" -m venv "$APP_DIR/venv"
  c_ok "    venv creado"
else
  c_ok "    venv ya existe, se reutiliza"
fi
VENV_PY="$APP_DIR/venv/bin/python"

# ---- 3. Dependencias de Python ------------------------------------------
c_info "3/6 Instalando dependencias de Python (puede tardar)"
run_as_user "$VENV_PY" -m pip install --upgrade pip --quiet
run_as_user "$VENV_PY" -m pip install -r "$APP_DIR/requirements.txt"

# ---- 4. Configuracion inicial -------------------------------------------
c_info "4/6 Ejecutando la configuracion inicial (setup.py)"
# Crea carpetas de datos, la base de datos y el usuario admin (si es la 1a vez,
# imprime una contrasena de administrador; revisa la salida o los logs).
run_as_user "$VENV_PY" "$APP_DIR/setup.py" || c_warn "setup.py devolvio un aviso; continua, revisa la salida anterior."

# Asegurar que el usuario del servicio posee el directorio de la app
chown -R "$SERVICE_USER":"$SERVICE_USER" "$APP_DIR" 2>/dev/null || true

# ---- 5. Unit de systemd --------------------------------------------------
c_info "5/6 Generando la unit de systemd"
UNIT_PATH="/etc/systemd/system/${SERVICE_NAME}.service"
ENV_LINE=""
[ -f "$APP_DIR/.env" ] && ENV_LINE="EnvironmentFile=-$APP_DIR/.env"

cat > "$UNIT_PATH" <<UNIT
[Unit]
Description=DarkMind-AI (servidor web, sin Docker)
Documentation=https://github.com/jnadvid/DarkMind-AI
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$APP_DIR
$ENV_LINE
Environment=PYTHONUNBUFFERED=1
ExecStart=$APP_DIR/venv/bin/python -m uvicorn app:app --host $HOST --port $PORT
Restart=always
RestartSec=3
# Endurecimiento basico
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT
c_ok "    Escrito: $UNIT_PATH"

# ---- 6. Habilitar y arrancar --------------------------------------------
c_info "6/6 Habilitando y arrancando el servicio"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME" >/dev/null 2>&1 || true
systemctl restart "$SERVICE_NAME"

sleep 2
echo
if systemctl is-active --quiet "$SERVICE_NAME"; then
  c_ok "========================================="
  c_ok " DarkMind-AI esta EN EJECUCION"
  c_ok "========================================="
  echo "  URL        : http://$HOST:$PORT"
  echo "  Estado     : sudo systemctl status $SERVICE_NAME"
  echo "  Registros  : sudo journalctl -u $SERVICE_NAME -f"
  echo "  Reiniciar  : sudo systemctl restart $SERVICE_NAME"
  echo "  Detener    : sudo systemctl stop $SERVICE_NAME"
  if [ "$HOST" = "0.0.0.0" ]; then
    echo
    c_warn "Aviso: estas escuchando en 0.0.0.0 (accesible desde la red). Protege"
    c_warn "el acceso con un proxy inverso/HTTPS y un cortafuegos si es publico."
  fi
else
  c_err "El servicio no arranco correctamente. Revisa los registros con:"
  echo "  sudo journalctl -u $SERVICE_NAME -n 50 --no-pager"
  exit 1
fi
