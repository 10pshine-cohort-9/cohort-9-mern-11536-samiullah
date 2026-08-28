const NoteRepository = require('../repositories/NoteRepository');
const logger = require('../config/logger');

class NoteService {
  static async createNote(userId, noteData) {
    const note = await NoteRepository.create({
      user_id: userId,
      ...noteData
    });
    logger.info({ userId, noteId: note.id }, 'Note created');
    return note;
  }

  static async getNotes(userId, query) {
    const notes = await NoteRepository.findAll(userId, query);
    const stats = await NoteRepository.getStats(userId);
    return { notes, stats };
  }

  static async getNoteById(id, userId) {
    const note = await NoteRepository.findById(id, userId);
    if (!note) {
      const err = new Error('Note not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    return note;
  }

  static async updateNote(id, userId, fields) {
    const note = await NoteRepository.update(id, userId, fields);
    if (!note) {
      const err = new Error('Note not found or unauthorized.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    logger.info({ userId, noteId: id }, 'Note updated');
    return note;
  }

  static async toggleArchive(id, userId) {
    const note = await NoteRepository.toggleArchive(id, userId);
    if (!note) {
      const err = new Error('Note not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    logger.info({ userId, noteId: id, is_archived: note.is_archived }, 'Note archive toggled');
    return note;
  }

  static async toggleFavorite(id, userId) {
    const note = await NoteRepository.toggleFavorite(id, userId);
    if (!note) {
      const err = new Error('Note not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    logger.info({ userId, noteId: id, is_favorite: note.is_favorite }, 'Note favorite toggled');
    return note;
  }

  static async toggleTrash(id, userId) {
    const note = await NoteRepository.toggleTrash(id, userId);
    if (!note) {
      const err = new Error('Note not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    logger.info({ userId, noteId: id, is_deleted: note.is_deleted }, 'Note trash status toggled');
    return note;
  }

  static async restore(id, userId) {
    const note = await NoteRepository.restore(id, userId);
    if (!note) {
      const err = new Error('Note not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    logger.info({ userId, noteId: id }, 'Note restored');
    return note;
  }

  static async deletePermanent(id, userId) {
    const success = await NoteRepository.hardDelete(id, userId);
    if (!success) {
      const err = new Error('Note not found or already deleted.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    logger.info({ userId, noteId: id }, 'Note permanently deleted');
    return true;
  }

  static async duplicateNote(id, userId) {
    const note = await NoteRepository.duplicate(id, userId);
    if (!note) {
      const err = new Error('Note not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    logger.info({ userId, noteId: id, newNoteId: note.id }, 'Note duplicated');
    return note;
  }
}

module.exports = NoteService;
