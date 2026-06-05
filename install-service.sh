#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_FILE="$SCRIPT_DIR/darkmind-ui.service"

if [ ! -f "$SERVICE_FILE" ]; then
  echo "Error: darkmind-ui.service not found in $SCRIPT_DIR"
  exit 1
fi

echo "Installing DarkMind UI service..."
echo "Make sure you've edited darkmind-ui.service with your username and paths first!"
echo ""

sudo cp "$SERVICE_FILE" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable darkmind-ui
sudo systemctl start darkmind-ui
sudo systemctl status darkmind-ui
