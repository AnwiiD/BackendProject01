const { throwCustomError } = require("../utils/function");
const { getUser, createUser, updateUser, deleteUser, getUsername } = require("./usuario.actions");
const { crearToken } = require("../utils/auth");


async function readUsuario(id) {
    const user = await getUser(id);
    if (!user || user.isDeleted) {
        throwCustomError(404, "Usuario no encontrado");
    };
    return user;
}
async function readUsuarioname(username) {
    const user = await getUsername(username);
    if (!user || user.isDeleted) {
        throwCustomError(404, "Usuario no encontrado");
    };
    return user;
}

async function createUsuario(datos) {
    const { name, username, password } = datos;
    if (!name) {
        throwCustomError(400, "Nombre es requerido");
    }
    if (!username) {
        throwCustomError(400, "Nombre de usuario es requerido");
    }
    if (!password) {
        throwCustomError(400, "Contraseña es requerida");
    }

    const UsuarioCreado = await createUser(datos);
    const token = crearToken(UsuarioCreado);
    return { UsuarioCreado, token };
}


async function updateUsuario(datos,paramid, userId) {
    const { ...cambios } = datos;
    if(cambios.isDeleted) throwCustomError(400, "No puedes eliminar un usuario");
    try {
        const Usuario = await updateUser(cambios,paramid, userId);
        return Usuario;
    } catch (e) {
        throw(e)
    }

}
async function deleteUsuario(id, userId) {
    try {
        const usuarioEliminado = await deleteUser(id, userId);

        return usuarioEliminado;
    } catch (error) {
        throw error;
    }
}
module.exports = {

    readUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    readUsuarioname
}