class HanoiRing {
    constructor(game, x, y) {

        this.width = 50;
        this.height = 50;
        this.scale = 1;
        this.updateBB();
    }

    draw(ctx) {
        let drawX = this.x - this.game.camera.x;
        let drawY = this.y - this.game.camera.y;
        this.animations[0][0].drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
    }

    update() {
        this.elaspedTime += this.game.clockTick;
        this.updateBB();
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }
}