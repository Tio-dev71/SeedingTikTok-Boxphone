@echo off
chcp 65001 >nul
title Boxphone Auto Seeding System

echo ===================================================
echo     HE THONG KHOI DONG BOXPHONE AUTO SEEDING
echo ===================================================
echo.

:: 1. Kiem tra Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [LOI] Khong tim thay Python tren may tinh nay!
    echo Vui long cai dat Python truoc (Nho tich vao o "Add Python to PATH").
    echo Vao trang web: https://www.python.org/downloads/
    pause
    exit /b
)

:: 2. Kiem tra Node.js
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [LOI] Khong tim thay Node.js tren may tinh nay!
    echo Vui long cai dat Node.js truoc.
    echo Vao trang web: https://nodejs.org/
    pause
    exit /b
)

echo [1/3] Dang kiem tra va cai dat thu vien Backend (Python)...
cd backend
pip install -r requirements.txt >nul 2>&1
cd ..

echo [2/3] Dang kiem tra va cai dat thu vien Frontend (Node.js)...
cd frontend
if not exist "node_modules" (
    echo [+] Phat hien lan chay dau tien... Se mat khoang 1-2 phut de tai thu vien.
    echo [+] Vui long doi trong giay lat...
    call npm install
)
cd ..

echo [3/3] Dang khoi dong he thong...
echo.

:: Start Backend in minimized window
start "Boxphone Backend API" /MIN cmd /c "cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000"

:: Start Frontend in minimized window
start "Boxphone Frontend UI" /MIN cmd /c "cd frontend && npm run dev"

:: Wait for servers to spin up
timeout /t 5 /nobreak >nul

:: Open Browser
echo [+] Dang mo trinh duyet Dashboard...
start http://localhost:5173

echo ===================================================
echo [+] HE THONG DA SAN SANG DE SU DUNG!
echo [+] Luu y: De tat Tool, hay TAT TAT CA cac cua so mau den (CMD) dang mo.
echo ===================================================
pause
