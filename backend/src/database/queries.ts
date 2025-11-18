import db from './connection';

// Helper functions for database operations
export const dbQuery = {
  get: (sql: string, params: any[] = []) => {
    return db.prepare(sql).get(...params);
  },
  
  all: (sql: string, params: any[] = []) => {
    return db.prepare(sql).all(...params);
  },
  
  run: (sql: string, params: any[] = []) => {
    return db.prepare(sql).run(...params);
  },
};
