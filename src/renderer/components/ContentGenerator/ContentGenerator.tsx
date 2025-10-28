import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../UI/Dialog';
import { contentTemplates, fillTemplate, ContentTemplate } from '@/renderer/services/contentTemplates';
import { useOllamaGenerate } from '@/renderer/hooks/useOllama';
import { useStore } from '@/renderer/store/appStore';
import toast from 'react-hot-toast';

interface ContentGeneratorProps {
  open: boolean;
  onClose: () => void;
  onGenerated?: (content: string) => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  open,
  onClose,
  onGenerated
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { generate } = useOllamaGenerate();
  const { setEditorContent, createDocument } = useStore();

  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    // Initialize variables
    const initialVars: Record<string, string> = {};
    template.variables?.forEach(v => {
      initialVars[v] = '';
    });
    setVariables(initialVars);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Check if all variables are filled
    const missingVars = selectedTemplate.variables?.filter(v => !variables[v]);
    if (missingVars && missingVars.length > 0) {
      toast.error(`Please fill in: ${missingVars.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    try {
      const filledPrompt = fillTemplate(selectedTemplate, variables);
      const result = await generate({
        prompt: filledPrompt,
        system: selectedTemplate.systemPrompt,
        temperature: 0.8,
        stream: true,
      });

      if (result) {
        // Create new document with generated content
        const doc = await createDocument(
          `${selectedTemplate.name} - ${variables.topic || variables.productName || 'Generated'}`,
          selectedTemplate.category.toLowerCase()
        );
        
        setEditorContent(result);
        
        if (onGenerated) {
          onGenerated(result);
        }
        
        toast.success('Content generated successfully!');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to generate content');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Content</DialogTitle>
          <DialogDescription>
            Choose a template and fill in the details to generate content
          </DialogDescription>
        </DialogHeader>

        {!selectedTemplate ? (
          <div className="grid grid-cols-2 gap-3 py-4">
            {contentTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="text-left p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <div className="font-medium mb-1">{template.name}</div>
                <div className="text-sm text-muted-foreground">{template.category}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-4">
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <div className="font-medium">{selectedTemplate.name}</div>
              <div className="text-sm text-muted-foreground">{selectedTemplate.category}</div>
            </div>

            <div className="space-y-4">
              {selectedTemplate.variables?.map(variable => (
                <div key={variable}>
                  <label className="text-sm font-medium capitalize mb-2 block">
                    {variable.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <Input
                    placeholder={`Enter ${variable}`}
                    value={variables[variable] || ''}
                    onChange={(e) => setVariables({
                      ...variables,
                      [variable]: e.target.value
                    })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {selectedTemplate && (
            <Button
              variant="outline"
              onClick={() => setSelectedTemplate(null)}
            >
              Back
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {selectedTemplate && (
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};