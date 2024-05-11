const Usuario = require("./usuario.model")
const { throwCustomError } = require('../utils/function');


async function getUser(id) {
    try {
        const usuario = await Usuario.findById(id)
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
    catch(e) { 
        throwCustomError(400, e.message)
    }
}

async function updateUser(data, userId) {
    try {
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            throwCustomError(400,"Usuario no encontrado");
        }
        if (usuario._id.toString() !== userId) {
            throwCustomError(400,"No tienes permisos para editar este usuario")
        }
        const result = await Usuario.findByIdAndUpdate(userId, data)
        return result
    }
    catch (e) {
        throwCustomError(400, "No se pudo actualizar el usuario")
    }
}


async function deleteUser(_id, userId) {
    try {
        const usuario = await Usuario.findById(_id);
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        } else {
            if (usuario._id.toString() !== userId) {
                throw new Error("No tienes permisos para editar este usuario")
            }
        }
        const result = await Usuario.findOneAndUpdate({ _id }, { isDeleted: true })
        return result
    } catch (e) {
        throwCustomError(400, "No se pudo eliminar el usuario")
    }
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser
}