const { throwCustomError } = require("../utils/function");
const { getLibros, getLibroById, createLibro, updateLibro, deleteLibro } = require("./libro.actions");

async function getLibrosController(query) {
    const books = await getLibros(query);
    if (books.length === 0 ) {
        throwCustomError(404,"Libros no encontrados");
    };
    if (query.isDeleted) {
        return books;
    };
    return books.filter(book => !book.isDeleted);
}

async function getLibroByIdController(id) {
    const book = await getLibroById(id);
    if (!book||book.isDeleted) {
        throwCustomError(404,"Libros no encontrados");
    };
    return book;
}

async function createLibroController(datos) { //(token, data) 
    const { ...book } = datos;
    console.log(new Date(book.publicationDate))
    const info = {
        ...book,
        
        //publicationDate: new Date(book.publicationDate),
    };
    console.log(info)
    try {
        const createdBook = await createLibro(info);
        return createdBook;
    }
    catch (error) {
        throwCustomError(400,"Error al crear el libro");
    }

}
async function updateLibroController(idt, changes) {
    const {_id,owner, ...rest} = changes;
    book = await getLibroById(_id);
    if (book.isDeleted||!book) {
        throwCustomError(404,"Libro no encontrado");
    };
    try {
        const result = await updateLibro(_id, rest);
        return result;
    }
    catch (error) {
        throwCustomError(400,"Error al actualizar el libro");
    }
}

async function deleteLibroController(id) {
    const book = await getLibroById(id);
    if (!book||book.isDeleted) {
        throwCustomError(404,"Libro no encontrado");
    };
    try {
        const result = await deleteLibro(id);
        return result;
    }
    catch (error) {
        throwCustomError(400,"Error al eliminar el libro");
    }
}
module.exports = {
    getLibrosController,
    getLibroByIdController,
    createLibroController,
    updateLibroController,
    deleteLibroController
}
   


