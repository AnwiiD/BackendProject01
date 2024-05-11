const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({});
})

const rutasUsuario = require("./usuario/usuario.route");
app.use('/usuario', rutasUsuario);
const rutasPedido = require("./pedido/pedido.route");
app.use('/pedido', rutasPedido);
const rutasLibro = require("./libro/libro.route");
app.use('/libro', rutasLibro);


// aqui va la connection string VVVVV
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hkrjnzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    console.log('Conectado a DB');
    app.listen(8080, () => {
        console.log("8080 LISTENING")
    });
}).catch((err) => {
    console.error('Error DB:', err);
});

