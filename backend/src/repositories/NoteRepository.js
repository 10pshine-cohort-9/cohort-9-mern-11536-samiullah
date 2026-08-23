const db = require('../config/db');

class NoteRepository {
  static async findById(id, userId) {
    const rows = await db.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create({ user_id, title, content, category, tags, color, is_pinned, is_favorite }) {
    const result = await db.query(
      `INSERT INTO notes (user_id, title, content, category, tags, color, is_pinned, is_favorite, is_archived, is_deleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
      [
        user_id,
        title,
        content || '',
        category || 'General',
        tags || '',
        color || '#4f46e5',
        is_pinned ? 1 : 0,
        is_favorite ? 1 : 0
      ]
    );
    const insertId = db.getIsSqlite() ? result.insertId : result.insertId;
    return await this.findById(insertId, user_id);
  }

  static async update(id, userId, fields) {
    const note = await this.findById(id, userId);
    if (!note) return null;

    const title = fields.title !== undefined ? fields.title : note.title;
    const content = fields.content !== undefined ? fields.content : note.content;
    const category = fields.category !== undefined ? fields.category : note.category;
    const tags = fields.tags !== undefined ? fields.tags : note.tags;
    const color = fields.color !== undefined ? fields.color : note.color;
    const is_pinned = fields.is_pinned !== undefined ? (fields.is_pinned ? 1 : 0) : note.is_pinned;
    const is_favorite = fields.is_favorite !== undefined ? (fields.is_favorite ? 1 : 0) : note.is_favorite;

    await db.query(
      `UPDATE notes 
       SET title = ?, content = ?, category = ?, tags = ?, color = ?, is_pinned = ?, is_favorite = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [title, content, category, tags, color, is_pinned, is_favorite, id, userId]
    );

    return await this.findById(id, userId);
  }

  static async toggleArchive(id, userId) {
    const note = await this.findById(id, userId);
    if (!note) return null;
    const newArchived = note.is_archived ? 0 : 1;
    await db.query('UPDATE notes SET is_archived = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [newArchived, id, userId]);
    return await this.findById(id, userId);
  }

  static async toggleFavorite(id, userId) {
    const note = await this.findById(id, userId);
    if (!note) return null;
    const newFav = note.is_favorite ? 0 : 1;
    await db.query('UPDATE notes SET is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [newFav, id, userId]);
    return await this.findById(id, userId);
  }

  static async toggleTrash(id, userId) {
    const note = await this.findById(id, userId);
    if (!note) return null;
    const newDeleted = note.is_deleted ? 0 : 1;
    await db.query('UPDATE notes SET is_deleted = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [newDeleted, id, userId]);
    return await this.findById(id, userId);
  }

  static async restore(id, userId) {
    await db.query('UPDATE notes SET is_deleted = 0, is_archived = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [id, userId]);
    return await this.findById(id, userId);
  }

  static async hardDelete(id, userId) {
    const result = await db.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
  }

  static async duplicate(id, userId) {
    const original = await this.findById(id, userId);
    if (!original) return null;
    return await this.create({
      user_id: userId,
      title: `${original.title} (Copy)`,
      content: original.content,
      category: original.category,
      tags: original.tags,
      color: original.color,
      is_pinned: 0,
      is_favorite: original.is_favorite
    });
  }

  static async findAll(userId, { status = 'all', search = '', category = '', tag = '', sort = 'newest' }) {
    let sql = 'SELECT * FROM notes WHERE user_id = ?';
    const params = [userId];

    if (status === 'active') {
      sql += ' AND is_deleted = 0 AND is_archived = 0';
    } else if (status === 'favorites') {
      sql += ' AND is_deleted = 0 AND is_favorite = 1';
    } else if (status === 'archived') {
      sql += ' AND is_deleted = 0 AND is_archived = 1';
    } else if (status === 'trash') {
      sql += ' AND is_deleted = 1';
    } else {
      // default active
      sql += ' AND is_deleted = 0';
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (tag) {
      sql += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (sort === 'oldest') {
      sql += ' ORDER BY is_pinned DESC, created_at ASC';
    } else if (sort === 'alphabetical') {
      sql += ' ORDER BY is_pinned DESC, title ASC';
    } else if (sort === 'updated') {
      sql += ' ORDER BY is_pinned DESC, updated_at DESC';
    } else {
      // default newest
      sql += ' ORDER BY is_pinned DESC, created_at DESC';
    }

    return await db.query(sql, params);
  }

  static async getStats(userId) {
    const totalRows = await db.query('SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_deleted = 0', [userId]);
    const archivedRows = await db.query('SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_archived = 1 AND is_deleted = 0', [userId]);
    const favoriteRows = await db.query('SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_favorite = 1 AND is_deleted = 0', [userId]);
    const deletedRows = await db.query('SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_deleted = 1', [userId]);

    return {
      total: totalRows[0]?.count || totalRows[0]?.['COUNT(*)'] || 0,
      archived: archivedRows[0]?.count || archivedRows[0]?.['COUNT(*)'] || 0,
      favorites: favoriteRows[0]?.count || favoriteRows[0]?.['COUNT(*)'] || 0,
      deleted: deletedRows[0]?.count || deletedRows[0]?.['COUNT(*)'] || 0
    };
  }
}

module.exports = NoteRepository;
