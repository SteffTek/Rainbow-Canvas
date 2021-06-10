//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const banSchema = mongoose.Schema({
    userID: String,
});

module.exports = mongoose.models.Banned || mongoose.model('Banned', banSchema);