class WitchFireball {
    constructor(game, targetX, targetY, isOnHeroTeam, attackDamage, x, y) {
        Object.assign(this, { game, targetX, targetY, isOnHeroTeam, attackDamage, x, y });

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/witchFireball.png");

        // arrow states
        this.facing = 0 // 0 = east, 1 = north, 2 = west, 3 = south

        this.flySpeed = 200; // pixels per second

        this.updateBB();

        this.animations = [];
        this.loadAnimations();

        this.delX = this.getNextXValue(this.flySpeed * this.game.clockTick);
        this.delY = this.getNextYValue(this.flySpeed * this.game.clockTick);

        this.width = 25;
        this.height = 25;

        if (this.delX > 0) {
            // The target is to the right of the arrow
            this.facing = 0;
        } else {
            // The target is to the left of the arrow
            this.facing = 2;
        }
        if (Math.atan(Math.abs(this.y - this.targetY) / Math.abs(this.x - this.targetX)) > Math.PI / 4) {
            // The target is above or below the arrow at over 45 degrees
            if (this.targetY < this.y) {
                // The target is above the arrow
                this.facing = 1;
            } else {
                // The target is below the arrow
                this.facing = 3;
            }
        }
    };

    /**
     * Gets the next x-value to fly toward the target's last position.
     * @param {Number} flyOrth The total distance this arrow will fly this tick
     */
    getNextXValue(flyOrth) {
        // The distance between the target's last position and this arrow in the x-direction
        let deltaX = Math.abs(this.x - this.targetX);
        // The distance between the target and this arrow in the y-direction
        let deltaY = Math.abs(this.y - this.targetY);
        // The angle of a right triangle in which the arrow is on one
        // end, and the target is on the other
        let angle = Math.atan(deltaY / deltaX);
        // The distance in the x-direction the arrow will fly this tick
        let flyX = flyOrth * Math.cos(angle);
        // This value is negative if the target is to the left of the arrow
        if (this.targetX < this.x) flyX = -flyX;
        return flyX;
    }

    /**
     * Gets the next y-value to fly toward the target's last position.
     * @param {Number} flyOrth The total distance this arrow will fly this tick
     */
    getNextYValue(flyOrth) {
        // The distance between the target's last position and this arrow in the x-direction
        let deltaX = Math.abs(this.x - this.targetX);
        // The distance between the target and this arrow in the y-direction
        let deltaY = Math.abs(this.y - this.targetY);
        // The angle of a right triangle in which the arrow is on one
        // end, and the target is on the other
        let angle = Math.atan(deltaY / deltaX);
        // The distance in the y-direction the arrow will fly this tick
        let flyY = flyOrth * Math.sin(angle);
        // This value is negative if the target is to the left of the arrow
        if (this.targetY < this.y) flyY = -flyY;
        return flyY;
    }

    update() {
        this.x += this.delX;
        this.y += this.delY;

        this.updateBB();

        // Collision check and handling
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (!that.isOnHeroTeam && entity instanceof Hero) {
                    // The arrow will damage the player
                    entity.takeDamage(that.attackDamage, 25, entity.getX() - that.x, entity.getY() - that.y);
                    that.removeFromWorld = true;
                } else if (that.isOnHeroTeam && (entity instanceof Skeleton || entity instanceof Zombie || entity instanceof Witch)) {
                    // The arrow will damage the enemy
                    entity.takeDamage(that.attackDamage, 25, entity.getX() - that.x, entity.getY() - that.y);
                    that.removeFromWorld = true;
                } else if (entity instanceof Wall) {
                    that.removeFromWorld = true;
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
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        this.animations[0].drawFrame(this.game.clockTick, ctx, drawX, drawY, 1);
    };

    loadAnimations() {
        for (let i = 0; i < 1; i++) { // one action
            this.animations.push([]);
            for (i = 0; i < 4; i++) { // four directions
                this.animations.push([]);
            }
        }
        // south
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 64, 27, 8, 0.05, 23, false, true);
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + 25, this.y, this.width, this.height);
    }
}