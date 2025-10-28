import { useEffect } from 'react';
import { useStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { 
    saveDocument, 
    createDocument,
    toggleDistractionFree,
    setActiveView,
    currentDocument 
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Save - Cmd/Ctrl + S
      if (modifier && e.key === 's') {
        e.preventDefault();
        if (currentDocument) {
          saveDocument();
          toast.success('Document saved');
        }
      }

      // New Document - Cmd/Ctrl + N
      if (modifier && e.key === 'n') {
        e.preventDefault();
        createDocument('Untitled', 'blog');
      }

      // Open - Cmd/Ctrl + O
      if (modifier && e.key === 'o') {
        e.preventDefault();
        window.electronAPI.dialog.openFile();
      }

      // Find - Cmd/Ctrl + F
      if (modifier && e.key === 'f') {
        e.preventDefault();
        // Trigger find in editor
      }

      // Toggle Views - Cmd/Ctrl + 1,2,3
      if (modifier && e.key === '1') {
        e.preventDefault();
        setActiveView('editor');
      }
      if (modifier && e.key === '2') {
        e.preventDefault();
        setActiveView('preview');
      }
      if (modifier && e.key === '3') {
        e.preventDefault();
        setActiveView('split');
      }

      // Navigate to pages - Alt + 1,2,3,4,5
      if (e.altKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            navigate('/');
            break;
          case '2':
            e.preventDefault();
            navigate('/projects');
            break;
          case '3':
            e.preventDefault();
            navigate('/templates');
            break;
          case '4':
            e.preventDefault();
            navigate('/analytics');
            break;
          case '5':
            e.preventDefault();
            navigate('/settings');
            break;
        }
      }

      // Distraction Free Mode - F11
      if (e.key === 'F11') {
        e.preventDefault();
        toggleDistractionFree();
      }

      // Escape - Exit distraction free
      if (e.key === 'Escape') {
        const { distractionFreeMode } = useStore.getState();
        if (distractionFreeMode) {
          toggleDistractionFree();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Menu event listeners
    window.electronAPI.menu.onNewDocument(() => {
      createDocument('Untitled', 'blog');
    });

    window.electronAPI.menu.onSave(() => {
      if (currentDocument) {
        saveDocument();
      }
    });

    window.electronAPI.menu.onToggleDistractionFree(() => {
      toggleDistractionFree();
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.electronAPI.removeAllListeners('menu:new-document');
      window.electronAPI.removeAllListeners('menu:save');
      window.electronAPI.removeAllListeners('menu:toggle-distraction-free');
    };
  }, [currentDocument]);
}