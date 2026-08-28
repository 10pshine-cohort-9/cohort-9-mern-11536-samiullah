const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/NoteController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { createNoteValidation, updateNoteValidation } = require('../validators/noteValidator');

router.use(authenticateToken);

router.get('/', NoteController.getNotes);
router.post('/', createNoteValidation, NoteController.createNote);

router.get('/:id', NoteController.getNoteById);
router.put('/:id', updateNoteValidation, NoteController.updateNote);
router.delete('/:id', NoteController.trashNote); // Soft delete / move to trash
router.delete('/:id/permanent', NoteController.deletePermanent); // Hard delete

router.patch('/archive/:id', NoteController.archiveNote);
router.patch('/favorite/:id', NoteController.favoriteNote);
router.patch('/restore/:id', NoteController.restoreNote);
router.post('/duplicate/:id', NoteController.duplicateNote);

module.exports = router;
