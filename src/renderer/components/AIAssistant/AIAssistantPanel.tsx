import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Edit3, 
  Maximize2, 
  FileText, 
  Hash, 
  Type,
  Zap,
  CheckCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useContentAssistant } from '@/renderer/hooks/useOllama';
import { cn } from '@/renderer/utils/cn';
import toast from 'react-hot-toast';

interface AIAssistantPanelProps {
  onClose: () => void;
  selectedText?: string;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
  onClose, 
  selectedText = '' 
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    improveWriting,
    expandText,
    summarize,
    changeTone,
    generateHeadlines,
    continueWriting,
    fixGrammar,
    paraphrase,
  } = useContentAssistant();

  const quickActions = [
    { 
      icon: Edit3, 
      label: 'Improve Writing', 
      action: async () => {
        if (!selectedText) {
          toast.error('Please select some text first');
          return;
        }
        setIsLoading(true);
        try {
          const result = await improveWriting(selectedText);
          setAiResponse(result);
        } catch (error) {
          toast.error('Failed to improve text');
        } finally {
          setIsLoading(false);
        }
      }
    },
    { 
      icon: Maximize2, 
      label: 'Expand', 
      action: async () => {
        if (!selectedText) {
          toast.error('Please select some text first');
          return;
        }
        setIsLoading(true);
        try {
          const result = await expandText(selectedText);
          setAiResponse(result);
        } catch (error) {
          toast.error('Failed to expand text');
        } finally {
          setIsLoading(false);
        }
      }
    },
    { 
      icon: FileText, 
      label: 'Summarize', 
      action: async () => {
        if (!selectedText) {
          toast.error('Please select some text first');
          return;
        }
        setIsLoading(true);
        try {
          const result = await summarize(selectedText);
          setAiResponse(result);
        } catch (error) {
          toast.error('Failed to summarize text');
        } finally {
          setIsLoading(false);
        }
      }
    },
    { 
      icon: CheckCircle, 
      label: 'Fix Grammar', 
      action: async () => {
        if (!selectedText) {
          toast.error('Please select some text first');
          return;
        }
        setIsLoading(true);
        try {
          const result = await fixGrammar(selectedText);
          setAiResponse(result);
        } catch (error) {
          toast.error('Failed to fix grammar');
        } finally {
          setIsLoading(false);
        }
      }
    },
    { 
      icon: RefreshCw, 
      label: 'Paraphrase', 
      action: async () => {
        if (!selectedText) {
          toast.error('Please select some text first');
          return;
        }
        setIsLoading(true);
        try {
          const result = await paraphrase(selectedText);
          setAiResponse(result);
        } catch (error) {
          toast.error('Failed to paraphrase text');
        } finally {
          setIsLoading(false);
        }
      }
    },
    { 
      icon: Zap, 
      label: 'Continue Writing', 
      action: async () => {
        if (!selectedText) {
          toast.error('Please provide some context first');
          return;
        }
        setIsLoading(true);
        try {
          const result = await continueWriting(selectedText);
          setAiResponse(result);
        } catch (error) {
          toast.error('Failed to continue writing');
        } finally {
          setIsLoading(false);
        }
      }
    },
  ];

  const toneOptions = [
    'Professional',
    'Casual',
    'Friendly',
    'Formal',
    'Persuasive',
    'Humorous',
  ];

  const handleCopyResponse = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      toast.success('Copied to clipboard!');
    }
  };

  const handleInsertResponse = () => {
    // This would insert the response at cursor position in the editor
    // Implementation depends on editor integration
    toast.success('Response inserted into editor');
  };

  return (
    <div className="w-96 border-l bg-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Selected Text */}
        {selectedText && (
          <div className="p-4 border-b">
            <div className="text-sm font-medium mb-2">Selected Text:</div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md max-h-32 overflow-y-auto">
              {selectedText}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={action.action}
                  disabled={isLoading}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tone Options */}
          <div>
            <h4 className="text-sm font-medium mb-3">Change Tone</h4>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((tone) => (
                <Button
                  key={tone}
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!selectedText) {
                      toast.error('Please select some text first');
                      return;
                    }
                    setIsLoading(true);
                    try {
                      const result = await changeTone(selectedText, tone.toLowerCase());
                      setAiResponse(result);
                    } catch (error) {
                      toast.error('Failed to change tone');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <h4 className="text-sm font-medium mb-3">Custom Request</h4>
            <div className="space-y-2">
              <Input
                placeholder="Ask AI anything..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customPrompt) {
                    // Handle custom prompt
                  }
                }}
              />
              <Button 
                className="w-full" 
                disabled={!customPrompt || isLoading}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">AI Response</h4>
              <div className="flex space-x-1">
                <Button size="icon" variant="ghost" onClick={handleCopyResponse}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md text-sm max-h-64 overflow-y-auto">
              {aiResponse}
            </div>
            <div className="mt-3 flex space-x-2">
              <Button size="sm" onClick={handleInsertResponse}>
                Insert
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopyResponse}>
                Copy
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-4 flex items-center justify-center">
            <div className="spinner h-8 w-8 border-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};