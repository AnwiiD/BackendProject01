const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schemaUser = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, unique: true },
    password: { 
        type: String, 
        required: true },
    name: { 
        type: String, 
        required: true },
    isDeleted: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
    },
    cellphone: {
        type: String,
    }
}, {
    versionKey: false,
    timestamps: true
});

schemaUser.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
  
        } catch (error) {
            next(error);
        }
    }
    next();
});
schemaUser.methods.compare = async function (password) {
    return bcrypt.compare(password, this.password); 
  };
const Usuario = mongoose.model('Usuario', schemaUser);
module.exports = Usuario;
  
