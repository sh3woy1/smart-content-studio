# Smart Content Studio

A powerful desktop application for content creators that integrates with Ollama AI to help produce professional, high-quality content across multiple formats and styles.

![Smart Content Studio](./resources/banner.png)

## Features

### 🚀 Core Features
- **AI-Powered Writing Assistant** - Real-time suggestions, rewrites, and improvements using Ollama
- **Multi-Format Content Generation** - Blog posts, social media, emails, technical docs, and more
- **Smart Editor** - Monaco-based editor with syntax highlighting and rich formatting
- **Project Management** - Organize content in projects with tags and categories
- **Template Library** - Pre-built and custom templates for various content types
- **Analytics Dashboard** - Track your writing productivity and patterns
- **Export Options** - Export to Markdown, HTML, PDF, Word, and plain text

### 🤖 AI Capabilities
- Content generation and expansion
- Tone and style adjustments
- Grammar and clarity improvements
- SEO optimization
- Paraphrasing and summarization
- Headline and hook generation
- Contextual suggestions

### 💎 Advanced Features
- Distraction-free writing mode
- Version history and auto-save
- Dark/light theme support
- Keyboard-first workflow
- Offline functionality
- Cross-platform support (Windows, macOS, Linux)

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Ollama** installed and running locally
3. **Git** for version control

## Installation

### 1. Install Ollama

First, install Ollama on your system:

**macOS/Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [ollama.ai](https://ollama.ai/download)

### 2. Pull AI Models

Pull the models you want to use:

```bash
# Recommended models
ollama pull llama2
ollama pull mistral
ollama pull codellama
```

### 3. Clone and Setup the Project

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-content-studio.git
cd smart-content-studio

# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm start
```

## Development

### Development Mode

```bash
# Run in development mode with hot reload
npm run dev
```

This will:
- Start the Electron main process with auto-reload
- Start the React dev server on port 3000
- Open the app with DevTools enabled

### Project Structure

```
smart-content-studio/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts        # Main entry point
│   │   ├── services/       # Backend services
│   │   │   ├── ollama-service.ts
│   │   │   ├── database-service.ts
│   │   │   └── file-service.ts
│   │   ├── ipc-handlers.ts
│   │   └── menu.ts
│   ├── renderer/           # React application
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Zustand store
│   │   ├── services/      # Frontend services
│   │   └── App.tsx
│   └── shared/            # Shared types and utilities
├── resources/             # App resources
├── public/               # Static files
└── package.json
```

### Available Scripts

- `npm start` - Start the production build
- `npm run dev` - Start development mode
- `npm run build` - Build for production
- `npm run package` - Package the app for distribution
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Building for Distribution

### Package for All Platforms

```bash
# Build installers for all platforms
npm run package

# Build for specific platform
npm run package -- --mac
npm run package -- --win
npm run package -- --linux
```

The packaged applications will be in the `dist-electron` directory.

## Configuration

### Ollama Settings

The app connects to Ollama at `http://localhost:11434` by default. You can change this in Settings.

### Supported Models

The app works with any Ollama model. Recommended models:
- **llama2** - General purpose, good balance
- **mistral** - Fast and efficient
- **mixtral** - Powerful for complex tasks
- **codellama** - Best for technical content
- **neural-chat** - Great for conversational content

## Usage Guide

### Quick Start

1. **Create a New Project**
   - Click "New Project" in the sidebar
   - Enter project name and description
   - Select the project to make it active

2. **Create a Document**
   - Click "New Document" or press `Ctrl/Cmd + N`
   - Choose document type (blog, email, social, etc.)
   - Start writing!

3. **Use AI Assistant**
   - Select text and right-click for AI options
   - Press `Ctrl/Cmd + I` to improve selected text
   - Press `Ctrl/Cmd + E` to expand text
   - Use the AI panel for more options

4. **Export Your Content**
   - Go to File → Export
   - Choose format (HTML, PDF, Word, etc.)
   - Save to your desired location

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Document | `Ctrl/Cmd + N` |
| Save | `Ctrl/Cmd + S` |
| Open | `Ctrl/Cmd + O` |
| AI Improve | `Ctrl/Cmd + I` |
| AI Expand | `Ctrl/Cmd + E` |
| Find | `Ctrl/Cmd + F` |
| Replace | `Ctrl/Cmd + H` |
| Distraction Free | `F11` |
| Settings | `Ctrl/Cmd + ,` |

## Troubleshooting

### Ollama Connection Issues

If the app can't connect to Ollama:

1. Check if Ollama is running:
   ```bash
   ollama list
   ```

2. Start Ollama service:
   ```bash
   ollama serve
   ```

3. Verify the API is accessible:
   ```bash
   curl http://localhost:11434/api/tags
   ```

### Database Issues

If you encounter database errors:

1. Clear the app data:
   - **Windows:** `%APPDATA%/smart-content-studio`
   - **macOS:** `~/Library/Application Support/smart-content-studio`
   - **Linux:** `~/.config/smart-content-studio`

2. Restart the application

### Performance Issues

For better performance:
- Use smaller models for faster responses
- Adjust context length in model settings
- Close unused documents and projects
- Disable auto-save if experiencing lag

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Privacy & Security

- **100% Local:** All data stays on your machine
- **No Telemetry:** No tracking or analytics sent externally
- **Secure Storage:** Documents encrypted at rest (optional)
- **Open Source:** Full transparency of code

## License

MIT License - see [LICENSE](./LICENSE) file for details

## Support

- **Documentation:** [docs.smartcontentstudio.com](https://docs.smartcontentstudio.com)
- **Issues:** [GitHub Issues](https://github.com/yourusername/smart-content-studio/issues)
- **Discord:** [Join our community](https://discord.gg/smartcontent)

## Acknowledgments

- Built with Electron, React, and TypeScript
- Powered by Ollama for AI capabilities
- Monaco Editor for the editing experience
- TailwindCSS and shadcn/ui for the interface

---

Made with ❤️ for content creators everywhere