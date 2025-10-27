// routes/books.js
const express = require('express');
const router = express.Router();
const { listBooks, createBook, getBook, updateBook, deleteBook } = require('../controllers/booksController');
const { getCurrentUser } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

// todas estas rutas requieren token
router.use(getCurrentUser);

router.get('/', listBooks);
router.post('/', authorizeRole(['admin']), createBook);              // solo admin crea
router.get('/:id', getBook);
router.put('/:id', authorizeRole(['admin','user']), updateBook);    // admin y user pueden editar
router.delete('/:id', authorizeRole(['admin']), deleteBook);        // solo admin elimina

module.exports = router;
