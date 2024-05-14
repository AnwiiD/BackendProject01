const { throwCustomError } = require("../utils/function");
const { getLibros, getLibroById, createLibro, updateLibro, deleteLibro } = require("./libro.actions");

async function getLibrosController(query) {
    const books = await getLibros(query);
    if (books.length === 0) {
        throwCustomError(404, "Libros no encontrados");
    };
    if (query.isDeleted) {
        return books;
    };
    return books.filter(book => !book.isDeleted);
}

async function getLibroByIdController(id) {
    try {
        const book = await getLibroById(id);
        if (!book || book.isDeleted) {
            throwCustomError(404, "Libro no encontrado");
        };
        return book;
    }
    catch (error) {
        throwCustomError(404, "Libro no encontrado");
    };
}

async function createLibroController(datos) { //(token, data) 
    if (!datos.name) {
        throwCustomError(400, "Nombre es requerido");
    }
    if (!datos.author) {
        throwCustomError(400, "Autor es requerido");
    }
    if (!datos.genre) {
        throwCustomError(400, "Genero es requerido");
    }
    if (datos.publicationDate && (parseInt(datos.publicationDate) > 2024 || parseInt(datos.publicationDate) < 0)) {
        throwCustomError(400, "Fecha de publicación no válida");
    } else if (!datos.publicationDate) {
        datos.publicationDate = 2024;}
    if (!datos.editorial) {
            throwCustomError(400, "Editorial es requerida");
        }
        const { ...book } = datos;

        const info = {
            ...book,



        };
        console.log(info)
        try {
            const createdBook = await createLibro(info);
            return createdBook;
        }
        catch (error) {
            throwCustomError(400, "Error al crear el libro");
        }

    }
    async function updateLibroController(id, changes, idt) { //(token, id, data)
        const { _id, owner, ...rest } = changes;
        book = await getLibroById(id);
        if (book.isDeleted || !book) {
            throwCustomError(404, "Libro no encontrado");
        }else{
            if (book.owner.toString() !== idt) {
                throwCustomError(400, "No tienes permisos para editar este libro")
            }
        }
        try {
            const result = await updateLibro(id, rest);
            return result;
        }
        catch (error) {
            throwCustomError(400, "Error al actualizar el libro");
        }
    }

    async function deleteLibroController(id,userId) {
        const book = await getLibroById(id);
        if (!book || book.isDeleted) {
            throwCustomError(404, "Libro no encontrado");
        }else{
            if (book.owner.toString() !== userId) {
                throwCustomError(400, "No tienes permisos para editar este libro")
            }
        }
        try {
            const result = await deleteLibro(id);
            return result;
        }
        catch (error) {
            throwCustomError(400, "Error al eliminar el libro");
        }
    }
    module.exports = {
        getLibrosController,
        getLibroByIdController,
        createLibroController,
        updateLibroController,
        deleteLibroController
    }



