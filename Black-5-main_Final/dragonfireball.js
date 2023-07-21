class DragonFireball {
    constructor(game, x, y, toX, toY) {
        Object.assign(this, {game, x, y, toX, toY});

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/dragonfireball.png");
        this.width = 20;
        this.height = 20;

        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 0, false, true);

        this.flySpeed = 300; // pixels per second
        this.attackDamage = 45;

        this.xSpeed = 0;
        this.ySpeed = 0;
        this.getSpeeds();

        this.updateBB();
    };

    getSpeeds() {
        let xDiff = this.toX - this.x;
        let yDiff = this.toY - this.y;
        let distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        this.xSpeed = this.flySpeed * (xDiff / distance);
        this.ySpeed = this.flySpeed * (yDiff / distance);
    };

    update() {
        let delX = this.xSpeed * this.game.clockTick;
        let delY = this.ySpeed * this.game.clockTick;

        this.x += delX;
        this.y += delY;

        this.updateBB();

        // Collision check and handling
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Hero) {
                    // The arrow will damage the player
                    entity.takeDamage(that.attackDamage, 25, entity.getX() - that.x, entity.getY() - that.y);
                    that.removeFromWorld = true;
                    ASSET_MANAGER.playAsset("./sounds/fire-hit.mp3");
                }
            }
        });

        // World borders
        that.removeFromWorld = that.removeFromWorld || this.x + this.width <= 0 || this.y + this.height <= 0
            || this.x >= this.game.camera.map.width || this.y >= this.game.camera.map.height;
    };

    draw(ctx) {
        let drawX = this.x - this.game.camera.x;
        let drawY = this.y - this.game.camera.y;
        this.animator.drawFrame(this.game.clockTick, ctx, drawX, drawY, 1);
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };
}