const Usuario = require("./usuario.model")
const Libro = require("../libro/libro.model")
const { throwCustomError } = require('../utils/function');


async function getUser(id) {
    try {
        const usuario = await Usuario.findById(id)
        return usuario
    } catch (e) {
        throwCustomError(404, "Usuario no encontrado")
    }
}
async function getUsername(username) {
    try {
        const usuario = await Usuario.findOne({ username })
        return usuario
    } catch (e) {
        throwCustomError(404, "Usuario no encontrado")
    }
}

async function createUser(data) {
    try {
        const usuarioCreado = await Usuario.create(data)
        return usuarioCreado
    }
    catch (e) {
        throwCustomError(400, e.message)
    }
}

async function updateUser(data,paramid, userId) {

    const usuario = await Usuario.findById(paramid);
    if (!usuario || usuario.isDeleted) {
        throwCustomError(400, "Usuario no encontrado");
    }
    if (usuario._id.toString() !== userId) {
        throwCustomError(400, "No tienes permisos para editar este usuario")
    }
    try {
        const result = await Usuario.findByIdAndUpdate(userId, data)
        return result
    } catch (e) {
        throwCustomError(400, "Error al actualizar el usuario")
    }


}


async function deleteUser(_id, userId) {

    const usuario = await Usuario.findById(_id);
    if (!usuario || usuario.isDeleted) {
        throwCustomError(400, "Usuario no encontrado");
    } else {
        if (usuario._id.toString() !== userId) {
            throwCustomError(400, "No tienes permisos para editar este usuario")
        }
    }
    try {
        const result = await Usuario.findOneAndUpdate({ _id }, { isDeleted: true })
        await Libro.updateMany({ owner: _id }, { isDeleted: true })
        return result
    } catch (e) {
        throwCustomError(400, "No se pudo eliminar el usuario")
    }
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUsername
}