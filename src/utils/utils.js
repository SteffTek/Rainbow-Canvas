const crypto = require('crypto');

//VARS
let salt = "35418AF3C134C69A7749BAEA42B36";

//JSON UTILS
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function isValidJson(text){
    try {
        JSON.stringify(text);
        return true;
    } catch (e) {
        return false;
    }
}

function isValidJsonString(text){
    try {
        JSON.parse(text.toString());
        return true;
    } catch (e) {
        return false;
    }
}

//ERROR RESPONSE
function sendErrorResponse(res, msg){
    var payload = {
        status: "error",
        msg: msg
    }

    res.type("application/json");
    res.send(payload);
}

module.exports = {
    sendErrorResponse: sendErrorResponse,
    isValidJsonString: isValidJsonString,
    isValidJson: isValidJson,
    escapeHtml: escapeHtml,
}