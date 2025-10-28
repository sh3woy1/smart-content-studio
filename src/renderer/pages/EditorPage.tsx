import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/appStore';
import { AIAssistantPanel } from '../components/AIAssistant/AIAssistantPanel';
import { Button } from '../components/UI/Button';
import { cn } from '../utils/cn';
import { debounce } from '../utils/debounce';
import { marked } from 'marked';

export const EditorPage: React.FC = () => {
  const { documentId } = useParams();
  const {
    currentDocument,
    editorContent,
    setEditorContent,
    activeView,
    theme,
    settings,
    selectDocument,
    documents,
    updateWordCount,
  } = useStore();

  const [preview, setPreview] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Memoize editor options for performance
  const editorOptions = useMemo(() => ({
    fontSize: settings.fontSize,
    fontFamily: `'${settings.fontFamily}', monospace`,
    lineHeight: settings.lineHeight * settings.fontSize,
    wordWrap: settings.wordWrap ? 'on' as const : 'off' as const,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    automaticLayout: true,
    suggest: {
      showWords: true,
      showSnippets: true,
    },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false,
    },
  }), [settings]);

  // Debounced content update for better performance
  const debouncedSetContent = useCallback(
    debounce((value: string) => {
      setEditorContent(value);
      updateWordCount();
    }, 500),
    []
  );

  // Debounced preview update
  const debouncedUpdatePreview = useCallback(
    debounce(async (content: string) => {
      const html = await marked(content);
      setPreview(html);
    }, 300),
    []
  );

  useEffect(() => {
    if (documentId) {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        selectDocument(doc);
      }
    }
  }, [documentId, documents, selectDocument]);

  useEffect(() => {
    debouncedUpdatePreview(editorContent);
  }, [editorContent, debouncedUpdatePreview]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      debouncedSetContent(value);
    }
  }, [debouncedSetContent]);

  const handleEditorMount = useCallback((editor: any) => {
    // Set up editor event listeners
    editor.onDidChangeModelContent(() => {
      const selection = editor.getSelection();
      if (selection) {
        const text = editor.getModel().getValueInRange(selection);
        setSelectedText(text);
      }
    });

    // Focus editor on mount
    editor.focus();
  }, []);

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';

  if (!currentDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No Document Selected</h2>
          <p className="text-muted-foreground mb-6">
            Create a new document or select an existing one to start writing.
          </p>
          <Button 
            onClick={() => {
              useStore.getState().createDocument('Untitled', 'blog');
            }}
          >
            Create New Document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <div className={cn(
        "flex-1 flex",
        activeView === 'split' && "grid grid-cols-2"
      )}>
        {/* Editor */}
        {(activeView === 'editor' || activeView === 'split') && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language="markdown"
                theme={editorTheme}
                value={editorContent}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                options={editorOptions}
              />
            </div>
          </div>
        )}

        {/* Preview */}
        {(activeView === 'preview' || activeView === 'split') && (
          <div className={cn(
            "flex-1 overflow-auto p-8",
            activeView === 'split' && "border-l"
          )}>
            <article 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}
      </div>

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <AIAssistantPanel 
          onClose={() => setShowAIPanel(false)}
          selectedText={selectedText}
        />
      )}

      {/* Floating AI Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-10"
        onClick={() => setShowAIPanel(!showAIPanel)}
        title="AI Assistant"
      >
        ✨
      </Button>
    </div>
  );
};