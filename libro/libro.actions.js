const Libro = require("./libro.model")

async function getLibros(filtros){
    const books = await Libro.find(filtros)
    return books
}
async function getLibroById(id) {
    const bookFound = await Book.findById(id);
    return bookFound
  }

async function createLibro(datos){
    const createdBook = await Libro.create(datos)
    return createdBook
}

async function updateLibro(id,changes){
    const result = await Libro.findByIdAndUpdate(id, changes)
    return result
}

async function deleteLibro(id){
    const result = await Libro.findByIdAndUpdate(id, {"isDeleted": true})
    return result
}

module.exports = {
    getLibros,
    getLibroById,
    createLibro,
    updateLibro,
    deleteLibro
}