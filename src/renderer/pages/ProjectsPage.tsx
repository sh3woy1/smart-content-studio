import React, { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Archive, 
  MoreVertical,
  FileText,
  Calendar,
  Tag
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../components/UI/Dialog';
import { useStore } from '../store/appStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const ProjectsPage: React.FC = () => {
  const { projects, createProject, selectProject, currentProject } = useStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      await createProject(projectName, projectDescription);
      toast.success('Project created successfully');
      setShowCreateDialog(false);
      setProjectName('');
      setProjectDescription('');
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const activeProjects = projects.filter(p => p.status === 'active');
  const archivedProjects = projects.filter(p => p.status === 'archived');

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Organize your content creation work
            </p>
          </div>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Active Projects */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Projects</h2>
        
        {activeProjects.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No active projects yet</p>
            <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  currentProject?.id === project.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => selectProject(project)}
              >
                <div className="flex items-start justify-between mb-3">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                
                <h3 className="font-semibold mb-2">{project.name}</h3>
                
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                
                <div className="flex items-center text-xs text-muted-foreground space-x-3">
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    <span>0 docs</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{format(new Date(project.created_at), 'MMM d')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archived Projects */}
      {archivedProjects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Archive className="h-5 w-5 mr-2" />
            Archived Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedProjects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 opacity-60 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-start justify-between mb-3">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                
                <h3 className="font-semibold mb-2">{project.name}</h3>
                
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Projects help you organize related documents and content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Project Name
              </label>
              <Input
                placeholder="My Awesome Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Description (optional)
              </label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="What is this project about?"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};