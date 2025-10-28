import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Palette, 
  Type, 
  Wifi, 
  Save,
  Bell,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useStore } from '../store/appStore';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, ollamaConnected } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [localSettings, setLocalSettings] = useState(settings);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'editor', label: 'Editor', icon: Type },
    { id: 'ai', label: 'AI Settings', icon: Wifi },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    toast.success('Settings saved successfully');
  };

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings({ ...localSettings, [key]: value });
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your content creation experience
        </p>
      </div>

      <div className="flex gap-6">
        {/* Tabs Sidebar */}
        <div className="w-48">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 max-w-2xl">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Auto-save interval (seconds)
                    </label>
                    <Input
                      type="number"
                      value={localSettings.autoSaveInterval / 1000}
                      onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value) * 1000)}
                      min={10}
                      max={300}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      How often to automatically save your work (10-300 seconds)
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Enable auto-save</div>
                      <div className="text-sm text-muted-foreground">
                        Automatically save documents as you type
                      </div>
                    </div>
                    <Button
                      variant={localSettings.autoSave ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSettingChange('autoSave', !localSettings.autoSave)}
                    >
                      {localSettings.autoSave ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Spell check</div>
                      <div className="text-sm text-muted-foreground">
                        Check spelling as you type
                      </div>
                    </div>
                    <Button
                      variant={localSettings.spellCheck ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSettingChange('spellCheck', !localSettings.spellCheck)}
                    >
                      {localSettings.spellCheck ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Editor Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Font Size
                    </label>
                    <Input
                      type="number"
                      value={localSettings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                      min={10}
                      max={30}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Font Family
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                      value={localSettings.fontFamily}
                      onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                    >
                      <option value="Inter">Inter</option>
                      <option value="JetBrains Mono">JetBrains Mono</option>
                      <option value="SF Mono">SF Mono</option>
                      <option value="Fira Code">Fira Code</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Line Height
                    </label>
                    <Input
                      type="number"
                      value={localSettings.lineHeight}
                      onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
                      min={1}
                      max={3}
                      step={0.1}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Word wrap</div>
                      <div className="text-sm text-muted-foreground">
                        Wrap long lines to fit the editor width
                      </div>
                    </div>
                    <Button
                      variant={localSettings.wordWrap ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSettingChange('wordWrap', !localSettings.wordWrap)}
                    >
                      {localSettings.wordWrap ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">AI Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Ollama URL
                    </label>
                    <Input
                      value={localSettings.ollamaUrl}
                      onChange={(e) => handleSettingChange('ollamaUrl', e.target.value)}
                      placeholder="http://localhost:11434"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The URL where Ollama is running
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className={cn(
                        "w-3 h-3 rounded-full mr-3",
                        ollamaConnected ? "bg-green-500" : "bg-red-500"
                      )} />
                      <div>
                        <div className="font-medium">Connection Status</div>
                        <div className="text-sm text-muted-foreground">
                          {ollamaConnected ? 'Connected to Ollama' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Test Connection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};