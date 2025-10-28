import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Clock,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const weeklyData = [
  { day: 'Mon', words: 450 },
  { day: 'Tue', words: 780 },
  { day: 'Wed', words: 320 },
  { day: 'Thu', words: 1200 },
  { day: 'Fri', words: 890 },
  { day: 'Sat', words: 560 },
  { day: 'Sun', words: 230 },
];

const contentTypes = [
  { name: 'Blog Posts', value: 35, color: '#3b82f6' },
  { name: 'Social Media', value: 25, color: '#10b981' },
  { name: 'Emails', value: 20, color: '#f59e0b' },
  { name: 'Technical', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 8, color: '#6b7280' },
];

export const AnalyticsPage: React.FC = () => {
  const stats = [
    { icon: FileText, label: 'Total Documents', value: '147', trend: '+12%' },
    { icon: TrendingUp, label: 'Words Written', value: '45.2k', trend: '+23%' },
    { icon: Clock, label: 'Writing Time', value: '126h', trend: '+8%' },
    { icon: Target, label: 'Daily Goal', value: '85%', trend: '+5%' },
  ];

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your writing progress and productivity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-green-600 dark:text-green-400">
                {stat.trend}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Weekly Progress</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="day" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="words" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Content Types */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Content Distribution</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={contentTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {contentTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {contentTypes.map((type) => (
              <div key={type.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: type.color }}
                  />
                  <span>{type.name}</span>
                </div>
                <span className="text-muted-foreground">{type.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Activity</h3>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-3">
          {[
            { time: '2 hours ago', action: 'Completed blog post', words: 1250 },
            { time: '5 hours ago', action: 'Edited email campaign', words: 450 },
            { time: 'Yesterday', action: 'Created social media content', words: 320 },
            { time: '2 days ago', action: 'Drafted technical documentation', words: 2100 },
            { time: '3 days ago', action: 'Wrote product descriptions', words: 780 },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <div className="text-sm font-medium">{activity.action}</div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {activity.words} words
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};