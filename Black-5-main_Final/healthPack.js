class HealthPack {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/healthPack.png");
        this.width = 256;
        this.height = 184;
        this.scale = 0.15;
        this.elapsedTime = 0;
        this.BB = new BoundingBox(this.x, this.y, this.width * this.scale, this.height * this.scale);

        this.animations = [];
        this.loadAnimations();
        this.updateBB();

    };

    update() {
        // Collision check and handling
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Hero) {
                    entity.takeDamage(-50, 0, 0, 0);
                    that.removeFromWorld = true;
                    ASSET_MANAGER.playAsset("./sounds/collect.mp3");
                } else if (entity instanceof Wall) {
                    that.removeFromWorld = true;
                }
            }
        });
        this.updateBB();
    };

    draw(ctx) {
        let drawX = this.x - this.game.camera.x;
        let drawY = this.y - this.game.camera.y;
        this.animations.drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
    };

    loadAnimations() {
        this.animations = new Animator(this.spritesheet, 46, 24, this.width, this.height, 1, 0.15, 0, false, true);
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width * this.scale, this.height * this.scale);
    };
}