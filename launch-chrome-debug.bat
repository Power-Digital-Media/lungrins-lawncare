@echo off
echo Killing any existing Chrome processes...
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Launching Chrome with remote debugging on port 9222...
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug-profile" --no-first-run https://www.facebook.com/LungrinsLawncare
