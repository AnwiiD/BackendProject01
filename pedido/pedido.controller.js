const { throwCustomError } = require("../utils/function");
const { getPedidos, getPedidoById, createPedido, updatePedido, deletePedido } = require('./pedido.actions');
const { getUser } = require('../usuario/usuario.actions');
const { getLibroById, getLibros, updateLibro } = require('../libro/libro.actions');

async function getPedidosController(query, id) {
    if (!query.startDate && !query.endDate) {
        pedidos= await getPedidos(query);
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
async function getPedidoByIdController(id,userId) {
    const pedido = await getPedidoById(id);
    if (pedido.buyer !== userId && pedido.seller !== userId) {
        throwCustomError(400, "No tienes permisos");
    }
    if(pedido.isDeleted){
        throwCustomError(404, "Pedido no encontrado");
    }
    return pedido
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
async function createPedidoController(datos, userId) {
    const { books, Address } = datos;
    if (!books || !Address) {
        throwCustomError(400, "Faltan datos");
    }

    let infoBooks = []
    for (const id of datos.books) {
        try {
            book = await getLibroById(id);
        } catch (error) {
            throwCustomError(400, "El libro no existe");
        }

        if (!book) {
            throwCustomError(400, "El libro no existe");
        }
        console.log(book);
        if (infoBooks.some(infoBook => infoBook.id === book.id)) {
            throwCustomError(400, "El libro ya está en la lista");
        } else {
            infoBooks.push(book);

        }
    }
    for (const book of infoBooks) {
        if (book.owner === userId) {
            throwCustomError(400, "No puedes comprar tus libros");
        }
        const libs = await getLibros({ owner: infoBooks[0].owner });
        console.log(libs);
        if (libs.length === 0) {
            throwCustomError(400, "No se encontraron libros");
        }
        const idLibs = libs.map(lib => lib.id.toString());
        if (idLibs.length === 0) {
            throwCustomError(400, "No se encontraron libros");
        }


        if (!idLibs.includes(book.id.toString())) {
            throwCustomError(400, "El libro no es del mismo vendedor");
        }
        if (!book.Avaliable) {
            throwCustomError(400, "El libro no está disponible");
        }
        owner = infoBooks[0].owner;

    }
    const orderToCreate = {
        ...datos,
        buyer: userId,
        seller: owner,
        status: "On Progress"
    }
    try {
        return await createPedido(orderToCreate);
    }
    catch (error) {
        throwCustomError(400, "No se pudo crear el pedido");
    }
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