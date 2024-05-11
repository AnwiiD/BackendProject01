const express = require('express')
const router = express.Router();
const { getLibrosController, getLibroByIdController, createLibroController, updateLibroController, deleteLibroController } = require("./libro.controller");
const { respondWithError } = require("../utils/function");
const { verificarToken } = require("../utils/auth");

async function getLibros(req, res) {
    try {
        const filtro = ["name", "author", "genre", "publicationDate", "editorial"]
        const filtros = Object.fromEntries(
            Object.entries(req.query).filter(([clave]) => clavesDeseadas.includes(clave))
        );
        const libros = await getLibrosController(filtros);
        res.status(200).json(libros);
    } catch (error) {
        respondWithError(res, error);
    }
}
async function getLibroById(req, res) {
    try {
        const libro = await getLibroByIdController(req.params.id);
        res.status(200).json(libro);
    } catch (error) {
        respondWithError(res, error);
    }
}
async function createLibro(req, res) {
    try {
        info = {
            ...req.body,
            owner: req.username
        }
        const libro = await createLibroController(info);
        res.status(201).json({ mensaje: 'Libro creado', libro });
    } catch (error) {
        respondWithError(res, error);
    }
}
async function updateLibro(req, res) {
    try {
        const libro = await updateLibroController(req.params.id, req.body);
        res.status(200).json({
            mensaje: "Updated."
        })
    } catch (error) {
        respondWithError(res, error);
    }
}
async function deleteLibro(req, res) {
    try {
        const libro = await deleteLibroController(req.params.id,req.userId);
        res.status(200).json({
            mensaje: "Success deleted"
        });
    } catch (error) {
        respondWithError(res, error);
    }
}
router.get('/', getLibros);
router.get('/:id', getLibroById);
router.post('/',verificarToken, createLibro);
router.patch('/',verificarToken, updateLibro);
router.delete('/:id',verificarToken, deleteLibro);


module.exports = router;