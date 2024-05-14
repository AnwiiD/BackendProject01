const Pedido = require("./pedido.model")
const { throwCustomError } = require("../utils/function");

async function getPedidos(filtros) {
    const pedidos = await Pedido.find(filtros)
    return pedidos
}
async function getPedidoById(id) {

    const pedidoFound = await Pedido.findById(id);
    if (pedidoFound.isDeleted) {
        throwCustomError(404, "Pedido no encontrado");
    }
    return pedidoFound
}
async function createPedido(datos) {
    const createdPedido = await Pedido.create(datos)
    return createdPedido
}
async function updatePedido(id, changes) {
    const result = await Pedido.findByIdAndUpdate(id, changes)
    return result
}  

async function deletePedido(id) {
    const result = await Pedido.findByIdAndUpdate(id, { "isDeleted": true })
    return result
}
module.exports = {
    getPedidos,
    getPedidoById,
    createPedido,
    updatePedido,
    deletePedido};