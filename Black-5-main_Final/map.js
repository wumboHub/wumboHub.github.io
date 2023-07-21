class Map {
    constructor(game, level) {
        Object.assign(this, {game, level});
        this.image = ASSET_MANAGER.getAsset(level.imgPath);
        this.width = this.image.naturalWidth;
        this.height = this.image.naturalHeight;
    };

    init() {
        let that = this;
        this.level.walls.forEach(function (item) {
            let wall = new Wall(that.game, item.x, item.y, item.width, item.height, item.x + item.width / 2, item.y + item.height / 2);
            that.game.addEntity(wall);
        });
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.image, -(this.game.camera.x), -(this.game.camera.y), this.width, this.height);
    };
}