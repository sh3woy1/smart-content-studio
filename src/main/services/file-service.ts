import * as fs from 'fs/promises';
import * as path from 'path';
import { marked } from 'marked';

export interface ExportOptions {
  format: 'md' | 'html' | 'txt' | 'docx' | 'pdf';
  includeMetadata?: boolean;
  styling?: 'basic' | 'styled' | 'custom';
  customCss?: string;
}

export class FileService {
  constructor(private basePath: string) {}

  async ensureDirectory(dirPath: string): Promise<void> {
    const fullPath = path.join(this.basePath, dirPath);
    await fs.mkdir(fullPath, { recursive: true });
  }

  async saveDocument(fileName: string, content: string, projectPath?: string): Promise<string> {
    const dir = projectPath ? path.join(this.basePath, projectPath) : this.basePath;
    await this.ensureDirectory(dir);
    
    const filePath = path.join(dir, fileName);
    await fs.writeFile(filePath, content, 'utf-8');
    
    return filePath;
  }

  async readDocument(filePath: string): Promise<string> {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.basePath, filePath);
    return await fs.readFile(fullPath, 'utf-8');
  }

  async exportDocument(
    content: string, 
    fileName: string, 
    options: ExportOptions
  ): Promise<string> {
    const exportDir = path.join(this.basePath, 'exports');
    await this.ensureDirectory('exports');
    
    let exportContent: string;
    let extension: string;
    
    switch (options.format) {
      case 'html':
        exportContent = await this.convertToHtml(content, options);
        extension = '.html';
        break;
      
      case 'txt':
        exportContent = this.convertToPlainText(content);
        extension = '.txt';
        break;
      
      case 'md':
      default:
        exportContent = content;
        extension = '.md';
        break;
    }
    
    const exportFileName = `${fileName}_${Date.now()}${extension}`;
    const exportPath = path.join(exportDir, exportFileName);
    
    await fs.writeFile(exportPath, exportContent, 'utf-8');
    
    return exportPath;
  }

  private async convertToHtml(content: string, options: ExportOptions): Promise<string> {
    const htmlContent = marked(content);
    
    const css = options.styling === 'styled' ? `
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        h1, h2, h3, h4, h5, h6 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        h1 { color: #2563eb; }
        h2 { color: #3730a3; }
        code {
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
        pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        blockquote {
          border-left: 4px solid #e5e7eb;
          margin-left: 0;
          padding-left: 1rem;
          color: #6b7280;
        }
        a {
          color: #2563eb;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        ${options.customCss || ''}
      </style>
    ` : '';
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exported Document</title>
        ${css}
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  }

  private convertToPlainText(content: string): string {
    // Remove Markdown formatting
    return content
      .replace(/^#{1,6}\s+/gm, '') // Remove headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/^[*+-]\s+/gm, '• ') // Convert lists
      .replace(/^>\s+/gm, '') // Remove blockquotes
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[^`]*```/gs, '') // Remove code blocks
      .replace(/\n{3,}/g, '\n\n'); // Normalize line breaks
  }

  async importDocument(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  async listFiles(dirPath?: string): Promise<string[]> {
    const fullPath = dirPath ? path.join(this.basePath, dirPath) : this.basePath;
    
    try {
      const files = await fs.readdir(fullPath);
      return files.filter(file => !file.startsWith('.'));
    } catch {
      return [];
    }
  }

  async deleteDocument(filePath: string): Promise<void> {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.basePath, filePath);
    await fs.unlink(fullPath);
  }

  async getFileStats(filePath: string): Promise<any> {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.basePath, filePath);
    return await fs.stat(fullPath);
  }

  getBasePath(): string {
    return this.basePath;
  }
}