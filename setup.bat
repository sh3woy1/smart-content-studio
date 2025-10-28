@echo off
echo ======================================
echo Smart Content Studio - Setup Script
echo ======================================
echo.

REM Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js v18 or higher.
    echo        Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detected: 
node -v

REM Check for npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo npm detected: 
npm -v

REM Check for Ollama
where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo WARNING: Ollama is not installed.
    echo          The app will work but AI features will be disabled.
    echo          Install Ollama from: https://ollama.ai/download
    echo.
    set /p continue="Do you want to continue without Ollama? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
) else (
    echo Ollama detected
    
    REM Check if Ollama is running
    curl -s http://localhost:11434/api/tags >nul 2>&1
    if %errorlevel% equ 0 (
        echo Ollama service is running
        
        echo.
        echo Available Ollama models:
        ollama list 2>nul || echo    No models installed yet
        
        echo.
        echo Recommended models for Smart Content Studio:
        echo   - llama2 (general purpose)
        echo   - mistral (fast and efficient)  
        echo   - codellama (technical content)
        echo.
        set /p pullmodel="Would you like to pull the llama2 model now? (y/n): "
        if /i "%pullmodel%"=="y" (
            echo Pulling llama2 model (this may take a few minutes)...
            ollama pull llama2
        )
    ) else (
        echo WARNING: Ollama is installed but not running.
        echo          Start Ollama to enable AI features.
    )
)

echo.
echo ======================================
echo Installing dependencies...
echo ======================================
echo.

call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ======================================
echo Building the application...
echo ======================================
echo.

call npm run build

if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ======================================
echo Setup completed successfully!
echo ======================================
echo.
echo To start the application:
echo   npm start
echo.
echo For development mode with hot reload:
echo   npm run dev
echo.
echo Enjoy creating amazing content!
echo.
pause