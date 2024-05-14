const express = require('express')
const router = express.Router();
const {  readUsuario, createUsuario, updateUsuario, deleteUsuario, readUsuarioname} = require("./usuario.controller");
const { respondWithError} = require('../utils/function');
const {verificarToken} = require('../utils/auth'); 


async function GetUsuariosId(req, res) {
    try {
        const result = await readUsuario(req.params.id);
        res.status(200).json({
            result
        })
    } catch(e) {
        respondWithError(res, e);
        
    }
}

async function GetUsuarioName(req, res) {
    try {
        const result = await readUsuarioname(req.params.username);
        res.status(200).json({
            result
        })
    } catch(e) {
        respondWithError(res, e);
        
    }
}
async function PostUsuario(req, res) {
    try {
      const usuario = await createUsuario(req.body);
        
      res.status(200).json({
        mensaje: 'Usuario creado exitosamente. 👍',
        usuario: usuario.UsuarioCreado,
        token: usuario.token
      });
    } catch (error) {
      respondWithError(res, error);
    }
  }
  
async function PatchUsuarios(req, res) {
    try {
        // llamada a controlador con los datos
        await updateUsuario(req.body,req.params.id,req.userId);
        res.status(200).json({
            mensaje: "Usuario actualizado. 👍"
        })
    } catch(e) {
        respondWithError(res, e);
    }
}


async function DeleteUsuarios(req, res) {
    try {
        // llamada a controlador con los datos

        await deleteUsuario(req.params.id, req.userId);
        res.status(200).json({
            mensaje: "Exito. 👍"
        })
    } catch(e) {
        respondWithError(res, e);
    }
}


router.get("/user/:username",verificarToken,GetUsuarioName);
router.get("/:id",verificarToken,GetUsuariosId);
router.post("/", PostUsuario);
router.patch("/:id", verificarToken, PatchUsuarios);
router.delete("/:id",verificarToken, DeleteUsuarios);


module.exports = router;