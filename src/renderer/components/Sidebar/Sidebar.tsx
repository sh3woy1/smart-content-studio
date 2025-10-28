import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  FolderOpen, 
  Layout, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  BarChart3,
  Sparkles,
  Clock,
  Archive
} from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useStore } from '@/renderer/store/appStore';
import { cn } from '@/renderer/utils/cn';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { 
    projects, 
    documents, 
    currentProject,
    selectProject,
    toggleSidebar 
  } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { icon: FileText, label: 'Editor', path: '/' },
    { icon: FolderOpen, label: 'Projects', path: '/projects' },
    { icon: Layout, label: 'Templates', path: '/templates' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const recentDocuments = documents.slice(0, 5);

  return (
    <div className={cn(
      "bg-card border-r transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">Content Studio</span>
          </div>
        )}
        
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className={collapsed ? "p-2" : "px-4 pb-4"}>
          {/* Quick Actions */}
          {!collapsed && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quick Actions
                </span>
              </div>
              
              <div className="space-y-1">
                <Button variant="outline" className="w-full justify-start h-9">
                  <Plus className="h-4 w-4 mr-2" />
                  New Document
                </Button>
                <Button variant="outline" className="w-full justify-start h-9">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className={collapsed ? "space-y-1" : "mb-4"}>
            {!collapsed && (
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Menu
              </span>
            )}
            
            <div className="space-y-1 mt-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block"
                >
                  <Button
                    variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                    className={cn(
                      "w-full",
                      collapsed ? "justify-center px-2" : "justify-start"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      "h-4 w-4",
                      !collapsed && "mr-2"
                    )} />
                    {!collapsed && item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Documents */}
          {!collapsed && recentDocuments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recent
                </span>
                <Clock className="h-3 w-3 text-muted-foreground" />
              </div>
              
              <div className="space-y-1">
                {recentDocuments.map((doc) => (
                  <Button
                    key={doc.id}
                    variant="ghost"
                    className="w-full justify-start h-8 px-2"
                    onClick={() => {
                      // Navigate to document
                    }}
                  >
                    <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate text-sm">{doc.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Current Project */}
          {!collapsed && currentProject && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Current Project
                </span>
              </div>
              
              <div className="p-2 bg-primary/10 rounded-md">
                <div className="flex items-center">
                  <FolderOpen className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium text-sm truncate">
                    {currentProject.name}
                  </span>
                </div>
                {currentProject.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {currentProject.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>v1.0.0</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => {
                // Open documentation
                window.electronAPI.system.openExternal('https://github.com/smart-content-studio/docs');
              }}
            >
              Help
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};