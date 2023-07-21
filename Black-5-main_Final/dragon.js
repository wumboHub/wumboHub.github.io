class Dragon {
    constructor(game, hero, x, y) {
        Object.assign(this, {game, hero, x, y});

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/dragon.png");
        this.width = 189; // character width
        this.height = 131; // character height

        this.heading = 0; // radians counterclockwise from East
        this.velocity = {x: 0, y: 0};

        // character states
        this.action = 0; // 0 = flying
        this.facing = 0; // 0 = east, 1 = north, 2 = west, 3 = south
        this.flyAnimSpeed = 0.15; // seconds per frame
        this.breathLoc = [{x: 155, y: 95}, {x: 95, y: 5}, {x: 34, y: 95}, {x: 95, y: 107}]; // mouth locations

        this.acceleration = 50; // pixels per second per second

        this.coolDown = 2;
        this.burstDelay = 0.05;
        this.burstCount = 10;
        this.burst = 4;
        this.timer = 0;

        this.init();

        this.updateBB();

        this.animations = [];
        this.loadAnimations();
    }

    update() {
        let turnTickMax = this.turnSpeed * this.game.clockTick;
        let accTickMax = this.acceleration * this.game.clockTick;
        let flyTickMax = this.maxSpeed * this.game.clockTick;

        // TODO: Behavior
        let relationToPlayer = this.relationToTarget(this.hero);

        if (relationToPlayer.direction > this.heading && relationToPlayer.direction <= this.heading + Math.PI) {
            this.heading = Math.min(relationToPlayer.direction, this.heading + turnTickMax);
        } else if (relationToPlayer.direction < this.heading && relationToPlayer.direction > this.heading - Math.PI) {
            this.heading = Math.max(relationToPlayer.direction, this.heading - turnTickMax);
        } else if (relationToPlayer.direction + 2 * Math.PI > this.heading && relationToPlayer.direction + 2 * Math.PI <= this.heading + Math.PI) {
            this.heading = Math.min(relationToPlayer.direction, this.heading + turnTickMax);
        } else if (relationToPlayer.direction - 2 * Math.PI < this.heading && relationToPlayer.direction - 2 * Math.PI > this.heading - Math.PI) {
            this.heading = Math.max(relationToPlayer.direction, this.heading - turnTickMax);
        }

        // TODO: Velocity-based movement
        if (relationToPlayer.distance > 200) {
            this.x += flyTickMax * Math.cos(this.heading);
            this.y -= flyTickMax * Math.sin(this.heading);
        }

        // Move based on velocity
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        // Remap heading to [0, 2pi)
        while (this.heading >= 2 * Math.PI) {
            this.heading -= 2 * Math.PI;
        }
        while (this.heading < 0) {
            this.heading += 2 * Math.PI;
        }
        // Choose sprite direction
        if (this.heading <= Math.PI / 4 || this.heading >= 7 * Math.PI / 4) {
            this.facing = 0;
        } else if (this.heading < 3 * Math.PI / 4) {
            this.facing = 1;
        } else if (this.heading <= 5 * Math.PI / 4) {
            this.facing = 2;
        } else {
            this.facing = 3;
        }

        this.timer += this.game.clockTick;
        if (this.timer >= this.coolDown || (this.burst < this.burstCount && this.timer >= this.burstDelay)) {
            this.timer = 0;
            this.burst--;
            let fireX = this.x + this.breathLoc[this.facing].x;
            let fireY = this.y + this.breathLoc[this.facing].y;
            let fire = new DragonFireball(this.game, fireX, fireY, this.hero.x, this.hero.y);
            this.game.addEntity(fire);
        }
        if (this.burst <= 0) this.burst = this.burstCount;

        // World borders
        if (this.x <= 0) this.x = 0;
        if (this.y <= 0) this.y = 0;
        if (this.x >= this.game.camera.map.width - this.width) this.x = this.game.camera.map.width - this.width;
        if (this.y >= this.game.camera.map.height - this.height) this.y = this.game.camera.map.height - this.height;

        this.updateBB();

        // TODO: Collisions

        this.updateBB();
    }

    draw(ctx) {
        // TODO: Change animation system so wing state is preserved across "facing" changes
        let drawX = this.x - this.game.camera.x;
        let drawY = this.y - this.game.camera.y;
        this.animations[this.action][this.facing].drawFrame(this.game.clockTick, ctx, drawX, drawY, 1);

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 3;
            ctx.beginPath();
            let centerX = drawX + (this.width / 2);
            let centerY = drawY + (this.height / 2);
            ctx.moveTo(centerX, centerY);
            let endX = centerX + 100 * Math.cos(this.heading);
            let endY = centerY - 100 * Math.sin(this.heading);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    updateBB() {
        // TODO: Make bounding box change shape to match dragon's sprite
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    loadAnimations() {
        for (let i = 0; i < 1; i++) { // actions
            this.animations.push([]);
            for (i = 0; i < 4; i++) { // four directions
                this.animations.push([]);
            }
        }

        // flying
        // east
        this.animations[0][0] = new Animator(this.spritesheet, 10, 151, this.width, this.height, 4, this.flyAnimSpeed,
            10, false, true);
        // north
        this.animations[0][1] = new Animator(this.spritesheet, 10, 10, this.width, this.height, 4, this.flyAnimSpeed,
            10, false, true);
        // west
        this.animations[0][2] = new Animator(this.spritesheet, 10, 433, this.width, this.height, 4, this.flyAnimSpeed,
            10, false, true);
        // south
        this.animations[0][3] = new Animator(this.spritesheet, 10, 292, this.width, this.height, 4, this.flyAnimSpeed,
            10, false, true);
    }

    relationToTarget(target) {
        // Determine where the target is relative to dragon
        let relation = {distance: 0, direction: 0};
        let centerX = this.x + (this.width / 2);
        let centerY = this.y + (this.height / 2);
        let targetCenterX = target.x + (target.width / 2);
        let targetCenterY = target.y + (target.height / 2);
        let xDiff = targetCenterX - centerX;
        let yDiff = targetCenterY - centerY;
        if (xDiff > 0) {
            relation.direction = Math.atan(-(yDiff) / xDiff);
        } else if (xDiff < 0) {
            relation.direction = Math.PI - Math.atan(yDiff / xDiff);
        } else if (yDiff < 0) {
            relation.direction = Math.PI / 2;
        } else {
            relation.direction = 3 * Math.PI / 2;
        }
        // Remap direction to [0, 2pi)
        while (relation.direction >= 2 * Math.PI) {
            relation.direction -= 2 * Math.PI;
        }
        while (relation.direction < 0) {
            relation.direction += 2 * Math.PI;
        }
        relation.distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        return relation;
    }

    takeDamage(damage, knockback = 0, xVectorComp = 0, yVectorComp = 0) {
        this.health -= damage;
        if (this.health <= 0) {
            ASSET_MANAGER.playAsset("./sounds/dragon-death.mp3");
            this.removeFromWorld = true;
            this.hero.exp.dragonKill();
        }
        if (knockback !== 0) {
            // TODO: Allow a knockback to be applied over a period of time rather than all at once
            // The angle of the knockback measured relative to the x-axis
            let angle = Math.atan(Math.abs(yVectorComp) / Math.abs(xVectorComp));
            // The new x-coordinate of the hero
            let deltaX = knockback * Math.cos(angle);
            // The new y-coordinate of the hero
            let deltaY = knockback * Math.sin(angle);
            if (xVectorComp < 0) deltaX = -deltaX;
            if (yVectorComp < 0) deltaY = -deltaY;
            this.x += deltaX;
            this.y += deltaY;
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    init() {
        if (this.game.camera.wave <= 5) {
            this.health = 350;
            this.maxSpeed = 100; // pixels per second
            this.turnSpeed = Math.PI / 3; // radians turned per second
        } else {
            this.health = 500;
            this.maxSpeed = 150; // pixels per second
            this.turnSpeed = Math.PI / 2; // radians turned per second
        }
    }
}