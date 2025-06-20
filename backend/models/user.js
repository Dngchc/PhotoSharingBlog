const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login_name: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    first_name: String,
    last_name: String,
    location: String,
    description: String,
    occupation: String,
},
{
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);