class StartMenu {
    constructor(game, level) {
        Object.assign(this, {game, level});
    }

    update() {
        if (this.game.mouseDown) {
            this.game.gameStart = true;
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        switch(this.level) {
            case 1:
                this.drawMain(ctx);
                break;
            default:
                this.drawLevelStart(ctx);
        }
    }

    drawMain(ctx) {
        ctx.fillStyle = "wheat";
        ctx.fillRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);

        ctx.font = '60px "Felipa"';
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "black";
        ctx.fillText("Ye Olde Onslaught", this.game.surfaceWidth / 2, 15);

        ctx.font = '45px "Noto Serif"';
        ctx.textBaseline = "middle";
        ctx.fillText("Click to Start", this.game.surfaceWidth / 2, this.game.surfaceHeight / 2);

        ctx.font = '25px "Noto Serif"';
        ctx.textBaseline = "alphabetic";
        ctx.fillText("By Espen Storfjell, Kyle Oslin, and Loren Mendoza",
            this.game.surfaceWidth / 2, this.game.surfaceHeight - 15);
    }

    drawLevelStart(ctx) {
        ctx.fillStyle = "wheat";
        ctx.fillRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);

        ctx.font = '60px "Felipa"';
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "black";
        ctx.fillText("Level " + this.level, this.game.surfaceWidth / 2, 15);

        ctx.font = '45px "Noto Serif"';
        ctx.textBaseline = "middle";
        ctx.fillText("Click to Continue", this.game.surfaceWidth / 2, this.game.surfaceHeight / 2);
    }
}