import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from './store/appStore';
import { ThemeProvider } from './components/UI/ThemeProvider';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { Layout } from './components/Layout';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { useOllamaConnection } from './hooks/useOllama';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { lazyLoad } from './utils/lazyLoad';
import toast from 'react-hot-toast';

// Lazy load pages for better performance
const EditorPage = lazyLoad(() => import('./pages/EditorPage').then(m => ({ default: m.EditorPage })));
const ProjectsPage = lazyLoad(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const TemplatesPage = lazyLoad(() => import('./pages/TemplatesPage').then(m => ({ default: m.TemplatesPage })));
const AnalyticsPage = lazyLoad(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = lazyLoad(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { initializeApp, setOllamaStatus, settings, saveDocument, currentDocument, unsavedChanges } = useStore();
  const { checkConnection } = useOllamaConnection();
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize the app store
        await initializeApp();

        // Check Ollama connection
        const isConnected = await checkConnection();
        setOllamaStatus(isConnected);
        
        if (!isConnected) {
          toast.error(
            'Ollama is not running. Please start Ollama to use AI features.',
            { duration: 6000 }
          );
        } else {
          toast.success('Connected to Ollama successfully!');
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        toast.error('Failed to initialize application');
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Set up auto-save interval
  useEffect(() => {
    if (settings.autoSave && settings.autoSaveInterval) {
      const interval = setInterval(() => {
        if (currentDocument && unsavedChanges) {
          saveDocument();
          toast.success('Auto-saved', { duration: 1000 });
        }
      }, settings.autoSaveInterval);

      return () => clearInterval(interval);
    }
  }, [settings.autoSave, settings.autoSaveInterval, currentDocument, unsavedChanges, saveDocument]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/editor/:documentId?" element={<EditorPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;