class Camera {
    constructor() {
        this.position = {x:0,y:0};;
        this.anchor = [0,0];

        this.minScale = 0.1;
        this.maxScale = 50;
        this.scale = 1;

        this.canvas = document.getElementById("canvas");

        this.width = this.canvas.getBoundingClientRect().width;
        this.height = this.canvas.getBoundingClientRect().height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled= false
        this.anchor = [this.width / 2, this.height / 2]

        this.icon_size = 25;
        this.debug = false;
        this.raster = false;
    }

    moveTo(x,y) {
        let pos = {x: x, y: y}

        this.position = pos;
        this.anchor[0] = pos.x;
        this.anchor[1] = pos.y;
    }

    move(x,y) {
        x = this.checkMapBounds(x,"x")
        y = this.checkMapBounds(y,"y")

        this.position.x + x;
        this.position.y + y;

        this.anchor[0] += x;
        this.anchor[1] += y;
    }

    checkMapBounds(pos_int, axis = "x") {
        let boundingBox = room.boundingBox;
        if(!boundingBox) return pos_int;

        let left = boundingBox[0] * this.scale;
        let top = boundingBox[1] * this.scale;
        let right = boundingBox[2] * this.scale;
        let bottom = boundingBox[3] * this.scale;

        if(axis == "x") {
            if(left > this.position.x + pos_int - this.width / 2) return 0;
            if(right < this.position.x + pos_int + this.width / 2) return 0;
        } else if(axis == "y") {
            if(top > this.position.y + pos_int - this.height / 2) return 0;
            if(bottom < this.position.y + pos_int + this.height / 2) return 0;
        }

        return pos_int;
    }

    draw(image) {
        var position = this.getWorldPositionFromObjectPosition(-(room.width / 2) * this.scale,-(room.width / 2) * this.scale);
        this.context.drawImage(image, position.x, position.y, room.width * this.scale, room.width * this.scale);
    }

    drawRaster() {

        // ONLY IF RASTER IS ON
        if(!this.raster) {
            return;
        }

        // DRAW RASTER ONLY ON HIGHER SCALE
        if(this.scale < 5) {
            return;
        }

        this.context.strokeStyle = "#d9d9d9";
        this.context.setLineDash([1]);

        for(let i = 0; i < room.width * this.scale; i += this.scale) {

            // DRAW Y LINE
            let lineY = i - ((room.width / 2) * this.scale);

            let yStart = this.getWorldPositionFromObjectPosition(0 - ((room.width / 2) * this.scale), lineY);
            let yEnd =this.getWorldPositionFromObjectPosition(0 + ((room.width / 2) * this.scale), lineY);

            this.context.beginPath();
            this.context.moveTo(yStart.x, yStart.y);
            this.context.lineTo(yEnd.x, yEnd.y);
            this.context.stroke();

            // DRAW X LINE
            let lineX = i - ((room.width / 2) * this.scale);

            let xStart = this.getWorldPositionFromObjectPosition(lineX, 0 - ((room.width / 2) * this.scale));
            let xEnd =this.getWorldPositionFromObjectPosition(lineX, 0 + ((room.width / 2) * this.scale));

            this.context.beginPath();
            this.context.moveTo(xStart.x, xStart.y);
            this.context.lineTo(xEnd.x, xEnd.y);
            this.context.stroke();

        }
    }

    drawDebug() {
        if(!this.debug) return;

        //DRAW SPAWN
        let spawnPos = this.getWorldPositionFromObjectPosition(0,0);
        this.context.beginPath();
        this.context.rect(spawnPos[0] - 10, spawnPos[1] - 10, 20, 20);
        this.context.stroke();

        //DRAW ANCHOR POS
        this.context.beginPath();
        this.context.fillStyle = "#ff0000";
        this.context.fillRect(this.anchor[0] - 5, this.anchor[1] - 5, 10, 10);
        this.context.stroke();

        //DRAW FPS
        this.context.beginPath();
        this.context.fillStyle = "#1ea627"
        this.context.font = "900 30px Roboto";
        this.context.textAlign = "center";
        this.context.fillText("FPS: " + room.fps, this.width / 2, 50);
        this.context.closePath();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getObjectPositionFromWorldPosition(x,y) {
        //Y AXIS
        if(y >= this.anchor[1]) {
            y -= this.anchor[1];
        } else {
            y = 0 - (this.anchor[1] - y);
        }

        //X AXIS
        if(x >= this.anchor[0]) {
            x -= this.anchor[0]
        } else {
            x = 0 - (this.anchor[0] - x);
        }

        return {x:x,y:y};
    }

    getScaledObjectFromWorldPosition(x,y) {
        //Y AXIS
        if(y >= this.anchor[1]) {
            y -= this.anchor[1];
        } else {
            y = 0 - (this.anchor[1] - y);
        }

        //X AXIS
        if(x >= this.anchor[0]) {
            x -= this.anchor[0]
        } else {
            x = 0 - (this.anchor[0] - x);
        }

        // CALC IN SCALE
        x = Math.floor(x / this.scale);
        y = Math.floor(y / this.scale);

        return {x:x,y:y};
    }

    getWorldPositionFromObjectPosition(x,y) {
        y = this.anchor[1] + y;
        x = this.anchor[0] + x;
        return {x:x,y:y};
    }
}