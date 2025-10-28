import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from './store/appStore';
import { ThemeProvider } from './components/UI/ThemeProvider';
import { Layout } from './components/Layout';
import { EditorPage } from './pages/EditorPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { useOllamaConnection } from './hooks/useOllama';
import toast from 'react-hot-toast';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { initializeApp, setOllamaStatus } = useStore();
  const { checkConnection } = useOllamaConnection();

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;