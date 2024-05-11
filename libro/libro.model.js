const mongoose = require('mongoose');
const schemaBook = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    publicationDate: {
        type: Date,
        required: true
    },
    editorial: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        default: 1
    },
    Avaliable: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});
const Libro = mongoose.model('Libro', schemaBook);
module.exports = Libro;