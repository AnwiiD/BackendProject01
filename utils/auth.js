const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
function crearToken(usuario) {
    console.log(usuario)
    id = usuario._id.toString()
    username = usuario.username
    console.log(id, username)
    const payload = {
        userId: id, // id del usuario
        username: username // nombre del usuario
    };
    return jwt.sign(payload, secretKey, { expiresIn: '20h' });
}

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'No se ha autenticado' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido, no autorizado' });
        }
    req.userId = user.userId;
    req.username = user.username;
    console.log(user.username)
    next();
    });
}
module.exports = {
    crearToken,
    verificarToken
};