@echo off
setlocal EnableExtensions
title DarkMind-AI - Lanzador nativo (sin Docker)

rem ==========================================================================
rem  DarkMind-AI - Lanzador nativo para Windows (SIN Docker)
rem  Crea el entorno virtual, instala dependencias, ejecuta la configuracion
rem  inicial e inicia el servidor. Es seguro volver a ejecutarlo.
rem  Uso:  iniciar.bat  [puerto]  [host]
rem  Autor del proyecto: Jose Israel Nadal Vidal
rem ==========================================================================

cd /d "%~dp0"

set "PORT=%~1"
if "%PORT%"=="" set "PORT=7000"
set "BIND=%~2"
if "%BIND%"=="" set "BIND=127.0.0.1"

echo.
echo =========================================
echo  DarkMind-AI - Iniciando (version sin Docker)
echo =========================================
echo.

rem 1. Localizar Python 3.11+
echo [1/5] Comprobando Python...
set "PYCMD="
py -3 -c "import sys;raise SystemExit(0 if sys.version_info[:2]>=(3,11) else 1)" 2>nul
if not errorlevel 1 set "PYCMD=py -3"
if not defined PYCMD (
  python -c "import sys;raise SystemExit(0 if sys.version_info[:2]>=(3,11) else 1)" 2>nul
  if not errorlevel 1 set "PYCMD=python"
)
if not defined PYCMD (
  python3 -c "import sys;raise SystemExit(0 if sys.version_info[:2]>=(3,11) else 1)" 2>nul
  if not errorlevel 1 set "PYCMD=python3"
)
if not defined PYCMD (
  echo.
  echo [ERROR] No se encontro Python 3.11 o superior.
  echo         Instalalo desde https://www.python.org/downloads/ y marca
  echo         "Add Python to PATH". Luego vuelve a ejecutar este archivo.
  goto :fin
)
echo       Usando: %PYCMD%

rem 2. Crear el entorno virtual si no existe
if not exist "venv\Scripts\python.exe" (
  echo [2/5] Creando el entorno virtual...
  %PYCMD% -m venv venv
  if errorlevel 1 (
    echo [ERROR] No se pudo crear el entorno virtual.
    goto :fin
  )
) else (
  echo [2/5] El venv ya existe, se omite.
)

set "VENVPY=venv\Scripts\python.exe"

rem 3. Instalar dependencias
echo [3/5] Instalando dependencias (el primer arranque puede tardar)...
"%VENVPY%" -m pip install --upgrade pip --quiet
"%VENVPY%" -m pip install -r requirements.txt
if errorlevel 1 (
  echo [ERROR] Fallo la instalacion de dependencias. Revisa el error de pip.
  goto :fin
)

rem 4. Configuracion inicial
echo [4/5] Ejecutando la configuracion inicial...
"%VENVPY%" setup.py
if errorlevel 1 (
  echo [ERROR] setup.py fallo.
  goto :fin
)

rem 5. Iniciar el servidor
echo [5/5] Iniciando DarkMind-AI en http://%BIND%:%PORT%
echo       Pulsa Ctrl+C para detenerlo.
echo.
"%VENVPY%" -m uvicorn app:app --host %BIND% --port %PORT%

:fin
echo.
pause
endlocal
