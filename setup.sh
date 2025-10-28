#!/bin/bash

# Smart Content Studio Setup Script

echo "======================================"
echo "Smart Content Studio - Setup Script"
echo "======================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is too old. Please install Node.js v18 or higher."
    echo "   Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Check for Ollama
if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama is not installed."
    echo "   The app will work but AI features will be disabled."
    echo "   Install Ollama from: https://ollama.ai/download"
    echo ""
    read -p "Do you want to continue without Ollama? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Ollama detected"
    
    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama service is running"
        
        # List available models
        echo ""
        echo "Available Ollama models:"
        ollama list 2>/dev/null || echo "   No models installed yet"
        
        echo ""
        echo "Recommended models for Smart Content Studio:"
        echo "  - llama2 (general purpose)"
        echo "  - mistral (fast and efficient)"
        echo "  - codellama (technical content)"
        echo ""
        read -p "Would you like to pull the llama2 model now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Pulling llama2 model (this may take a few minutes)..."
            ollama pull llama2
        fi
    else
        echo "⚠️  Ollama is installed but not running."
        echo "   Start Ollama with: ollama serve"
    fi
fi

echo ""
echo "======================================"
echo "Installing dependencies..."
echo "======================================"
echo ""

# Install npm dependencies
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "======================================"
echo "Building the application..."
echo "======================================"
echo ""

# Build the application
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "======================================"
echo "✅ Setup completed successfully!"
echo "======================================"
echo ""
echo "To start the application:"
echo "  npm start"
echo ""
echo "For development mode with hot reload:"
echo "  npm run dev"
echo ""
echo "Enjoy creating amazing content! 🚀"