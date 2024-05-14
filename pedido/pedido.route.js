const express = require('express')
const router = express.Router();

const { getPedidosController, getPedidoByIdController, updatePedidoController, createPedidoController, deletePedidoController } = require('./pedido.controller')
const { respondWithError } = require("../utils/function");
const { verificarToken } = require("../utils/auth");

async function Getpedidos(req, res) {
    try {
        const pedidos = await getPedidosController(req.query, req.userId)
        res.status(200).json({
            pedidos
        })
    } catch (error) {
        respondWithError(res, error)
}}
async function GetPedidoById(req, res) {
    try {
        const pedido = await getPedidoByIdController(req.params.id,req.userId)
        res.status(200).json({
            pedido
        })
    } catch (error) {
        respondWithError(res, error)
}}
async function CreatePedido(req, res) {
    try {
        const pedido = await createPedidoController(req.body,req.userId)
        res.status(201).json({
            mensaje: 'Pedido creado',
            pedido
        })
    } catch (error) {
        respondWithError(res, error)
}}
async function UpdatePedido(req, res) {
    try {
        const pedido = await updatePedidoController(req.params.id, req.body, req.userId)
        res.status(200).json({
            mensaje: 'Pedido actualizado',
            pedido
        })
    } catch (error) {
        respondWithError(res, error)
}}
async function DeletePedido(req, res) {
    try {
        const pedido = await deletePedidoController(req.params.id, req.userId)
        res.status(200).json({
            mensaje: 'Pedido eliminado',
            pedido
        })
    } catch (error) {
        respondWithError(res, error)
}}
router.get('/', verificarToken, Getpedidos)
router.get('/:id', verificarToken, GetPedidoById)
router.post('/', verificarToken, CreatePedido)
router.patch('/:id', verificarToken, UpdatePedido)
router.delete('/:id', verificarToken, DeletePedido)

module.exports = router;