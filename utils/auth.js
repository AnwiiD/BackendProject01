const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
function crearToken(usuario) {
    console.log(usuario)
    id = usuario._id.toString()
    const payload = {
        userId: id, // id del usuario
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
    next();
    });
}
module.exports = {
    crearToken,
    verificarToken
};