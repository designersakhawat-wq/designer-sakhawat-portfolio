@echo off
title GitHub Push Helper
echo ========================================================
echo  GitHub Authentication & Push Assistant
echo ========================================================
echo.
echo  This script will open the standard GitHub browser login window.
echo  Please log in when prompted.
echo.
cd /d "C:\Users\Md Sakhawat Hossain\.gemini\antigravity\brain\bf2dc150-55a1-4d44-8dbc-52fee8015bfc\portfolio"
"..\git-portable\cmd\git.exe" push -u origin main
echo.
echo ========================================================
echo  Done! You can close this window.
echo ========================================================
pause
