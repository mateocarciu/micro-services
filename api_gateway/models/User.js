const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User Schema
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    adresse: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    role: { 
        type: String, 
        required: true, 
        enum: ['client', 'livreur', 'admin'] 
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
