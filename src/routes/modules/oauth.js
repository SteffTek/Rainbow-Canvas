"use strict";
const utils = require('../../utils/utils');
const log = require("../../utils/logger");

const config = require("../../utils/configHandler").getConfig();

const db = require("../../database/db");
const UserModel = require("../../database/models/user");

const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const DiscordOauth2 = require("discord-oauth2");
const { isIP } = require('net');
const oauth = new DiscordOauth2(config.discord_oauth);

module.exports = async function(req, res){

    //GET AND HASH IP
    let ip = req.headers['x-forwarded-for']
    if(ip === undefined) {
        ip = req.connection.remoteAddress;
    } else {
        ip = ip.split(", ")[0]
    }
    ip = crypto.createHash("md5").update(ip).digest("hex")
    ip = utils.escapeHtml(ip);

    //CHECK TOKEN VALIDITY
    let token_request = await oauth.tokenRequest({
        code: req.query.code,
        scope: "identify",
        grantType: "authorization_code"
    }).catch(console.error);

    // CHECK TOKEN REQUEST
    if(token_request == null || token_request.length == 0) {
        onerror(res, "Couldn't validate Discord Login! Please try again.", "OAuth2: Token Request Invalid");
        return;
    }

    // LOAD USER FROM DISCORD API
    let user = await oauth.getUser(token_request.access_token).catch(function() {onerror(res, "Couldn't validate Discord Login! Please try again.", "OAuth2: Cannot get User; Token: " + JSON.stringify(token_request)); return});
    if(user == null || user.length == 0) {
        onerror(res, "Couldn't validate Discord Login! Please try again.", "OAuth2: User is Null; Token: " + JSON.stringify(token_request));
        return;
    }

    // CHECK IF USER IS NEWER THAN 3 MONTHS
    var minimum = 3 * 31 * 24 * 60 * 60 * 1000;
    var creationDate = convertIDtoUnix(user.id);

    if(Date.now() - creationDate < minimum) {
        onerror(res, "Your account is too new. Currently only user accounts older than 3 months are allowed! You can still spectate 😊","User account too new!")
        return;
    }

    // GET USER IN DB OR CREATE
    db.getUserData(user.id).then(async dbUser => {

        // ADD NEW DB USER IF NOT THERE
        if(!dbUser) {
            dbUser = await new UserModel({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                discriminator: user.discriminator,
                public_flags: user.public_flags,
                flags: user.flags,
                locale: user.locale,
                mfa_enabled: user.mfa_enabled,
                premium_type: user.premium_type,
                lastPixel: 0,
                session: ""
            });
        }

        // CREATE COOKIE
        let session = uuidv4();

        // SET COOKIE
        dbUser.session = session;

        // SAVE
        await dbUser.save().catch(err => {
            console.log(err);
            onerror(res, "Internal Server Error while logging in. Please try again!", "Error while saving user!")
        }).then(() => {
            res.cookie("session",session,{maxAge:999999999999999})
            res.redirect("/");
        });
    });
}

function onerror(res, error, toLog) {
    log.warn(toLog);
    res.redirect("/error?error=" + error);
    return;
}

function convertIDtoUnix(id) {
    /* Note: id has to be str */
    var bin = (+id).toString(2);
    var unixbin = '';
    var unix = '';
    var m = 64 - bin.length;
    unixbin = bin.substring(0, 42-m);
    unix = parseInt(unixbin, 2) + 1420070400000;
    return unix;
}