@echo off
setlocal
cd /d "%~dp0"
py -3 -c "import sys; sys.exit(sys.version_info < (3, 8))" >nul 2>nul
if not errorlevel 1 goto run_py
python -c "import sys; sys.exit(sys.version_info < (3, 8))" >nul 2>nul
if not errorlevel 1 goto run_python
echo Sela memerlukan Python 3.8 atau lebih baru. Instal Python lalu coba lagi.
pause
exit /b 1

:run_py
py -3 jalankan_sela.py
goto finish

:run_python
python jalankan_sela.py

:finish
if errorlevel 1 pause
