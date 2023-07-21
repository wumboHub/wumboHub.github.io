class Wall {
    constructor(game, x, y, width, height, centerX, centerY) {
        Object.assign(this, {game, x, y, width, height, centerX, centerY});
        this.updateBB();
    };

    update() {
        this.updateBB();
    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            let drawX = this.x - this.game.camera.x;
            let drawY = this.y - this.game.camera.y;
            ctx.strokeRect(drawX, drawY, this.width, this.height);
        }
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x,this.y, this.width, this.height);
    };
}