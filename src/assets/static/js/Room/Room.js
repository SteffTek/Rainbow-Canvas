class Room {
    constructor() {

        this.camera = new Camera();

        this.users = 0;
        this.cooldown = 0;
        this.isSpectator = true;
        this.isInspector = false;

        this.pixelData = "";
        this.image = new Image;
        this.image.src = this.pixelData;
        this.width = 256;
        this.boundingBox = [-(this.camera.width),-(this.camera.height),(this.camera.width),(this.camera.height)];

        // COLORS
        this.currentColor = 1;
        this.colors = [
            "",
            "#000000",
            "#808080",
            "#c0c0c0",
            "#ffffff",
            "#000080",
            "#0000ff",
            "#008080",
            "#00ffff",
            "#008000",
            "#00ff00",
            "#808000",
            "#ffff00",
            "#800000",
            "#ff0000",
            "#800080",
            "#ff00ff"
        ]

        // SET UI
        this.createColors();

        this.fps = 0;
        this.frames = 0;
        this.start = performance.now();

        //RENDERING
        let room = this;
        tickSystem.onTick(() => {
            room.render();

            //CALC FPS
            room.frames++;
            let now = performance.now();

            let secondsPassed = (room.start - now) / 1000;
            room.start = now;
            let fps = Math.abs(Math.round(1 / secondsPassed));

            let smoothing = 1;
            room.fps = Math.round((fps * smoothing) + (room.fps * (1.0-smoothing)))

            // RENDER TIMER
            this.showTimer();
        }); //RENDER AT 64 FPS
    }

    /*
        UI
    */
    createColors() {
        let elem = $("#colors")[0];

        // CHECK IF USER LOGGED IN
        if(!elem) {
            return;
        }

        this.isSpectator = false;

        this.colors.forEach(color => {

            // CHECK FOR EMPTY
            if(color.length == 0) {
                return;
            }

            // GET INDEX
            let index = this.colors.indexOf(color);

            // POPULATE
            let col = document.createElement("div");
            col.classList.add("color");
            col.style.backgroundColor = color;
            col.addEventListener("click", () => {
                this.selectColor(index);
            });

            // APPEND
            elem.append(col);
        });
    }

    setTimer(time) {
        // SET COUNTDOWN
        this.cooldown = time;
    }

    showTimer() {

        // GET TIMER
        let timer = $("#timer")[0];

        if(!timer) {
            return;
        }

        // DISABLE TIMER
        if(this.cooldown <= 0) {
            timer.style.display = "none";
            return;
        }

        // GET TIME
        var seconds = Math.floor(this.cooldown / 1000);
        var millie = ((this.cooldown - seconds) / 1000 - seconds).toFixed(2).toString().split(".")[1];

        let time = `${seconds}:${millie}`;

        // SUBTRACT TIME
        this.cooldown -= tickSystem.tickTime;

        // SHOW TIMER
        timer.style.display = "block";
        timer.innerText = time;
    }

    setUsers(count) {
        this.users = count;
        $("#userCount").text(this.users);
    }

    setPixels(count) {
        this.pixelCount = count;
        let string = this.pixelCount;

        if(this.pixelCount >= 1000) {
            string = `${(this.pixelCount / 1000).toFixed(0)}k`;
        } else if(this.pixelCount >= 1000000) {
            string = `${(this.pixelCount / 1000000).toFixed(0)}m`;
        }

        $("#pixels").text(string);
        $("#pixels").parent().attr("aria-label",`${this.pixelCount} Pixels`)
    }

    toggleRaster() {

        // SET MODE
        this.camera.raster = !this.camera.raster;

        // CHANGE UI
        let elem = $("#raster")[0];

        if(this.camera.raster) {
            elem.classList.add("active");
        } else {
            elem.classList.remove("active");
        }
    }

    /*
        MAP
    */
    render() {
        // CLEAR CANVAS
        this.camera.clear();

        // DRAW CONTEXT
        if(this.pixelData)
            this.camera.draw(this.image);

        // DRAW RASTER
        this.camera.drawRaster();

        // DRAW DEBUG
        this.camera.drawDebug();
    }

    setImage(dataURL) {
        this.pixelData = dataURL;

        var image = new Image;
        image.src = this.pixelData;

        image.onload = () => {
            this.image = image;
        }
    }

    /*
        INTERACTION
    */
    selectColor(i) {
        // CHECK SPECTATOR
        if(this.isSpectator) {
            return;
        }

        // CHECK I
        if(typeof i !== "number") {
            return;
        }

        // SELECT COLOR
        if(i > 0 && i < this.colors.length)
            this.currentColor = i;

        // SET ACTIVE COLOR IN HUD

    }

    setPixel(event) {
        // CHECK SPECTATOR
        if(this.isSpectator) {
            return;
        }

        // GET MOUSE & CLICK POSITION
        let mouse_position = mouse.getCursorToCanvas(this.camera.canvas, event);
        let click_position = this.camera.getScaledObjectFromWorldPosition(mouse_position.x, mouse_position.y);

        // CLEAN UP POSITIONS
        if(click_position.x < 0) {
            click_position.x += this.width / 2;
        } else {
            click_position.x = this.width / 2 + click_position.x;
        }

        if(click_position.y < 0) {
            click_position.y += this.width / 2;
        } else {
            click_position.y = this.width / 2 + click_position.y;
        }

        // CHECK POSITION
        if(click_position.y > this.width || click_position.y < 0) {
            return;
        }

        if(click_position.x > this.width || click_position.x < 0) {
            return;
        }

        // DRAW
        var pixel = {
            x: click_position.x,
            y: click_position.y,
            c: this.currentColor
        }

        // PIXEL INSPECTOR MODE
        if(this.isInspector) {
            delete pixel.c;
            pixel.r = [];
            eventManager.send(new Inspector({session: sessionID, pixel: pixel}))
            return;
        }

        eventManager.send(new Pixel({session: sessionID, pixel: pixel}))
    }
}