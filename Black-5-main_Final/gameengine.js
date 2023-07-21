// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.entities = [];
        this.showOutlines = false;
        this.ctx = null;

        this.gameStart = false;
        this.paused = false;

        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.mouseDown = false;
        this.space = false;

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.switchToSecondary = false;
        this.switchToMelee = false;
        this.toggleGrenade = false;
        this.toggleShop = false;

        this.surfaceWidth = null;
        this.surfaceHeight = null;

        this.shopIsOpen = false;

        this.enemyCount = 0;
    };

    /**
     * Initializes the canvas with width tand height.
     * @param {Canvas to be drawn} ctx 
     */
    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
    };

    /**
     * Start the game loop to update canvas.
     */
    start() {
        let that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    };

    /**
     * Start accepting input.
     */
    startInput() {
        let that = this;

        let getXandY = function (e) {
            let x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            let y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return {x: x, y: y};
        };

        // listens for mouse click
        this.ctx.canvas.addEventListener("mousedown", function (e) {
            that.mouseDown = true;
        }, false);

        // listens for mouse release
        this.ctx.canvas.addEventListener("mouseup", function (e) {
            that.mouseDown = false;
        }, false);

        //listens for mouse movement
        this.ctx.canvas.addEventListener("mousemove", function (e) {
            //console.log(getXandY(e));
            that.mouse = getXandY(e);
        }, false);

        //listens for mouse click and release
        this.ctx.canvas.addEventListener("click", function (e) {
            // console.log(getXandY(e));
            that.click = getXandY(e);
        }, false);

        // listens for scroll wheel movement
        this.ctx.canvas.addEventListener("wheel", function (e) {
            //console.log(getXandY(e));
            that.wheel = e;
            //       console.log(e.wheelDelta);
            e.preventDefault();
        }, false);

        this.ctx.canvas.addEventListener("contextmenu", function (e) {
            //console.log(getXandY(e));
            that.rightclick = getXandY(e);
            e.preventDefault();
        }, false);

        //listens for key presses
        this.ctx.canvas.addEventListener("keydown", function (e) {
            switch (e.code) {
                case "ArrowLeft":
                    // Prevents the arrow keys from moving the page
                    e.preventDefault();
                case "KeyA":
                    // console.log("left");
                    that.left = true;
                    break;
                case "ArrowRight":
                    e.preventDefault();
                case "KeyD":
                    // console.log("right");
                    that.right = true;
                    break;
                case "ArrowUp":
                    e.preventDefault();
                case "KeyW":
                    // console.log("up");
                    that.up = true;
                    break;
                case "ArrowDown":
                    e.preventDefault();
                case "KeyS":
                    // console.log("down");
                    that.down = true;
                    break;
                case "Space":
                    e.preventDefault();
                    that.space = true;
                    break;
                case "KeyQ":
                    that.switchToSecondary = true;
                    break;
                case "KeyE":
                    that.switchToMelee = true;
                    break;
                case "KeyG":
                    that.toggleGrenade = true;
                    break;
                case "KeyT":
                    that.toggleShop = true;
                    break;
                case "KeyP":
                    that.paused = !that.paused;
                    break;
            }
        }, false);

        //listens for key releases
        this.ctx.canvas.addEventListener("keyup", function (e) {
            switch (e.code) {
                case "ArrowLeft":
                    // Prevents the arrow keys from moving the page
                    e.preventDefault();
                case "KeyA":
                    that.left = false;
                    break;
                case "ArrowRight":
                    e.preventDefault();
                case "KeyD":
                    that.right = false;
                    break;
                case "ArrowUp":
                    e.preventDefault();
                case "KeyW":
                    that.up = false;
                    break;
                case "ArrowDown":
                    e.preventDefault();
                case "KeyS":
                    that.down = false;
                    break;
            }
        }, false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    setEnemyCount(value) {
        this.enemyCount = value;
    };

    getEnemyCount() {
        return this.enemyCount;
    };

    /**
     * Draws entities onto canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
        for (let i = 0; i < this.entities.length; i++) {
            if (this.gameStart || this.entities[i] instanceof StartMenu) {
                this.entities[i].draw(this.ctx);
            }
        }

        if (this.gameStart) {
            this.camera.draw(this.ctx);
        }
    };

    /**
     * Updates entities and their values.
     */
    update() {
        let i;
        let entitiesCount = this.entities.length;

        for (i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                if (this.gameStart || entity instanceof StartMenu) {
                    entity.update();
                }
            }
        }

        // Update camera if game is started.
        if (this.gameStart) {
            this.camera.update();
        }

        // If entity is marked for removal, remove and subtract enemy count.
        for (i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                if (this.entities[i] instanceof Zombie ||
                    this.entities[i] instanceof Skeleton || this.entities[i] instanceof Witch ||
                    this.entities[i] instanceof Dragon) {
                    this.enemyCount--;
                }
                this.entities.splice(i, 1);
            }
        }
    };

    /**
     * Repeats the update and drawing of canvas.
     */
    loop() {
        this.clockTick = this.timer.tick();
        if (!this.paused) {
            this.update();
        }
        this.draw();
    };
}