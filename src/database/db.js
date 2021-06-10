/*
    IMPORTS
*/
const mongoose = require('mongoose');
const configHandler = require('../utils/configHandler.js');
const logger = require("../utils/logger");
const config = configHandler.getConfig();
const { v4: uuidv4 } = require('uuid');

/*
    MONGOOSE MODELS
*/
const User = require("./models/user");
const Banned = require('./models/banned.js');

/*
 * Connects the client with MongoDB
 */
module.exports.connect = function () {
    mongoose.connect(config.database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err) {
        if (err) throw err;
        logger.done("Connected to database!")
    });
}

/**
 * Loads and Inits the user data for the specified userID
 *
 * @param {string} userID user id
 *
 * @returns {object} user data
 *
 */
 module.exports.getUserData = async function (userID) {
    let doc = await User.findOne({
        id: userID
    }).exec().catch(err => console.log(err));
    return doc;
};

/**
 * Loads and Inits the user data for the specified session id
 *
 * @param {string} session session id
 *
 * @returns {object} user data
 *
 */
 module.exports.getUserSession = async function (session) {
    let doc = await User.findOne({
        session: session
    }).exec().catch(err => console.log(err));
    return doc;
};

/**
 * Checks if user is banned
 *
 * @param {string} userID user id
 *
 * @returns {object} user data
 *
 */
 module.exports.isBanned = async function (userID) {
    let doc = await Banned.findOne({
        userID: userID
    }).exec().catch(err => console.log(err));

    /* IF BANNED RETURN TRUE OR FALSE */
    if(doc) {
        return true;
    }
    return false;
};