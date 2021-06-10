//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const banSchema = mongoose.Schema({
    userID: String,
    reason: String,
    username: String,
    moderator: String,
    timestamp: Number
});

module.exports = mongoose.models.Banned || mongoose.model('Banned', banSchema);