import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'archived';
}

interface Document {
  id: string;
  project_id: string;
  title: string;
  content: string;
  type: string;
  status: 'draft' | 'review' | 'published';
  word_count: number;
  created_at: string;
  updated_at: string;
}

interface AppState {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  
  // Documents  
  documents: Document[];
  currentDocument: Document | null;
  unsavedChanges: boolean;
  
  // Editor
  editorContent: string;
  selectedText: string;
  cursorPosition: number;
  wordCount: number;
  
  // UI State
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  distractionFreeMode: boolean;
  activeView: 'editor' | 'preview' | 'split';
  
  // Ollama
  ollamaConnected: boolean;
  currentModel: string;
  availableModels: string[];
  
  // Settings
  settings: {
    autoSave: boolean;
    autoSaveInterval: number;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    wordWrap: boolean;
    spellCheck: boolean;
    ollamaUrl: string;
  };

  // Actions
  initializeApp: () => Promise<void>;
  
  // Project actions
  loadProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project>;
  selectProject: (project: Project | null) => void;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Document actions
  loadDocuments: (projectId?: string) => Promise<void>;
  createDocument: (title: string, type: string) => Promise<Document>;
  selectDocument: (document: Document | null) => void;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  saveDocument: () => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  
  // Editor actions
  setEditorContent: (content: string) => void;
  setSelectedText: (text: string) => void;
  setCursorPosition: (position: number) => void;
  updateWordCount: () => void;
  
  // UI actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  toggleDistractionFree: () => void;
  setActiveView: (view: 'editor' | 'preview' | 'split') => void;
  
  // Ollama actions
  setOllamaStatus: (connected: boolean) => void;
  setCurrentModel: (model: string) => void;
  loadAvailableModels: () => Promise<void>;
  
  // Settings actions
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        projects: [],
        currentProject: null,
        documents: [],
        currentDocument: null,
        unsavedChanges: false,
        editorContent: '',
        selectedText: '',
        cursorPosition: 0,
        wordCount: 0,
        theme: 'system',
        sidebarCollapsed: false,
        distractionFreeMode: false,
        activeView: 'editor',
        ollamaConnected: false,
        currentModel: 'llama2',
        availableModels: [],
        settings: {
          autoSave: true,
          autoSaveInterval: 30000,
          fontSize: 16,
          fontFamily: 'Inter',
          lineHeight: 1.6,
          wordWrap: true,
          spellCheck: true,
          ollamaUrl: 'http://localhost:11434',
        },

        // Actions
        initializeApp: async () => {
          const state = get();
          await state.loadProjects();
          await state.loadAvailableModels();
          
          // Load settings from electron store
          const savedSettings = await window.electronAPI.settings.getAll();
          if (savedSettings) {
            set({ settings: { ...state.settings, ...savedSettings } });
          }
        },

        // Project actions
        loadProjects: async () => {
          try {
            const projects = await window.electronAPI.database.getProjects();
            set({ projects });
          } catch (error) {
            console.error('Failed to load projects:', error);
          }
        },

        createProject: async (name: string, description?: string) => {
          try {
            const project = await window.electronAPI.database.createProject(name, description);
            set((state) => ({ 
              projects: [project, ...state.projects],
              currentProject: project
            }));
            return project;
          } catch (error) {
            console.error('Failed to create project:', error);
            throw error;
          }
        },

        selectProject: (project: Project | null) => {
          set({ currentProject: project });
          if (project) {
            get().loadDocuments(project.id);
          }
        },

        updateProject: async (id: string, updates: Partial<Project>) => {
          // Implementation for updating project
        },

        deleteProject: async (id: string) => {
          // Implementation for deleting project
        },

        // Document actions
        loadDocuments: async (projectId?: string) => {
          try {
            const documents = await window.electronAPI.database.getDocuments(projectId);
            set({ documents });
          } catch (error) {
            console.error('Failed to load documents:', error);
          }
        },

        createDocument: async (title: string, type: string) => {
          const state = get();
          if (!state.currentProject) {
            throw new Error('No project selected');
          }

          try {
            const document = await window.electronAPI.database.createDocument(
              state.currentProject.id,
              title,
              '',
              type
            );
            set((state) => ({
              documents: [document, ...state.documents],
              currentDocument: document,
              editorContent: ''
            }));
            return document;
          } catch (error) {
            console.error('Failed to create document:', error);
            throw error;
          }
        },

        selectDocument: (document: Document | null) => {
          set({ 
            currentDocument: document,
            editorContent: document?.content || '',
            unsavedChanges: false
          });
        },

        updateDocument: async (id: string, updates: Partial<Document>) => {
          try {
            await window.electronAPI.database.updateDocument(id, updates);
            set((state) => ({
              documents: state.documents.map(doc => 
                doc.id === id ? { ...doc, ...updates } : doc
              ),
              currentDocument: state.currentDocument?.id === id 
                ? { ...state.currentDocument, ...updates }
                : state.currentDocument
            }));
          } catch (error) {
            console.error('Failed to update document:', error);
          }
        },

        saveDocument: async () => {
          const state = get();
          if (!state.currentDocument) return;

          try {
            await state.updateDocument(state.currentDocument.id, {
              content: state.editorContent,
              word_count: state.wordCount,
              updated_at: new Date().toISOString()
            });
            set({ unsavedChanges: false });
          } catch (error) {
            console.error('Failed to save document:', error);
            throw error;
          }
        },

        deleteDocument: async (id: string) => {
          // Implementation for deleting document
        },

        // Editor actions
        setEditorContent: (content: string) => {
          set({ 
            editorContent: content,
            unsavedChanges: true
          });
          get().updateWordCount();
        },

        setSelectedText: (text: string) => {
          set({ selectedText: text });
        },

        setCursorPosition: (position: number) => {
          set({ cursorPosition: position });
        },

        updateWordCount: () => {
          const content = get().editorContent;
          const words = content.split(/\s+/).filter(word => word.length > 0);
          set({ wordCount: words.length });
        },

        // UI actions
        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme });
          
          // Apply theme to document
          if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
        },

        toggleDistractionFree: () => {
          set((state) => ({ distractionFreeMode: !state.distractionFreeMode }));
        },

        setActiveView: (view: 'editor' | 'preview' | 'split') => {
          set({ activeView: view });
        },

        // Ollama actions
        setOllamaStatus: (connected: boolean) => {
          set({ ollamaConnected: connected });
        },

        setCurrentModel: async (model: string) => {
          await window.electronAPI.ollama.setModel(model);
          set({ currentModel: model });
        },

        loadAvailableModels: async () => {
          try {
            const models = await window.electronAPI.ollama.listModels();
            set({ availableModels: models.map((m: any) => m.name) });
          } catch (error) {
            console.error('Failed to load models:', error);
            set({ availableModels: [] });
          }
        },

        // Settings actions
        updateSettings: (settings: Partial<AppState['settings']>) => {
          const newSettings = { ...get().settings, ...settings };
          set({ settings: newSettings });
          
          // Save to electron store
          Object.entries(settings).forEach(([key, value]) => {
            window.electronAPI.settings.set(key, value);
          });
        },
      }),
      {
        name: 'smart-content-studio-storage',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          settings: state.settings,
          currentModel: state.currentModel,
        }),
      }
    )
  )
);