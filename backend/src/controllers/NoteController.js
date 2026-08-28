const NoteService = require('../services/NoteService');
const { successResponse } = require('../utils/apiResponse');

class NoteController {
  static async createNote(req, res, next) {
    try {
      const note = await NoteService.createNote(req.user.id, req.body);
      return successResponse(res, 'Note created successfully', { note }, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getNotes(req, res, next) {
    try {
      const data = await NoteService.getNotes(req.user.id, req.query);
      return successResponse(res, 'Notes retrieved successfully', data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getNoteById(req, res, next) {
    try {
      const note = await NoteService.getNoteById(req.params.id, req.user.id);
      return successResponse(res, 'Note details retrieved', { note }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async updateNote(req, res, next) {
    try {
      const note = await NoteService.updateNote(req.params.id, req.user.id, req.body);
      return successResponse(res, 'Note updated successfully', { note }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async archiveNote(req, res, next) {
    try {
      const note = await NoteService.toggleArchive(req.params.id, req.user.id);
      return successResponse(res, note.is_archived ? 'Note archived' : 'Note unarchived', { note }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async favoriteNote(req, res, next) {
    try {
      const note = await NoteService.toggleFavorite(req.params.id, req.user.id);
      return successResponse(res, note.is_favorite ? 'Note added to favorites' : 'Note removed from favorites', { note }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async trashNote(req, res, next) {
    try {
      const note = await NoteService.toggleTrash(req.params.id, req.user.id);
      return successResponse(res, note.is_deleted ? 'Note moved to trash' : 'Note restored from trash', { note }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async restoreNote(req, res, next) {
    try {
      const note = await NoteService.restore(req.params.id, req.user.id);
      return successResponse(res, 'Note restored successfully', { note }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async deletePermanent(req, res, next) {
    try {
      await NoteService.deletePermanent(req.params.id, req.user.id);
      return successResponse(res, 'Note deleted permanently', {}, 200);
    } catch (err) {
      next(err);
    }
  }

  static async duplicateNote(req, res, next) {
    try {
      const note = await NoteService.duplicateNote(req.params.id, req.user.id);
      return successResponse(res, 'Note duplicated successfully', { note }, 201);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NoteController;
