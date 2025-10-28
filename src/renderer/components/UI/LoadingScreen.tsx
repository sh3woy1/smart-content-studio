import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-24 h-24 border-4 border-primary/20 rounded-full"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full animate-spin">
            <div className="w-24 h-24 border-4 border-transparent border-t-primary rounded-full"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Smart Content Studio</h1>
        <p className="text-muted-foreground">Initializing application...</p>
      </div>
    </div>
  );
};