import React, { useEffect, useState } from 'react';
import { Clock, FileText, Wifi, WifiOff } from 'lucide-react';
import { useStore } from '@/renderer/store/appStore';
import { cn } from '@/renderer/utils/cn';

export const StatusBar: React.FC = () => {
  const { 
    wordCount, 
    currentDocument, 
    ollamaConnected, 
    currentModel 
  } = useStore();
  
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    // Calculate reading time (avg 200 words per minute)
    const minutes = Math.ceil(wordCount / 200);
    setReadingTime(minutes);
  }, [wordCount]);

  const formatWordCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="h-8 bg-muted/50 border-t px-4 flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center space-x-4">
        {currentDocument && (
          <>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span className="font-medium">{currentDocument.title}</span>
              <span className="text-muted-foreground/70">
                ({currentDocument.type})
              </span>
            </div>
            
            <div className="w-px h-4 bg-border" />
            
            <div className="flex items-center space-x-3">
              <span>
                {formatWordCount(wordCount)} {wordCount === 1 ? 'word' : 'words'}
              </span>
              
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </>
        )}
        
        {!currentDocument && (
          <span className="text-muted-foreground/70">No document selected</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            ollamaConnected ? "bg-green-500" : "bg-red-500"
          )} />
          <span>Ollama</span>
          {ollamaConnected && currentModel && (
            <span className="text-muted-foreground/70">({currentModel})</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {ollamaConnected ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>{ollamaConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </div>
  );
};