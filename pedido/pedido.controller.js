const { throwCustomError } = require("../utils/function");
const { getPedidos, getPedidoById, createPedido, updatePedido, deletePedido } = require('./pedido.actions');
const { getUser } = require('../usuario/usuario.actions');
const { getLibroById, getLibros, updateLibro } = require('../libro/libro.actions');

async function getPedidosController(query, id) {
    if (!query.startDate && !query.endDate) {
        return await getPedidos(query);
    } else {
        if (query.startDate && query.endDate) {
            pedidos = await getPedidos({ createdAt: { $gte: query.startDate, $lte: query.endDate } });
        } else {
            throwCustomError(400, "Falta un rango de fechas");
        }
    }
    pedidosMios = pedidos.filter(pedido => pedido.buyer === id || pedido.seller === id);
    if (pedidosMios.length === 0) {
        throwCustomError(404, "No se encontraron pedidos");
    }
    if (!query.isCancelled && query.isDeleted) {
        return pedidosMios.filter(pedido => !pedido.isCancelled && pedido.isDeleted);
    } else if (query.isCancelled && !query.isDeleted) {
        return pedidosMios.filter(pedido => pedido.isCancelled && !pedido.isDeleted);
    } else if (query.isCancelled && query.isDeleted) {
        return pedidosMios.filter(pedido => pedido.isCancelled && pedido.isDeleted);
    } else {
        return pedidosMios;
    }
}
async function getPedidoByIdController(id) {
    return await getPedidoById(id);
}
async function updateStatusPedidoController(id) {
    const pedidos = await getPedidosController({ _id: id });
    const libros = pedidos[0].books;
    for (let libro in libros) {
        return await updateLibro({ _id: libros[libro] }, { Avaliable: false, isDeleted: true });
    }

    return pedido;
}
async function updatePedidoController(userid, changes) {
    const { _id, status, ...rest } = changes;
    if (Object.keys(rest).length > 0 || !status) {
        throwCustomError(400, "No se puede modificar el pedido");
    } else {
        pedido = await getPedidoById(_iid);
        if (pedido.length === 0) {
            throwCustomError(400, "No hay info");
        }
        const info = pedido[0];
        if (info.status === "Completed" || info.status === "Cancelled") {
            throwCustomError(400, "No se puede modificar el pedido");
        }
        if (info.buyer !== userid || info.seller !== userid) {
            throwCustomError(400, "No se puede modificar el pedido");
        }
        if (info.buyer === userid && status !== "Cancelled") {
            throwCustomError(400, "No se puede modificar el pedido");
        } else {
            return await updatePedido(_id, { status });
        }
        if (info.seller === userid && status !== "Completed" && status !== "Cancelled") {
            throwCustomError(400, "No se puede modificar el pedido");
        } else {
            if (status === "Cancelled") {
                return await updatePedido(_id, { status, isCancelled: true });
            } else {
                const result = await updatePedido(_id, { status, isCompleted: true });
                await updateStatusPedidoController(_id);
                return result;
            }
        }

    }
}
async function createPedidoController(datos) {
    const { buyer, seller, books, Address } = datos;
    if (!buyer || !seller || !books || !Address) {
        throwCustomError(400, "Faltan datos");
    }
    const userBuyer = await getUsuarioById(buyer);
    const userSeller = await getUsuarioById(seller);
    if (!userBuyer || !userSeller) {
        throwCustomError(400, "No se encontraron usuarios");
    }
    const libros = await getLibros({ _id: { $in: books } });
    if (libros.length === 0) {
        throwCustomError(400, "No se encontraron libros");
    }
    const librosDisponibles = libros.filter(libro => libro.Avaliable === true && libro.isDeleted === false);
    if (librosDisponibles.length !== libros.length) {
        throwCustomError(400, "No se encontraron libros disponibles");
    }
    return await createPedido(datos);
}
async function deletePedidoController(id) {
    return await deletePedido(id);
}
module.exports = {
    getPedidosController,
    getPedidoByIdController,
    updatePedidoController,
    createPedidoController,
    deletePedidoController
};