class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.hudVisible = false;
        this.elapsedTime = 0;
        this.transparency = 0; //Game Over black screen
        this.transparency2 = 0; //Game Over Text
        this.transparency3 = 0; // End Screen
        this.endTimer = 0;

        this.hero = new Hero(game, 50, 50);
        this.heroStartX = LEVELS.LEVEL_ONE.startX;
        this.heroStartY = LEVELS.LEVEL_ONE.startY;

        this.shop = new Shop(game, this.hero);

        this.map = null;

        this.maxLevel = 3;
        this.level = 1; // current level
        this.wave = 1; // current wave
        this.round = 1; // current round

        this.intermissionLength = 30; // seconds
        this.intermissionElapsedTime = 0;
        this.isInIntermission = false;

        this.jukebox = ["./music/wretched-destroyer.mp3", "./music/unholy-knight.mp3", "./music/grim-idol.mp3"];
        this.jukeboxPlaying = false;
        this.interPlaying = false;
        this.currentSong = 0;

        this.heroIsDead = false;

        let mainMenu = new StartMenu(this.game, this.level);
        this.game.addEntity(mainMenu);

        this.loadRound(this.level, this.wave, this.round);
    };

    loadRound(levelNumber, wave, round) {
        this.hudVisible = true;

        let level;
        if (levelNumber === 1) {
            level = LEVELS.LEVEL_ONE;
        } else if (levelNumber === 2) {
            level = LEVELS.LEVEL_TWO;
        } else {
            level = LEVELS.LEVEL_THREE;
        }

        this.map = new Map(this.game, level);
        this.game.addEntity(this.map);
        this.map.init();

        let healthPack = new HealthPack(this.game, 600, 700);
        this.game.addEntity(healthPack);

        let healthPack2 = new HealthPack(this.game, 20, 530);
        this.game.addEntity(healthPack2);

        let armorPack = new Armor(this.game, 570, 370);
        this.game.addEntity(armorPack);

        let armorPack2 = new Armor(this.game, 970, 530);
        this.game.addEntity(armorPack2);

        // Gets the properties of this wave and round
        let spawnPoints = level.spawnPoints;
        let zombieCount = level.waves[wave - 1][round - 1].zombies;
        let skeletonCount = level.waves[wave - 1][round - 1].skeletons;
        let witchCount = level.waves[wave - 1][round - 1].witches;
        let dragonCount = level.waves[wave - 1][round - 1].dragons;

        let count = zombieCount + skeletonCount + witchCount + dragonCount;
        this.game.setEnemyCount(count);

        while (count > 0) {
            // Chooses a random spawn point
            let spawnPoint = randomInt(spawnPoints.length);
            // Chooses a random enemy to spawn
            let enemyNumber = randomInt(4);
            if (enemyNumber === 0 && zombieCount > 0) {
                let enemy = new Zombie(this.game, this.hero, wave, round,
                    level.spawnPoints[spawnPoint].x, level.spawnPoints[spawnPoint].y);
                zombieCount--;
                count--;
                this.game.addEntity(enemy);
            } else if (enemyNumber === 1 && skeletonCount > 0) {
                let enemy = new Skeleton(this.game, this.hero, wave, round,
                    level.spawnPoints[spawnPoint].x, level.spawnPoints[spawnPoint].y);
                skeletonCount--;
                count--;
                this.game.addEntity(enemy);
            } else if (enemyNumber === 2 && witchCount > 0) {
                let enemy = new Witch(this.game, this.hero, wave, round,
                    level.spawnPoints[spawnPoint].x, level.spawnPoints[spawnPoint].y);
                witchCount--;
                count--;
                this.game.addEntity(enemy);
            } else if (enemyNumber === 3 && dragonCount > 0) {
                let enemy = new Dragon(this.game, this.hero,
                    level.spawnPoints[spawnPoint].x, level.spawnPoints[spawnPoint].y);
                dragonCount--;
                count--;
                this.game.addEntity(enemy);
            }
        }

        if (wave === 1 && round === 1) {
            this.hero.x = level.startX;
            this.hero.y = level.startY;
        } else {
            this.hero.x = this.heroStartX;
            this.hero.y = this.heroStartY;
        }
        this.game.addEntity(this.hero);
        this.hero.initializeWeapons();
    };

    updateAudio() {
        let mute = document.getElementById("mute").checked;
        let volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

        if (this.game.gameStart && !this.jukeboxPlaying && !this.isInIntermission) {
            ASSET_MANAGER.pauseBackgroundMusic();
            this.jukeboxPlaying = true;
            this.interPlaying = false;
            let that = this;
            let song = ASSET_MANAGER.playAsset(this.jukebox[this.currentSong]);
            song.addEventListener("ended", function () {
                that.jukeboxPlaying = false;
                that.currentSong = (that.currentSong + 1) % that.jukebox.length;
            });
            song.addEventListener("paused", function () {
                that.jukeboxPlaying = false;
                that.currentSong = (that.currentSong + 1) % that.jukebox.length;
            });
            that.currentSong = (that.currentSong + 1) % that.jukebox.length;
        }

        if (this.game.gameStart && this.isInIntermission && !this.interPlaying) {
            ASSET_MANAGER.pauseBackgroundMusic();
            this.jukeboxPlaying = false;
            this.interPlaying = true;
            let that = this;
            let song = ASSET_MANAGER.playAsset("./music/ChillVibes.mp3");
            song.addEventListener("ended", function () {
                that.interPlaying = false;
            });
            song.addEventListener("paused", function () {
                that.interPlaying = false;
            });
        }
    };

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;

        this.updateAudio();

        let heroMidX = this.hero.x + (this.hero.width / 2);
        let heroMidY = this.hero.y + (this.hero.height / 2);
        let halfWidth = PARAMS.CANVAS_WIDTH / 2;
        let halfHeight = PARAMS.CANVAS_HEIGHT / 2;

        if (heroMidX - this.x < halfWidth) {
            this.x = Math.max(0, heroMidX - halfWidth);
        } else if (heroMidX - this.x > halfWidth) {
            this.x = Math.min(this.map.width - PARAMS.CANVAS_WIDTH, heroMidX - halfWidth);
        }

        if (heroMidY - this.y < halfHeight) {
            this.y = Math.max(0, heroMidY - halfHeight);
        } else if (heroMidY - this.y > halfHeight) {
            this.y = Math.min(this.map.height - PARAMS.CANVAS_HEIGHT, heroMidY - halfHeight);
        }

        if (this.game.getEnemyCount() === 0) {
            let level;
            if (this.level === 1) {
                level = LEVELS.LEVEL_ONE;
            } else if (this.level === 2) {
                level = LEVELS.LEVEL_TWO;
            } else {
                level = LEVELS.LEVEL_THREE;
            }

            if (this.round === level.waves[this.wave - 1].length && this.wave < level.waves.length) {
                this.startIntermission();
            } else if (this.round < level.waves[this.wave - 1].length && this.wave < level.waves.length) {
                this.heroStartX = this.hero.getX();
                this.heroStartY = this.hero.getY();
                // New round
                this.round++;
                this.clearEntityArray();
                this.loadRound(this.level, this.wave, this.round);
            } else {
                if (this.level < this.maxLevel) {
                    // New level
                    this.level++;
                    this.wave = 1;
                    this.round = 1;
                    this.clearEntityArray();
                    this.hero = new Hero(this.game, 50, 50);
                    this.shop.sword = this.hero.sword;
                    this.shop.crossbow = this.hero.crossbow;
                    this.shop.pistol = this.hero.pistol;
                    this.shop.shotgun = this.hero.shotgun;
                    this.shop.grenades = this.hero.grenades;
                    this.loadRound(this.level, this.wave, this.round);
                } else {
                    // Game Complete
                    this.win = 1;
                }
            }
        }

        if (this.isInIntermission) {
            this.intermissionElapsedTime += this.game.clockTick;
            if (this.intermissionElapsedTime >= this.intermissionLength) {
                this.isInIntermission = false;
                this.intermissionElapsedTime = 0;
                if (this.game.shopIsOpen) {
                    this.shop.toggle();
                }
                this.heroStartX = this.hero.getX();
                this.heroStartY = this.hero.getY();
                // New wave
                this.wave++;
                this.round = 1;
                this.clearEntityArray();
                this.loadRound(this.level, this.wave, this.round);
            }
        }

        if (this.game.toggleShop) {
            if (this.isInIntermission) {
                this.shop.toggle();
            }
            this.game.toggleShop = false;
        }

        if (this.heroIsDead) {
            this.elapsedTime += this.game.clockTick;
            this.hudVisible = false;
        }
    };

    startIntermission() {
        this.isInIntermission = true;
    }

    clearEntityArray() {
        this.game.entities = [];
    }

    draw(ctx) {
        this.ctx = ctx;
        let margin = 5;
        ctx.font = '20px "Noto Sans", sans-serif';
        ctx.textAlign = "left";
        ctx.fillStyle = "Red";
        ctx.textBaseline = "top";
        ctx.fillText("Health: ", margin, margin);
        ctx.fillStyle = "White";
        ctx.fillText(this.hero.health, 80, margin);

        ctx.fillStyle = "Orange";
        ctx.fillText("Armor: ", margin, 25);
        ctx.fillStyle = "White";
        ctx.fillText(this.hero.armor, 80, 25);

        if (this.hero.grenades.isEquipped()) {
            ctx.fillStyle = "Gray";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText("Grenades: ", margin, 45);
            ctx.fillStyle = "White";
            ctx.fillText(this.hero.grenades.getAmmo(), 110, 45);
        } else if (!this.hero.meleeEquipped) {
            ctx.fillStyle = "Gray";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText("Ammo: ", margin, 45);
            ctx.fillStyle = "White";
            ctx.fillText(this.hero.primaryWeapon.ammo, 80, 45);
        }

        ctx.textBaseline = "bottom";
        ctx.textAlign = "left";
        ctx.fillStyle = "Cyan";
        ctx.fillText("Exp: ", margin, this.game.surfaceHeight - margin - 25);
        ctx.fillStyle = "White";
        ctx.fillText(this.hero.exp.getExp(), margin + 50, this.game.surfaceHeight - margin - 25);

        ctx.fillStyle = "Black";
        ctx.fillText("Remaining Enemies: ", margin, this.game.surfaceHeight - margin);
        ctx.fillStyle = "White";
        ctx.fillText("" + this.game.getEnemyCount(), margin + 200, this.game.surfaceHeight - margin);

        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        if (this.isInIntermission) {
            ctx.fillStyle = "White";
            ctx.fillText("Shop is Available", this.game.surfaceWidth - margin, margin);
            ctx.fillText("Time Remaining: " + Math.ceil(this.intermissionLength -
                this.intermissionElapsedTime), this.game.surfaceWidth - margin, 25);
        } else {
            ctx.fillStyle = "White";
            ctx.fillText("Wave: " + this.wave, this.game.surfaceWidth - margin, margin);
            ctx.fillStyle = "White";
            ctx.fillText("Round: " + this.round, this.game.surfaceWidth - margin, 25);
        }

        if (this.hero.health === 0) {
            this.heroIsDead = true;
            this.gameOver(ctx);

            if (this.game.click != null) {
                let mouseX = this.game.click.x;
                let mouseY = this.game.click.y;
                let menuX = this.game.surfaceWidth / 2 - 200; // x-coordinates for buttons
                let restartX = this.game.surfaceWidth / 2 + 20;
                let buttonY = this.game.surfaceHeight / 2 + 40; 
                // Main Menu button function
                if (mouseX >= menuX && mouseX <= menuX + 200 && mouseY >= buttonY && mouseY <= buttonY + 50) { 
                    console.log("Main Menu button clicked");
                    this.reset(1);
    
                    
                // Rstart button function
                } else if (mouseX >= restartX && mouseX <= restartX + 200 && mouseY >= buttonY && mouseY <= buttonY + 50) { 
                    console.log("Reset button clicked");
                    this.reset(0);
                    
                };
            };
        }

        if (this.win) {
            this.endScreen(ctx);
        }
    };

    gameOver (ctx) {
        if (this.elapsedTime > 0) { // fade to black
            ctx.fillStyle = "Black";
            if (this.transparency < 1) { 
                this.transparency += 0.01;
            };
            ctx.globalAlpha = this.transparency;
            ctx.fillRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);

        };

        ctx.globalAlpha = 1;

        if (this.elapsedTime > 1) { // "Game Over" fade in
            ctx.font = '90px "Noto Serif"';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "Red";
            if (this.transparency2 < 1) {
                this.transparency2 += 0.01;
            }
            ctx.globalAlpha = this.transparency2;
            ctx.fillText("Game Over", this.game.surfaceWidth / 2, this.game.surfaceHeight / 2);
        };

        ctx.globalAlpha = 1;

        if (this.elapsedTime > 2.5) {

            let width = 200;
            let height = 50;
            let menuX = this.game.surfaceWidth / 2 - 200; // coordinates for buttons
            let restartX = this.game.surfaceWidth / 2 + 20;
            let buttonY = this.game.surfaceHeight / 2 + 40; 
            let buttonOffset = 4;

            //Main Menu button
            ctx.fillStyle = "White"; 
            ctx.fillRect(menuX, buttonY, width, height);
            ctx.fillStyle = "Gray";
            ctx.fillRect(menuX + buttonOffset, buttonY + buttonOffset, width - 2 * buttonOffset, height - 2 * buttonOffset);

            ctx.font = '30px "Noto Serif"';
            ctx.fillStyle = "Black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Main Menu", menuX + width / 2, buttonY + height / 2);
            ctx.font = '30px "Press Start 2P"';   


            //Restart button 
            ctx.fillStyle = "White"; 
            ctx.fillRect(restartX, buttonY, width, height);
            ctx.fillStyle = "Gray"; 
            ctx.fillRect(restartX + buttonOffset, buttonY + buttonOffset, width - 2 * buttonOffset, height - 2 * buttonOffset);

            ctx.font = '30px "Noto Serif"';
            ctx.fillStyle = "Black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Restart", restartX + width / 2, buttonY + height / 2);
            ctx.font = '30px "Press Start 2P"'; 
        };  
    };

    /**
     * Reset values.
     */
    reset(menu) {
        this.clearEntityArray();

        this.hero = new Hero(this.game, 50, 50);
        this.heroStartX = LEVELS.LEVEL_ONE.startX;
        this.heroStartY = LEVELS.LEVEL_ONE.startY;
        this.hero.x = this.heroStartX;
        this.hero.y = this.heroStartY;
        this.game.addEntity(this.hero);
        
        this.elapsedTime = 0;
        this.transparency = 0;
        this.transparency2 = 0;
        this.transparency3 = 0;
        this.level = 1;
        this.wave = 1;
        this.round = 1;
        this.heroIsDead = false;
        this.hudVisible = true;
        this.game.gameStart = false;

        if (menu) {
            let mainMenu = new StartMenu(this.game, this.level);
            this.game.addEntity(mainMenu);
            this.loadRound(this.level, this.wave, this.round);
        } else {
            this.game.gameStart = true;
            this.loadRound(this.level, this.wave, this.round);
        }

    };

    endScreen(ctx) {
        this.endTimer += this.game.clockTick;
        ctx.fillStyle = "Blue";
        if (this.transparency3 < 0.50) { 
            this.transparency3 += 0.005;
        };
        ctx.globalAlpha = this.transparency3;
        ctx.fillRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);

        ctx.fillStyle = "Cyan";
        ctx.fillRect( 10,  10, this.game.surfaceWidth - 20, this.game.surfaceHeight - 20);

        ctx.globalAlpha = 1;
        
        if (this.endTimer > 1) {
            let num = Math.floor(this.endTimer) % 2;
            ctx.fillStyle = "Black";
            ctx.font = '90px "Brush Script MT"';
            let str = "CONGRATULATIONS!";
            ctx.fillText(str, 900, 100);
            if (num) {
                ctx.fillStyle = "Blue";
            } else {
                ctx.fillStyle = "White";
            }
            ctx.fillText(str, 896, 96);
            ctx.font = '30px "Monaco"';
            let str2 = "As the last husk fell, there stood one hero";
            let str3 = "among the corpses. To preserve his story for"; 
            let str4 = "future generations the developers put a";
            let str5 = "  tupperware lid on it. Now all who wish"; 
            let str6 = "to live through this heroic story need only";
            let str7 = "open the fridge. Poggers."; 
            let str8 = "Thank you for playing!";

            ctx.fillStyle = "White"
            ctx.fillText(str2, 896, 196);
            ctx.fillText(str3, 896, 246);
            ctx.fillText(str4, 896, 296);
            ctx.fillText(str5, 896, 346);
            ctx.fillText(str6, 896, 396);
            ctx.fillText(str7, 896, 446);
            ctx.fillText(str8, 896, 546);
        }
    }
}