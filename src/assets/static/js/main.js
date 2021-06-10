/*
    EVENT LIST
*/
const events = {
    Inspector: Inspector,
    Register: Register,
    Canvas: Canvas,
    Update: Update,
    Timer: Timer,
    Pixel: Pixel,
    Join: Join,
    Ping: Ping
}

/*
         GLOBAL
        VARIABLES
*/
const tickSystem = new TickSystem();
const eventManager = new EventManager();
const room = new Room();
const mouse = new MouseClass();
const sessionID = getCookie("session") || "";

document.body.onresize = function() {
    //RESET CAMERA ON RESIZE
    room.camera = new Camera();
}

var loc = window.location, new_uri;
if (loc.protocol === "https:") {
    host_uri = "wss:";
} else {
    host_uri = "ws:";
}
host_uri += "//" + loc.hostname + "/ws";

if (loc.hostname == "localhost") {
    host_uri = "ws://localhost:8892/ws"
}

/*
        WEB SOCKET
            &
      EVENT HANDLING
*/
const ws = new WebSocket(host_uri);
ws.onmessage = function (message) {
    // GET JSON
    let json = JSON.parse(message.data);
    eventManager.handle(json);
}
ws.onopen = function() {
    // SEND INITIAL PING
    eventManager.send(new Ping({timestamp: Date.now()}))
}

/*
    MOUSE ON CANVAS INPUTS
*/
const mouse_position = { x: 0, y: 0 }
const oldPos = { x: 0, y: 0 }
var object_position = { x: 0, y: 0 }
var isDragging = false;

/*
    COOKIE
*/
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

/*
    Movement on Over World Whiteboard
*/
function move(event) {

    event = event || window.event;

    oldPos.x = mouse_position.x;
    oldPos.y = mouse_position.y;

    let mousePos = {};
    if(event.touches) {
        mousePos.x = clientX;
        mousePos.y = clientY;
    } else {
        mousePos = mouse.getCursorToCanvas(room.camera.canvas, event);
    }

    mouse_position.x = mousePos.x;
    mouse_position.y = mousePos.y;

    object_position = room.camera.getScaledObjectFromWorldPosition(mouse_position.x, mouse_position.y);
    let lastPos = room.camera.getScaledObjectFromWorldPosition(oldPos.x, oldPos.y);

    document.getElementById("pos").innerText = `${object_position.x},${object_position.y}`

    if (isDragging) {
        room.camera.move(-(lastPos.x - object_position.x) * room.camera.scale, -(lastPos.y - object_position.y) * room.camera.scale);
        return;
    }
}

$('#canvas').on('mousemove', function (event) {
    event.preventDefault();
    move(event.originalEvent);
});

$('#canvas').on('mousedown', function (event) {
    event.preventDefault();

    // IF LEFT CLICK
    if(event.button == 0) {
        room.setPixel(event.originalEvent);
    }

    //IF MIDDLE MOUSE BUTTON
    if (event.button == 1) {
        isDragging = true;
    }
});
$('#canvas').on('mouseup', function (event) {
    event.preventDefault();

    //IF MIDDLE MOUSE BUTTON
    if (event.button == 1) {
        isDragging = false;
    }
});
$('#canvas').on('wheel', function (event) {
    event.preventDefault();

    // STORE POSITIONS
    let mousePos = mouse.getCursorToCanvas(room.camera.canvas, event);
    let startPos = room.camera.getScaledObjectFromWorldPosition(mousePos.x, mousePos.y);

    // SET SCALE
    room.camera.scale += event.originalEvent.deltaY * -0.01;
    // Restrict scale
    room.camera.scale = Math.min(Math.max(room.camera.minScale, room.camera.scale), room.camera.maxScale);

    // GET END POS
    let endPos = room.camera.getScaledObjectFromWorldPosition(mousePos.x, mousePos.y);

    // SET NEW CAMERA POS
    let posDiff = {x: endPos.x - startPos.x, y: endPos.y - startPos.y}
    room.camera.move(posDiff.x * room.camera.scale, posDiff.y * room.camera.scale);
});

$('#canvas').on('mouseleave mouseout pointercancel pointerout pointerleave', function (event) {
    event.preventDefault();
    isDragging = false;
}).on;

/*
    TOUCH
*/
var old_touch_pos = {x: 0, y: 0}
var mobilePlacement = false;
$("#canvas").on("touchstart", function(event) {
    event.preventDefault();
    event = event.originalEvent;

    // TRIGGER MOBILE PLACEMENT
    if(mobilePlacement) {
        mobilePlacement = false;

        let elem = $("#mobile")[0];
        elem.classList.remove("active");

        room.setPixel(event);
        return;
    }

    /* CHECK TOUCH POS */
    old_touch_pos = mouse.getCursorToCanvas(room.camera.canvas, event);
    isDragging = true;
})

$("#canvas").on("touchend", function(event) {
    event.preventDefault();
    isDragging = false;

    if(event.touches.length < 2) {
        lastDist = 0;
    }
});

$("#canvas").on("touchmove", function(event) {
    event.preventDefault();

    event = event.originalEvent;

    // ONLY MOVE ON TOUCH 2
    if(event.touches.length < 2) {
        return;
    }

    // NOT IF MOBILE PLACEMENT
    if(mobilePlacement) {
        return;
    }

    // GET MOUSE POS
    let mousePos = mouse.getCursorToCanvas(room.camera.canvas, event);
    mouse_position.x = mousePos.x;
    mouse_position.y = mousePos.y;

    object_position = room.camera.getScaledObjectFromWorldPosition(mouse_position.x, mouse_position.y);
    let last_pos = room.camera.getScaledObjectFromWorldPosition(old_touch_pos.x, old_touch_pos.y);

    document.getElementById("pos").innerText = `${object_position.x},${object_position.y}`

    // MOVING
    if (isDragging) {
        room.camera.move(-(last_pos.x - object_position.x) * room.camera.scale, -(last_pos.y - object_position.y) * room.camera.scale);
        old_touch_pos = mouse.getCursorToCanvas(room.camera.canvas, event);
    }

    // ZOOMING
    var touch1 = event.touches[0];
    var touch2 = event.touches[1];

    var p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
    };
    var p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
    };

    var dist = getDistance(p1, p2);
    if(!lastDist) {
        lastDist = dist;
    }

    let scale = room.camera.scale * (dist / lastDist);

    lastDist = dist;

    // STORE POSITIONS
    let startPos = room.camera.getScaledObjectFromWorldPosition(mousePos.x, mousePos.y);

    // SET SCALE
    room.camera.scale = scale;
    // Restrict scale
    room.camera.scale = Math.min(Math.max(room.camera.minScale, room.camera.scale), room.camera.maxScale);

    // GET END POS
    let endPos = room.camera.getScaledObjectFromWorldPosition(mousePos.x, mousePos.y);

    // SET NEW CAMERA POS
    let posDiff = {x: endPos.x - startPos.x, y: endPos.y - startPos.y}
    room.camera.move(posDiff.x * room.camera.scale, posDiff.y * room.camera.scale);

    /* UTIL FUNCTIONS */
    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
});


var lastDist = null;