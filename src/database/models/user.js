//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    id: String,
    username: String,
    avatar: String,
    discriminator: String,
    public_flags: Number,
    flags: Number,
    locale: String,
    mfa_enabled: Boolean,
    premium_type: Number,
    session: String,
    lastPixel: Number,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);