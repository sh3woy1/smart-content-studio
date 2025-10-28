import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useStore } from '../store/appStore';
import toast from 'react-hot-toast';

interface GenerateOptions {
  model?: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export function useOllamaConnection() {
  const { setOllamaStatus, setCurrentModel } = useStore();

  const checkConnection = useCallback(async () => {
    try {
      const isConnected = await window.electronAPI.ollama.checkConnection();
      setOllamaStatus(isConnected);
      return isConnected;
    } catch (error) {
      console.error('Failed to check Ollama connection:', error);
      setOllamaStatus(false);
      return false;
    }
  }, [setOllamaStatus]);

  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['ollama-models'],
    queryFn: async () => {
      const models = await window.electronAPI.ollama.listModels();
      return models;
    },
    retry: 1,
  });

  return {
    checkConnection,
    models: models || [],
    modelsLoading,
  };
}

export function useOllamaGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const { currentModel } = useStore();

  const generate = useCallback(async (options: GenerateOptions) => {
    setIsGenerating(true);
    setStreamedResponse('');

    try {
      const request = {
        model: options.model || currentModel,
        prompt: options.prompt,
        system: options.system,
        stream: options.stream ?? true,
        options: {
          temperature: options.temperature ?? 0.7,
          num_predict: options.maxTokens ?? 1000,
        },
      };

      if (options.stream) {
        // Set up stream listener
        window.electronAPI.ollama.onStreamData((event: any, data: any) => {
          if (!data.done) {
            setStreamedResponse(prev => prev + data.response);
          }
        });

        await window.electronAPI.ollama.streamGenerate(request);
      } else {
        const response = await window.electronAPI.ollama.generate(request);
        setStreamedResponse(response.response);
      }

      return streamedResponse;
    } catch (error) {
      console.error('Failed to generate content:', error);
      toast.error('Failed to generate content. Please check Ollama connection.');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [currentModel]);

  return {
    generate,
    isGenerating,
    streamedResponse,
  };
}

export function useContentAssistant() {
  const { generate, isGenerating } = useOllamaGenerate();

  const improveWriting = useCallback(async (text: string) => {
    const prompt = `Improve the following text for clarity, grammar, and style while maintaining the original meaning:\n\n${text}`;
    return generate({ prompt, system: 'You are a professional editor.' });
  }, [generate]);

  const expandText = useCallback(async (text: string) => {
    const prompt = `Expand on the following text with more details, examples, and depth:\n\n${text}`;
    return generate({ prompt, system: 'You are a creative writer who expands ideas comprehensively.' });
  }, [generate]);

  const summarize = useCallback(async (text: string) => {
    const prompt = `Provide a concise summary of the following text:\n\n${text}`;
    return generate({ prompt, system: 'You are an expert at creating clear, concise summaries.' });
  }, [generate]);

  const changeTone = useCallback(async (text: string, tone: string) => {
    const prompt = `Rewrite the following text in a ${tone} tone:\n\n${text}`;
    return generate({ prompt, system: `You are a writer skilled at adapting tone and style.` });
  }, [generate]);

  const generateHeadlines = useCallback(async (topic: string) => {
    const prompt = `Generate 5 compelling headlines for an article about: ${topic}`;
    return generate({ 
      prompt, 
      system: 'You are a creative copywriter who specializes in attention-grabbing headlines.' 
    });
  }, [generate]);

  const continueWriting = useCallback(async (text: string) => {
    const prompt = `Continue writing from where this text left off:\n\n${text}`;
    return generate({ 
      prompt, 
      system: 'You are a creative writer who maintains consistent style and tone.' 
    });
  }, [generate]);

  const fixGrammar = useCallback(async (text: string) => {
    const prompt = `Fix any grammar and spelling errors in the following text:\n\n${text}`;
    return generate({ 
      prompt, 
      system: 'You are a grammar expert. Only fix errors, do not change the style or meaning.' 
    });
  }, [generate]);

  const paraphrase = useCallback(async (text: string) => {
    const prompt = `Paraphrase the following text in a different way while keeping the same meaning:\n\n${text}`;
    return generate({ 
      prompt, 
      system: 'You are skilled at rephrasing content while preserving meaning.' 
    });
  }, [generate]);

  return {
    improveWriting,
    expandText,
    summarize,
    changeTone,
    generateHeadlines,
    continueWriting,
    fixGrammar,
    paraphrase,
    isGenerating,
  };
}