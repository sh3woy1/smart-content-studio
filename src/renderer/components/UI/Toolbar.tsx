import React from 'react';
import { 
  Save, 
  FolderOpen, 
  FileText, 
  Undo, 
  Redo, 
  Eye, 
  Edit, 
  Columns,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Button } from './Button';
import { useStore } from '@/renderer/store/appStore';
import { useTheme } from './ThemeProvider';
import toast from 'react-hot-toast';

export const Toolbar: React.FC = () => {
  const { 
    currentDocument, 
    unsavedChanges, 
    activeView, 
    setActiveView,
    saveDocument 
  } = useStore();
  
  const { theme, setTheme } = useTheme();

  const handleSave = async () => {
    if (!currentDocument) {
      toast.error('No document to save');
      return;
    }
    
    try {
      await saveDocument();
      toast.success('Document saved successfully');
    } catch (error) {
      toast.error('Failed to save document');
    }
  };

  const handleThemeToggle = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-12 border-b bg-card px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button size="icon" variant="ghost" title="New Document">
          <FileText className="h-4 w-4" />
        </Button>
        
        <Button size="icon" variant="ghost" title="Open">
          <FolderOpen className="h-4 w-4" />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleSave}
          title="Save"
          disabled={!currentDocument || !unsavedChanges}
        >
          <Save className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button size="icon" variant="ghost" title="Undo">
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button size="icon" variant="ghost" title="Redo">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-muted rounded-md p-1">
          <Button
            size="sm"
            variant={activeView === 'editor' ? 'secondary' : 'ghost'}
            onClick={() => setActiveView('editor')}
            className="h-7 px-2"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editor
          </Button>
          
          <Button
            size="sm"
            variant={activeView === 'preview' ? 'secondary' : 'ghost'}
            onClick={() => setActiveView('preview')}
            className="h-7 px-2"
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          
          <Button
            size="sm"
            variant={activeView === 'split' ? 'secondary' : 'ghost'}
            onClick={() => setActiveView('split')}
            className="h-7 px-2"
          >
            <Columns className="h-3 w-3 mr-1" />
            Split
          </Button>
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={handleThemeToggle}
          title={`Theme: ${theme}`}
        >
          {getThemeIcon()}
        </Button>
      </div>
    </div>
  );
};