const mongoose = require("mongoose");

const schemaOrder = new mongoose.Schema({
    buyer: {type: String, required: true}, 
    seller: {type: String, required: true}, 
    books: {type: [String], required: true},
    status: { type: String, enum: ['On Progress', 'Cancelled', 'Completed'],default: 'On Progress', required: true },
    dropOffAddress: {type: String, required:true},
    isCancelled: {type: Boolean, default: false},
    isCompleted: {type: Boolean, default: false},
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
})


const Pedido = mongoose.model('Pedido', schemaOrder);

module.exports = Pedido;