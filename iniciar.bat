@echo off
setlocal EnableExtensions EnableDelayedExpansion
title DarkMind-AI - Lanzador nativo (sin Docker)

rem ===========================================================================
rem  DarkMind-AI - Lanzador nativo para Windows (SIN Docker)
rem
rem  Un solo comando para: crear un entorno virtual (venv), instalar las
rem  dependencias, ejecutar la configuracion inicial (muestra una contrasena
rem  de administrador en el primer arranque) e iniciar el servidor.
rem  Es seguro volver a ejecutarlo: omite lo que ya este hecho.
rem
rem  Uso:
rem    iniciar.bat                 (escucha en 127.0.0.1:7000)
rem    iniciar.bat 8080            (puerto personalizado)
rem    iniciar.bat 7000 0.0.0.0    (accesible desde la red local)
rem
rem  Autor del proyecto: Jose Israel Nadal Vidal
rem ===========================================================================

pushd "%~dp0" >nul

set "PORT=%~1"
if "%PORT%"=="" set "PORT=7000"
set "BIND=%~2"
if "%BIND%"=="" set "BIND=127.0.0.1"

echo.
echo =========================================
echo  DarkMind-AI - Iniciando (version sin Docker)
echo =========================================
echo.

rem 1. Localizar un interprete de Python 3.11+
echo ==^> Comprobando Python...
set "PYCMD="
where py >nul 2>nul
if %errorlevel%==0 (
  for %%V in (-3.13 -3.12 -3.11) do (
    if not defined PYCMD (
      py %%V -c "import sys" >nul 2>nul && set "PYCMD=py %%V"
    )
  )
)
if not defined PYCMD (
  where python >nul 2>nul
  if %errorlevel%==0 (
    python -c "import sys; assert sys.version_info[:2] >= (3,11)" >nul 2>nul && set "PYCMD=python"
  )
)
if not defined PYCMD (
  echo.
  echo [ERROR] No se encontro Python 3.11 o superior.
  echo         Instala Python 3.11+ desde https://www.python.org/downloads/
  echo         y vuelve a ejecutar este script.
  goto :fail
)
echo     Usando: %PYCMD%

rem 2. Crear el entorno virtual si no existe
set "VENVPY=%~dp0venv\Scripts\python.exe"
if not exist "%VENVPY%" (
  echo ==^> Creando entorno virtual (venv)...
  %PYCMD% -m venv venv
  if errorlevel 1 goto :fail
) else (
  echo     El venv ya existe, se omite su creacion.
)

rem 3. Instalar / actualizar dependencias
echo ==^> Instalando dependencias (el primer arranque puede tardar varios minutos)...
"%VENVPY%" -m pip install --upgrade pip --quiet
"%VENVPY%" -m pip install -r requirements.txt
if errorlevel 1 (
  echo [ERROR] Fallo la instalacion de dependencias. Revisa el error de pip arriba.
  goto :fail
)

rem 4. Configuracion inicial (crea carpetas de datos, BD, .env y usuario admin)
echo ==^> Ejecutando la configuracion inicial...
"%VENVPY%" setup.py
if errorlevel 1 goto :fail

rem 5. Iniciar el servidor
echo.
echo ==^> Iniciando DarkMind-AI en http://%BIND%:%PORT%
echo     Pulsa Ctrl+C para detenerlo.
echo.
"%VENVPY%" -m uvicorn app:app --host %BIND% --port %PORT%
goto :done

:fail
echo.
echo El arranque ha fallado. Revisa el mensaje anterior e intentalo de nuevo.
popd >nul
pause
exit /b 1

:done
popd >nul
pause
