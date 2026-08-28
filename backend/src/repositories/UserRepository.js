const db = require('../config/db');

class UserRepository {
  static async findByEmail(email) {
    const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id) {
    const rows = await db.query('SELECT id, full_name, email, avatar, created_at, updated_at FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByIdWithPassword(id) {
    const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create({ full_name, email, password, avatar }) {
    const result = await db.query(
      'INSERT INTO users (full_name, email, password, avatar) VALUES (?, ?, ?, ?)',
      [full_name, email, password, avatar || null]
    );
    const insertId = db.getIsSqlite() ? result.insertId : result.insertId;
    return await this.findById(insertId);
  }

  static async updateProfile(id, { full_name, email, avatar }) {
    await db.query(
      'UPDATE users SET full_name = ?, email = COALESCE(?, email), avatar = COALESCE(?, avatar), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, email || null, avatar || null, id]
    );
    return await this.findById(id);
  }

  static async updatePassword(id, hashedPassword) {
    await db.query('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hashedPassword, id]);
    return true;
  }
}

module.exports = UserRepository;
