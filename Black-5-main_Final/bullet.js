class Bullet {
    constructor(game, targetX, targetY, isOnHeroTeam, attackDamage, range, x, y) {
        Object.assign(this, {game, targetX, targetY, isOnHeroTeam, attackDamage, range, x, y});

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bullet.png");

        // bullet states
        this.facing = 0; // 0 = east, 1 = north, 2 = west, 3 = south

        this.flySpeed = 300; // pixels per second

        this.distanceFlown = 0;

        this.updateBB();

        this.animations = [];
        this.loadAnimations();

        this.delX = 0;
        this.delY = 0;

        if (this.x == this.targetX) {
            if (this.y - this.targetY > 0) {
                // north
                this.facing = 1;
                this.delX = 0;
                this.delY = -this.flySpeed * this.game.clockTick;
            } else {
                // south
                this.facing = 3;
                this.delX = 0;
                this.delY = this.flySpeed * this.game.clockTick;
            }
        } else if (this.y == this.targetY) {
            if (this.x - this.targetX < 0) {
                // east
                this.facing = 0;
                this.delX = this.flySpeed * this.game.clockTick;
                this.delY = 0;
            } else {
                // west
                this.facing = 2;
                this.delX = -this.flySpeed * this.game.clockTick;
                this.delY = 0;
            }
        } else {
            this.delX = this.getNextXValue(this.flySpeed * this.game.clockTick);
            this.delY = this.getNextYValue(this.flySpeed * this.game.clockTick);

            if (this.delX > 0) {
                // The target is to the right of the bullet
                this.facing = 0;
            } else {
                // The target is to the left of the bullet
                this.facing = 2;
            }
            if (Math.abs(this.delX / this.delY) < 1) {
                // The target is above or below the bullet at over 45 degrees
                if (this.targetY < this.y) {
                    // The target is above the bullet
                    this.facing = 1;
                } else {
                    // The target is below the bullet
                    this.facing = 3;
                }
            }
        }

        this.width = 9;
        this.height = 8;
    };

    /**
     * Gets the next x-value to fly toward the target's last position.
     * @param {Number} flyOrth The total distance this bullet will fly this tick
     */
    getNextXValue(flyOrth) {
        // The distance between the target's last position and this bullet in the x-direction
        let deltaX = Math.abs(this.x - this.targetX);
        // The distance between the target and this bullet in the y-direction
        let deltaY = Math.abs(this.y - this.targetY);
        // The angle of a right triangle in which the bullet is on one
        // end, and the target is on the other
        let angle = Math.atan(deltaY / deltaX);
        // The distance in the x-direction the bullet will fly this tick
        let flyX = flyOrth * Math.cos(angle);
        // This value is negative if the target is to the left of the bullet
        if (this.targetX < this.x) flyX = -flyX;
        return flyX;
    }

    /**
     * Gets the next y-value to fly toward the target's last position.
     * @param {Number} flyOrth The total distance this bullet will fly this tick
     */
    getNextYValue(flyOrth) {
        // The distance between the target's last position and this bullet in the x-direction
        let deltaX = Math.abs(this.x - this.targetX);
        // The distance between the target and this bullet in the y-direction
        let deltaY = Math.abs(this.y - this.targetY);
        // The angle of a right triangle in which the bullet is on one
        // end, and the target is on the other
        let angle = Math.atan(deltaY / deltaX);
        // The distance in the y-direction the bullet will fly this tick
        let flyY = flyOrth * Math.sin(angle);
        // This value is negative if the target is to the left of the bullet
        if (this.targetY < this.y) flyY = -flyY;
        return flyY;
    }

    update() {
        this.x += this.delX;
        this.y += this.delY;

        this.updateBB();

        this.distanceFlown += this.flySpeed * this.game.clockTick;
        if (this.range != 0) {
            if (this.distanceFlown >= this.range) {
                this.distanceFlown = 0;
                this.removeFromWorld = true;
            }
        }

        // Collision check and handling
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (!that.isOnHeroTeam && entity instanceof Hero) {
                    // The bullet will damage the player
                    entity.takeDamage(that.attackDamage, 25, entity.getX() - that.x, entity.getY() - that.y);
                    that.removeFromWorld = true;
                } else if (that.isOnHeroTeam && (entity instanceof Skeleton || entity instanceof Zombie || entity instanceof Witch || entity instanceof Dragon)) {
                    // The bullet will damage the enemy
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
        this.animations[0][this.facing].drawFrame(this.game.clockTick, ctx, drawX, drawY, 1);
    };

    loadAnimations() {
        for (let i = 0; i < 1; i++) { // one action
            this.animations.push([]);
            for (i = 0; i < 4; i++) { // four directions
                this.animations.push([]);
            }
        }

        // flying
        // west
        this.animations[0][2] = new Animator(this.spritesheet, 26, 21, 9, 8, 1, 0.15, 0, false, true);
        // south
        this.animations[0][3] = new Animator(this.spritesheet, 26, 21, 9, 8, 1, 0.15, 0, false, true);
        // east
        this.animations[0][0] = new Animator(this.spritesheet, 26, 21, 9, 8, 1, 0.15, 0, false, true);
        // north
        this.animations[0][1] = new Animator(this.spritesheet, 26, 21, 9, 8, 1, 0.15, 0, false, true);
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }
}