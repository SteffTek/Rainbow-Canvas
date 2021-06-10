"use strict";

// Utils
let config = require("../../utils/configHandler").getConfig();

/**
 * Generate robots.txt
 *
 * @param {*} req
 * @param {*} res
 */
module.exports = function(req, res){
    let cYear = (new Date()).getFullYear();
    res.type("text/plain");
    res.send(
        "#" + "-".repeat(17 + cYear.toString().length + (config.meta.name).length) + "#\n" +
        "# Copyright (c) " + cYear + " " + config.meta.name + " #\n" +
        "#" + "-".repeat(17 + cYear.toString().length + (config.meta.name).length) + "#\n\n" +
        "User-agent: *\n" +
        "Disallow: /css\n" +
        "Disallow: /img\n" +
        "Disallow: /js\n" +
        "Disallow: /lib\n\n" +
        "User-agent: Mediapartners-Google\n" +
        "Disallow: /\n\n" +
        "User-agent: Spinn3r\n" +
        "Disallow: /\n\n" +
        "User-agent: 008\n" +
        "Disallow: /\n\n" +
        "User-agent: voltron\n" +
        "Disallow: /\n\n" +
        "User-agent: Yahoo Pipes 1.0\n" +
        "Disallow: /\n\n" +
        "User-agent: KSCrawler\n" +
        "Disallow: /\n\n" +
        "Sitemap: " + config.meta.protocol + "://" + config.meta.domain + "/sitemap.xml\n"
    );
};
