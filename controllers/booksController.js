// controllers/booksController.js
const { Book } = require('../models');

async function listBooks(req, res) {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    console.error('listBooks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createBook(req, res) {
  try {
    const { titulo, autor, ano_publicacion, en_stock } = req.body;

    if (!titulo || !autor)
      return res.status(400).json({ message: 'titulo and autor are required' });

    // 👇 Aseguramos que se asocia el libro al usuario logueado
    const book = await Book.create({
      titulo,
      autor,
      ano_publicacion,
      en_stock: en_stock !== undefined ? en_stock : true,
      userId: req.user.id, // 👈 clave para la relación con el usuario
    });

    res.status(201).json(book);
  } catch (err) {
    console.error('createBook error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getBook(req, res) {
  try {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error('getBook error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateBook(req, res) {
  try {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const { titulo, autor, ano_publicacion, en_stock } = req.body;
    await book.update({ 
      titulo: titulo !== undefined ? titulo : book.titulo,
      autor: autor !== undefined ? autor : book.autor,
      ano_publicacion: ano_publicacion !== undefined ? ano_publicacion : book.ano_publicacion,
      en_stock: en_stock !== undefined ? en_stock : book.en_stock
    });
    res.json(book);
  } catch (err) {
    console.error('updateBook error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteBook(req, res) {
  try {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await book.destroy();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.error('deleteBook error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listBooks, createBook, getBook, updateBook, deleteBook };
