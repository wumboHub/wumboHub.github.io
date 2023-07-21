class Grenade {
    constructor(game, x, y, hero) {
        Object.assign(this, { game, x, y, hero });

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/grenade.png");
        this.width = 25;
        this.height = 26;
        this.scale = 1;

        this.attackDamage = 250;
        this.attackRadius = 200;
        this.fuse = 3;
        this.elaspedTime = 0;

        this.updateBB();

        this.animations = [];
        this.loadAnimations();
    }

    update() {
        this.elaspedTime += this.game.clockTick;
        if (this.elaspedTime >= this.fuse) {
            this.elaspedTime = 0;
            this.detonate();
        }

        this.updateBB();
    }

    draw(ctx) {
        let drawX = this.x - this.game.camera.x;
        let drawY = this.y - this.game.camera.y;
        this.animations[0][0].drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
    }

    loadAnimations() {
        for (let i = 0; i < 1; i++) { // one action
            this.animations.push([]);
            for (i = 0; i < 1; i++) { // one direction
                this.animations.push([]);
            }
        }

        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.15, 0, false, true);
    }

    detonate() {
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB) {
                if (entity instanceof Zombie || entity instanceof Skeleton ||
                    entity instanceof Witch || entity instanceof Dragon || entity instanceof Hero) {
                    let distance = Math.sqrt((that.x - entity.x) * (that.x - entity.x) + (that.y - entity.y) * (that.y - entity.y))
                    if (distance <= that.attackRadius) {
                        entity.takeDamage(that.attackDamage - (distance / that.attackRadius) * that.attackDamage,
                            40, entity.x - that.x, entity.y - that.y);
                    }
                }
            }
        });
        this.removeFromWorld = true;
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}