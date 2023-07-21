let gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./maps/BigMap1.png");
ASSET_MANAGER.queueDownload("./maps/BigMap2.png");
ASSET_MANAGER.queueDownload("./maps/BigMap3.png");

ASSET_MANAGER.queueDownload("./sprites/hero.png");
ASSET_MANAGER.queueDownload("./sprites/zombie.png");
ASSET_MANAGER.queueDownload("./sprites/skeleton.png");
ASSET_MANAGER.queueDownload("./sprites/arrow.png");
ASSET_MANAGER.queueDownload("./sprites/witch.png");
ASSET_MANAGER.queueDownload("./sprites/sword.png");
ASSET_MANAGER.queueDownload("./sprites/crossbow.png");
ASSET_MANAGER.queueDownload("./sprites/pistol.png");
ASSET_MANAGER.queueDownload("./sprites/bullet.png");
ASSET_MANAGER.queueDownload("./sprites/shotgun.png");
ASSET_MANAGER.queueDownload("./sprites/witchFireball.png");
ASSET_MANAGER.queueDownload("./sprites/healthPack.png");
ASSET_MANAGER.queueDownload("./sprites/armor.png");
ASSET_MANAGER.queueDownload("./sprites/potions.png");
ASSET_MANAGER.queueDownload("./sprites/dragon.png");
ASSET_MANAGER.queueDownload("./sprites/dragonfireball.png");
ASSET_MANAGER.queueDownload("./sprites/grenade.png");

ASSET_MANAGER.queueDownload("./music/ChillVibes.mp3");
ASSET_MANAGER.queueDownload("./music/grim-idol.mp3");
ASSET_MANAGER.queueDownload("./music/unholy-knight.mp3");
ASSET_MANAGER.queueDownload("./music/wretched-destroyer.mp3");

ASSET_MANAGER.queueDownload("./sounds/bonk.mp3");
ASSET_MANAGER.queueDownload("./sounds/collect.mp3");
ASSET_MANAGER.queueDownload("./sounds/crossbow.mp3");
ASSET_MANAGER.queueDownload("./sounds/dragon-death.mp3");
ASSET_MANAGER.queueDownload("./sounds/fire-hit.mp3");
ASSET_MANAGER.queueDownload("./sounds/hit.mp3");
ASSET_MANAGER.queueDownload("./sounds/lose.mp3");
ASSET_MANAGER.queueDownload("./sounds/pistol.mp3");
ASSET_MANAGER.queueDownload("./sounds/shotgun.mp3");
ASSET_MANAGER.queueDownload("./sounds/sword.mp3");
ASSET_MANAGER.queueDownload("./sounds/win.mp3");

ASSET_MANAGER.downloadAll(function () {
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    PARAMS.CANVAS_WIDTH = canvas.width;
    PARAMS.CANVAS_HEIGHT = canvas.height;

    gameEngine.init(ctx);

    new SceneManager(gameEngine);

    gameEngine.start();
});
