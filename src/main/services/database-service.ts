import Database from 'better-sqlite3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'archived';
  tags?: string[];
  settings?: any;
}

export interface Document {
  id: string;
  project_id: string;
  title: string;
  content: string;
  type: 'blog' | 'social' | 'email' | 'article' | 'creative' | 'technical' | 'marketing' | 'other';
  status: 'draft' | 'review' | 'published';
  word_count: number;
  created_at: string;
  updated_at: string;
  metadata?: any;
  version?: number;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  content: string;
  variables?: string[];
  is_custom: boolean;
  created_at: string;
  updated_at: string;
  usage_count: number;
}

export interface History {
  id: string;
  document_id: string;
  action: 'create' | 'edit' | 'ai_assist' | 'export' | 'delete';
  content_before?: string;
  content_after?: string;
  ai_prompt?: string;
  ai_response?: string;
  created_at: string;
}

export class DatabaseService {
  private db: Database.Database;

  constructor(private dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  async initialize(): Promise<void> {
    try {
      // Create projects table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          status TEXT DEFAULT 'active',
          tags TEXT,
          settings TEXT
        )
      `);

      // Create documents table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS documents (
          id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          type TEXT NOT NULL,
          status TEXT DEFAULT 'draft',
          word_count INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          metadata TEXT,
          version INTEGER DEFAULT 1,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        )
      `);

      // Create templates table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS templates (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          content TEXT NOT NULL,
          variables TEXT,
          is_custom INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          usage_count INTEGER DEFAULT 0
        )
      `);

      // Create history table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS history (
          id TEXT PRIMARY KEY,
          document_id TEXT NOT NULL,
          action TEXT NOT NULL,
          content_before TEXT,
          content_after TEXT,
          ai_prompt TEXT,
          ai_response TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
        )
      `);

      // Create analytics table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS analytics (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL,
          words_written INTEGER DEFAULT 0,
          ai_requests INTEGER DEFAULT 0,
          documents_created INTEGER DEFAULT 0,
          templates_used INTEGER DEFAULT 0,
          export_count INTEGER DEFAULT 0,
          active_time_minutes INTEGER DEFAULT 0
        )
      `);

      // Create indices for better performance
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);
        CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
        CREATE INDEX IF NOT EXISTS idx_history_document ON history(document_id);
        CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Project methods
  createProject(name: string, description?: string): Project {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO projects (id, name, description, created_at, updated_at, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, name, description || null, now, now, 'active');
    
    return {
      id,
      name,
      description,
      created_at: now,
      updated_at: now,
      status: 'active',
    };
  }

  getProjects(status?: string): Project[] {
    const query = status 
      ? 'SELECT * FROM projects WHERE status = ? ORDER BY updated_at DESC'
      : 'SELECT * FROM projects ORDER BY updated_at DESC';
    
    const stmt = this.db.prepare(query);
    const rows = status ? stmt.all(status) : stmt.all();
    
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      settings: row.settings ? JSON.parse(row.settings) : {},
    })) as Project[];
  }

  // Document methods
  createDocument(projectId: string, title: string, content: string, type: string): Document {
    const id = uuidv4();
    const now = new Date().toISOString();
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    const stmt = this.db.prepare(`
      INSERT INTO documents (id, project_id, title, content, type, word_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, projectId, title, content, type, wordCount, now, now);
    
    return {
      id,
      project_id: projectId,
      title,
      content,
      type: type as any,
      status: 'draft',
      word_count: wordCount,
      created_at: now,
      updated_at: now,
    };
  }

  getDocuments(projectId?: string): Document[] {
    const query = projectId
      ? 'SELECT * FROM documents WHERE project_id = ? ORDER BY updated_at DESC'
      : 'SELECT * FROM documents ORDER BY updated_at DESC';
    
    const stmt = this.db.prepare(query);
    const rows = projectId ? stmt.all(projectId) : stmt.all();
    
    return rows.map(row => ({
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
    })) as Document[];
  }

  updateDocument(id: string, updates: Partial<Document>): void {
    const now = new Date().toISOString();
    const fields = Object.keys(updates).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    if (updates.content) {
      updates.word_count = updates.content.split(/\s+/).filter(word => word.length > 0).length;
    }
    
    const stmt = this.db.prepare(`
      UPDATE documents 
      SET ${setClause}, updated_at = ?
      WHERE id = ?
    `);
    
    const values = fields.map(field => {
      const value = (updates as any)[field];
      return typeof value === 'object' ? JSON.stringify(value) : value;
    });
    
    stmt.run(...values, now, id);
  }

  // Template methods
  getTemplates(category?: string): Template[] {
    const query = category
      ? 'SELECT * FROM templates WHERE category = ? ORDER BY usage_count DESC'
      : 'SELECT * FROM templates ORDER BY usage_count DESC';
    
    const stmt = this.db.prepare(query);
    const rows = category ? stmt.all(category) : stmt.all();
    
    return rows.map(row => ({
      ...row,
      variables: row.variables ? JSON.parse(row.variables) : [],
      is_custom: Boolean(row.is_custom),
    })) as Template[];
  }

  // Add history entry
  addHistory(documentId: string, action: string, data: any): void {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO history (id, document_id, action, content_before, content_after, ai_prompt, ai_response, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, 
      documentId, 
      action,
      data.content_before || null,
      data.content_after || null,
      data.ai_prompt || null,
      data.ai_response || null,
      now
    );
  }

  // Analytics methods
  updateAnalytics(data: any): void {
    const today = new Date().toISOString().split('T')[0];
    
    const existing = this.db.prepare('SELECT * FROM analytics WHERE date = ?').get(today);
    
    if (existing) {
      const stmt = this.db.prepare(`
        UPDATE analytics 
        SET words_written = words_written + ?,
            ai_requests = ai_requests + ?,
            documents_created = documents_created + ?,
            templates_used = templates_used + ?,
            export_count = export_count + ?,
            active_time_minutes = active_time_minutes + ?
        WHERE date = ?
      `);
      
      stmt.run(
        data.words_written || 0,
        data.ai_requests || 0,
        data.documents_created || 0,
        data.templates_used || 0,
        data.export_count || 0,
        data.active_time_minutes || 0,
        today
      );
    } else {
      const id = uuidv4();
      const stmt = this.db.prepare(`
        INSERT INTO analytics (id, date, words_written, ai_requests, documents_created, templates_used, export_count, active_time_minutes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        today,
        data.words_written || 0,
        data.ai_requests || 0,
        data.documents_created || 0,
        data.templates_used || 0,
        data.export_count || 0,
        data.active_time_minutes || 0
      );
    }
  }

  getAnalytics(days: number = 30): any[] {
    const stmt = this.db.prepare(`
      SELECT * FROM analytics 
      WHERE date >= date('now', '-' || ? || ' days')
      ORDER BY date DESC
    `);
    
    return stmt.all(days);
  }

  async close(): Promise<void> {
    this.db.close();
  }
}