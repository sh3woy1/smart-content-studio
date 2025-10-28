# 🚀 Smart Content Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-28-47848F.svg)](https://www.electronjs.org/)
[![Ollama](https://img.shields.io/badge/Ollama-Compatible-green.svg)](https://ollama.ai/)

A powerful desktop application for content creators that integrates with Ollama AI to help produce professional, high-quality content across multiple formats and styles. 100% local, private, and free!

![Smart Content Studio Screenshot](https://raw.githubusercontent.com/sh3woy1/smart-content-studio/main/resources/screenshot.png)

## ✨ Features

### 🤖 AI-Powered Writing Assistant
- Real-time suggestions and improvements using local Ollama models
- Content generation with 8+ professional templates
- Tone adjustments, paraphrasing, and expansion
- Grammar checking and style improvements
- SEO optimization suggestions

### 📝 Professional Editor
- Monaco Editor (VS Code's editor) integration
- Live markdown preview with split view
- Syntax highlighting and auto-completion
- Distraction-free writing mode
- Multi-document tabs support

### 🎯 Content Templates
- Blog posts with SEO structure
- Social media content (Twitter, LinkedIn, Facebook)
- Email newsletters and campaigns
- Product descriptions and landing pages
- Technical documentation
- Press releases and case studies

### 📊 Analytics & Insights
- Writing productivity tracking
- Word count statistics
- Content type distribution
- Daily/weekly progress charts
- Writing pattern analysis

### 🎨 Modern UI/UX
- Beautiful dark/light theme
- Responsive design
- Keyboard-first workflow
- Customizable interface
- Real-time status updates

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Ollama** - [Install Ollama](https://ollama.ai/download)
3. **Git** - [Download](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sh3woy1/smart-content-studio.git
cd smart-content-studio

# 2. Install Ollama (if not already installed)
# macOS/Linux:
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: Download from https://ollama.ai/download

# 3. Pull an AI model
ollama pull llama2  # or mistral, codellama, etc.

# 4. Run the setup script (handles everything!)
./setup.sh  # macOS/Linux
# OR
setup.bat   # Windows

# 5. Start the application
npm start
```

### Development Mode

```bash
# Run with hot reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Editor**: Monaco Editor (VS Code's editor)
- **Backend**: Electron 28, SQLite, Better-SQLite3
- **AI**: Ollama integration with streaming support
- **State**: Zustand with persistence
- **Build**: Webpack, electron-builder
- **UI Components**: Radix UI, Lucide Icons

## 📦 Building & Distribution

```bash
# Build for production
npm run build

# Package for current platform
npm run package

# Package for all platforms
npm run package -- --mac --win --linux
```

Packaged applications will be in the `dist-electron` directory.

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Document | `Ctrl/Cmd + N` |
| Save | `Ctrl/Cmd + S` |
| Open | `Ctrl/Cmd + O` |
| Find | `Ctrl/Cmd + F` |
| AI Improve | `Ctrl/Cmd + I` |
| AI Expand | `Ctrl/Cmd + E` |
| Switch Views | `Ctrl/Cmd + 1/2/3` |
| Navigate Pages | `Alt + 1-5` |
| Distraction Free | `F11` |
| Settings | `Ctrl/Cmd + ,` |

## 🎯 Supported Ollama Models

The app works with any Ollama model. Recommended:

- **llama2** - General purpose, balanced performance
- **mistral** - Fast and efficient
- **mixtral** - Powerful for complex tasks
- **codellama** - Best for technical content
- **neural-chat** - Great for conversational content

## 🔒 Privacy & Security

- ✅ **100% Local**: All processing happens on your machine
- ✅ **No Cloud**: No data ever leaves your computer
- ✅ **No Telemetry**: Zero tracking or analytics
- ✅ **Open Source**: Complete transparency
- ✅ **Secure Storage**: Local SQLite database

## 🗂️ Project Structure

```
smart-content-studio/
├── src/
│   ├── main/              # Electron main process
│   │   ├── services/       # Ollama, Database, File services
│   │   └── ipc-handlers.ts # IPC communication
│   ├── renderer/           # React application
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── store/         # Zustand state management
│   └── shared/            # Shared types and utilities
├── resources/             # App icons and assets
├── public/               # Static files
└── dist/                 # Build output
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for local AI models
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the editing experience
- [Electron](https://www.electronjs.org/) for cross-platform desktop apps
- [React](https://reactjs.org/) for the UI framework
- [TailwindCSS](https://tailwindcss.com/) for styling

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/sh3woy1/smart-content-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sh3woy1/smart-content-studio/discussions)

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ for content creators who value privacy and local AI**