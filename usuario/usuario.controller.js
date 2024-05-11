const { throwCustomError } = require("../utils/function");
const { getUser, createUser, updateUser, deleteUser } = require("./usuario.actions");
const { crearToken } = require("../utils/auth");


async function readUsuario(id) {
    const user = await getUser(id);
    if(!user||user.isDeleted){
        throwCustomError(404, "Usuario no encontrado");
    };
    return user;
}

async function createUsuario(datos) {
    const{name,username,password}=datos;
    if (!name || !username || !password) {
        throwCustomError(400, "Faltan datos");
    }

    const UsuarioCreado = await createUser(datos);
    const token=crearToken(UsuarioCreado);
    return {UsuarioCreado,token};
}


async function updateUsuario(datos, userId) {
    const { ...cambios } = datos;
    console.log("seguimos")
    const Usuario = await updateUser( cambios, userId);

    return Usuario;
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
    deleteUsuario
}