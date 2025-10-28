import React, { useState } from 'react';
import { 
  Layout, 
  FileText, 
  Mail, 
  Share2, 
  ShoppingBag,
  BookOpen,
  Code,
  Megaphone,
  Plus,
  Search,
  Star
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { cn } from '../utils/cn';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  usage: number;
  isPremium?: boolean;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Blog Post',
    description: 'Standard blog post structure with intro, body, and conclusion',
    category: 'Content',
    icon: FileText,
    usage: 245,
  },
  {
    id: '2',
    name: 'Email Newsletter',
    description: 'Engaging email template with sections and CTA',
    category: 'Email',
    icon: Mail,
    usage: 189,
  },
  {
    id: '3',
    name: 'Social Media Post',
    description: 'Optimized for engagement across platforms',
    category: 'Social',
    icon: Share2,
    usage: 312,
  },
  {
    id: '4',
    name: 'Product Description',
    description: 'Compelling product descriptions that sell',
    category: 'Marketing',
    icon: ShoppingBag,
    usage: 156,
  },
  {
    id: '5',
    name: 'Tutorial Guide',
    description: 'Step-by-step instructional content',
    category: 'Educational',
    icon: BookOpen,
    usage: 98,
  },
  {
    id: '6',
    name: 'Technical Documentation',
    description: 'Clear and structured technical docs',
    category: 'Technical',
    icon: Code,
    usage: 67,
  },
  {
    id: '7',
    name: 'Press Release',
    description: 'Professional press release format',
    category: 'PR',
    icon: Megaphone,
    usage: 45,
    isPremium: true,
  },
];

const categories = [
  { name: 'All', count: templates.length },
  { name: 'Content', count: 1 },
  { name: 'Email', count: 1 },
  { name: 'Social', count: 1 },
  { name: 'Marketing', count: 1 },
  { name: 'Educational', count: 1 },
  { name: 'Technical', count: 1 },
  { name: 'PR', count: 1 },
];

export const TemplatesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-muted-foreground mt-1">
              Start with pre-built templates for any content type
            </p>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Categories Sidebar */}
        <div className="w-48">
          <h3 className="text-sm font-medium mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-xs opacity-70">{category.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Layout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <template.icon className="h-5 w-5 text-primary" />
                    </div>
                    {template.isPremium && (
                      <div className="flex items-center text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Used {template.usage} times
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};