const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

let pool = null;
let sqliteDb = null;
let useSqlite = false;

async function initDatabase() {
  // Attempt MySQL Connection First
  try {
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      // Use explicit empty string when no password is set (required for XAMPP default root)
      password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
      database: process.env.DB_NAME || 'notes_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3000
    });

    const conn = await tempPool.getConnection();
    await conn.ping();
    conn.release();

    pool = tempPool;
    useSqlite = false;
    logger.info('Connected successfully to MySQL Database');
    return;
  } catch (mysqlErr) {
    logger.warn(`MySQL connection failed (${mysqlErr.message}). Initializing embedded SQLite database fallback...`);
    useSqlite = true;
  }

  // Fallback to SQLite
  if (useSqlite) {
    const dbDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, 'notes.db');
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');

    // Create Tables if not exist
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        category TEXT DEFAULT 'General',
        tags TEXT DEFAULT '',
        color TEXT DEFAULT '#ffffff',
        is_pinned INTEGER DEFAULT 0,
        is_archived INTEGER DEFAULT 0,
        is_deleted INTEGER DEFAULT 0,
        is_favorite INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    logger.info(`SQLite Fallback Database initialized at ${dbPath}`);
  }
}

// Universal Query Interface for MySQL & SQLite
async function query(sql, params = []) {
  if (!pool && !sqliteDb) {
    await initDatabase();
  }

  if (!useSqlite && pool) {
    try {
      const [rows, fields] = await pool.query(sql, params);
      return rows;
    } catch (err) {
      logger.error({ err, sql, params }, 'MySQL Query Error');
      throw err;
    }
  }

  // SQLite execution logic
  try {
    const trimmedSql = sql.trim();
    if (trimmedSql.toUpperCase().startsWith('SELECT')) {
      const stmt = sqliteDb.prepare(sql);
      return stmt.all(...params);
    } else {
      const stmt = sqliteDb.prepare(sql);
      const info = stmt.run(...params);
      return { insertId: info.lastInsertRowid, affectedRows: info.changes };
    }
  } catch (err) {
    logger.error({ err, sql, params }, 'SQLite Query Error');
    throw err;
  }
}

module.exports = {
  initDatabase,
  query,
  getIsSqlite: () => useSqlite
};
