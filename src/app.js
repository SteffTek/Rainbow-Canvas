"use strict";

// Core Modules
let path = require("path");

// Dependencies
let express = require("express");
let favicon = require("serve-favicon");
let minify = require("express-minify");
let bodyParser = require("body-parser");
let validator = require("express-validator");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let MemoryStore = require("memorystore")(session);
let helmet = require("helmet");
let csrf = require("csurf");

// Utils
let conf = require("./utils/configHandler");
let log = require("./utils/logger");

// DB
let db = require("./database/db");
db.connect();

// APP INFO
let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

let splashPadding = 12 + appname.length + version.toString().length;

console.log(
    "\n" +
    ` #${"-".repeat(splashPadding)}#\n` +
    ` # Started ${appname} v${version} #\n` +
    ` #${"-".repeat(splashPadding)}#\n\n` +
    ` Copyright (c) ${(new Date()).getFullYear()} ${devname}\n`
);

let app = express();

log.done("Started.");

let config = conf.getConfig();

let sess = {
    secret: config.session.secret,
    key: config.session.key,
    // @ts-ignore
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxage
    }
};

let bodyParserConf = {
    extended: true
};

let csrfParserConf = {
    cookie: true
};

const appPort = config.server.port || 3000;

if (!config.server.port) log.warn("No port specified. Using default: 3000");

if (appPort < 1 || appPort > 65535){
    log.error(`Invalid port specified: ${appPort}\nStopping...`);
    process.exit(1);
}

app.enable("trust proxy");

//View Path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set("port", appPort);
app.use(helmet());
app.use(bodyParser.urlencoded(bodyParserConf));
app.use(bodyParser.json());

//SSL?
app.use(session(sess));

app.use(validator());
app.use(cookieParser());

app.use(csrf(csrfParserConf));
// Some browsers rely on favicons in the webroot
app.use(favicon("./src/assets/static/images/favicon.png"));

// Don't minify libs that already are minified
app.use((req, res, next) => {
    if (/\.min\.(css|js)$/.test(req.url)){
        res.minifyOptions = res.minifyOptions || {};
        res.minifyOptions.minify = false;
    }
    next();
});

app.use(minify());

//Static Path
app.use(express.static("./src/assets/static"));

require("./routes/router")(app);

process.on("unhandledRejection", (err, promise) => {
    log.error(`Unhandled rejection (promise: ${promise}, reason: ${err})`);
});

app.listen(app.get("port"), (err) => {
    if (err){
        log.error(`Error on port ${app.get("port")}: ${err}`);
        process.exit(1);
    }
    log.info(`Listening on port ${app.get("port")}...`);
});
