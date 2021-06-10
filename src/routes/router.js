"use strict";

// Core Modules
let fs = require("fs");
let path = require("path");

// Dependencies (currently unused)
// TODO: Implement form validation
let { check, validationResult } = require("express-validator/check");
let { matchedData } = require("express-validator/filter");

// Utils
let getRoutes = require("./getRoutes");
let log = require("../utils/logger");
let conf = require("../utils/configHandler");

// Modules
let robots = require("./modules/robots");
let sitemap = require("./modules/sitemap");
let oauth = require("./modules/oauth");

// UTILS
let utils = require("../utils/utils");
let db = require("../database/db");

let routes;

module.exports = function(app){

    //SITES
    app.get("/", async (req, res) => {
        let session = req.cookies.session;
        db.getUserSession(session).then(async user => {

            if(user) {
                // CHECK BANNED
                let isBanned = await db.isBanned(user.id);
                if(isBanned) {
                    res.redirect("/gay/baby/jail");
                    return;
                }
            }

            // RENDER WEBSITE
            res.render("pages/index", {
                "routeTitle": "by SteffTek",
                "route": req.path,
                "conf": conf,
                "user": user,
                "csrfToken": req.csrfToken()
            });
        })
    });

    app.get("/discord/login", (req, res) => {
        res.redirect("https://discord.com/api/oauth2/authorize?client_id=850019972457562132&redirect_uri=https%3A%2F%2Frainbow.stefftek.de%2Fdiscord%2Fauth&response_type=code&scope=identify")
        //res.redirect("https://discord.com/api/oauth2/authorize?client_id=850019972457562132&redirect_uri=http%3A%2F%2Flocalhost%2Fdiscord%2Fauth&response_type=code&scope=identify");
    });

    app.get("/discord/logout", (req, res) => {
        res.cookie("session","",{maxAge: 0});
        res.redirect("/")
    });

    app.get("/discord/auth", (req, res) => {
        var code = req.query.code;
        if(code == null) {
            res.redirect("/404");
            return;
        }
        oauth(req, res);
    });

    app.get("/support", (req, res) => {
        res.render("errors/support", {
            "routeTitle": "Support",
            "route": req.path,
            "conf": conf,
            "csrfToken": req.csrfToken()
        });
    });

    app.get("/error", (req, res) => {
        let error = req.query.error;
        res.render("errors/error", {
            "routeTitle": "Support",
            "route": req.path,
            "conf": conf,
            "error": error,
            "csrfToken": req.csrfToken()
        });
    });

    app.get("/gay/baby/jail", (req, res) => {
        res.render("errors/jail", {
            "routeTitle": "Gay Baby Jail",
            "route": req.path,
            "conf": conf,
            "csrfToken": req.csrfToken()
        });
    });

    //Utils
    app.get("/robots.txt", (req, res) => {
        robots(req, res);
    });

    app.get("/sitemap.xml", (req, res) => {
        sitemap(req, res, routes);
    });

    // Errors
    // 404 Force
    app.get("/404", (req, res) => {
        res.render("errors/404", {
            "routeTitle": "Not found!",
            "route": req.path,
            "conf": conf,
            "csrfToken": req.csrfToken()
        });
    });

    // 404
    app.get("*", (req, res) => {
        res.status(404).render("errors/404", {
            "routeTitle": "Not found!",
            "route": req.path,
            "conf": conf,
            "csrfToken": req.csrfToken()
        });
    });

    routes = getRoutes(app);
    for (let i in routes) log.info("Route '" + routes[i].path + "' registered with methods '" + (routes[i].methods).join(", ") + "'");
};
