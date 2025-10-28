import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface GenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  format?: 'json';
  images?: string[];
  options?: {
    temperature?: number;
    top_k?: number;
    top_p?: number;
    num_predict?: number;
    stop?: string[];
    seed?: number;
    num_ctx?: number;
  };
}

export interface GenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class OllamaService extends EventEmitter {
  private client: AxiosInstance;
  private currentModel: string = 'llama2';
  private isConnected: boolean = false;

  constructor(private baseUrl: string = 'http://localhost:11434') {
    super();
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.checkConnection();
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/tags');
      this.isConnected = response.status === 200;
      this.emit('connection-status', this.isConnected);
      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      this.emit('connection-status', false);
      return false;
    }
  }

  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models || [];
    } catch (error) {
      console.error('Failed to list models:', error);
      throw new Error('Failed to connect to Ollama. Please ensure Ollama is running.');
    }
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const response = await this.client.post('/api/generate', {
        ...request,
        stream: false,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate response:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }

  async streamGenerate(request: GenerateRequest, onData: (data: GenerateResponse) => void): Promise<void> {
    try {
      const response = await this.client.post('/api/generate', {
        ...request,
        stream: true,
      }, {
        responseType: 'stream',
      });

      return new Promise((resolve, reject) => {
        let buffer = '';
        
        response.data.on('data', (chunk: Buffer) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                onData(data);
                if (data.done) {
                  resolve();
                }
              } catch (e) {
                console.error('Failed to parse response:', e);
              }
            }
          }
        });

        response.data.on('error', (error: Error) => {
          reject(error);
        });

        response.data.on('end', () => {
          resolve();
        });
      });
    } catch (error) {
      console.error('Failed to stream generate:', error);
      throw error;
    }
  }

  async pullModel(modelName: string, onProgress?: (progress: any) => void): Promise<void> {
    try {
      const response = await this.client.post('/api/pull', {
        name: modelName,
        stream: true,
      }, {
        responseType: 'stream',
      });

      return new Promise((resolve, reject) => {
        let buffer = '';
        
        response.data.on('data', (chunk: Buffer) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                if (onProgress) {
                  onProgress(data);
                }
                if (data.status === 'success') {
                  resolve();
                }
              } catch (e) {
                console.error('Failed to parse pull response:', e);
              }
            }
          }
        });

        response.data.on('error', (error: Error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Failed to pull model:', error);
      throw error;
    }
  }

  setCurrentModel(model: string): void {
    this.currentModel = model;
    this.emit('model-changed', model);
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.checkConnection();
  }
}