class HUD {
    constructor(game, hero) {
        Object.assign(this, {game, hero});

        // sprite sheet
        this.spritesheet = [];
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/healthBar.png")); // 0
        this.width = 725; // character width
        this.height = 200; // character height

        this.health = 100;

        this.animations = [];
        this.loadAnimations();
    };

    update() {
        this.health
    };

    draw(ctx) {
        // this.animations[this.action][this.facing].drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
        this.animations[0][Math.floor(this.health / 5)].drawFrame(this.game.clockTick, ctx, 100, 1000, 1);
    };

    loadAnimations() {
        for (let i = 0; i < 2; i++) { // two actions
            this.animations.push([]);
        }

        for (let i = 0; i < 20; i++) { // healthBar sprites
            this.animations[0].push([]);
            this.animations[0][i] = new Animator(this.spritesheet[0], 0, 0 + (225 * i), this.width, this.height, 1, 0.10, 25, false, false);
        }
    }

}