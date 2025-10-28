import React from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { Toolbar } from './UI/Toolbar';
import { StatusBar } from './UI/StatusBar';
import { useStore } from '../store/appStore';
import { cn } from '../utils/cn';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarCollapsed, distractionFreeMode } = useStore();

  return (
    <div className={cn(
      "flex h-screen overflow-hidden bg-background",
      distractionFreeMode && "distraction-free"
    )}>
      {!distractionFreeMode && (
        <Sidebar collapsed={sidebarCollapsed} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {!distractionFreeMode && <Toolbar />}
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
        {!distractionFreeMode && <StatusBar />}
      </div>
    </div>
  );
};