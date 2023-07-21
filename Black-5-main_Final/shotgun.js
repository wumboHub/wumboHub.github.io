class Shotgun {
    constructor(game, isOwnedByHero, x, y, hero) {
        Object.assign(this, { game, isOwnedByHero, x, y, hero });

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/shotgun.png");

        // weapon states
        this.state = 0 // 0 = not equipped, 1 = secondary weapon, 
        // 2 = primary weapon not firing, 3 = primary weapon firing
        this.facing = 0 // 0 = east, 1 = north, 2 = west, 3 = south

        this.attackDamage = 15;
        this.attackDamageIncrease = 5; // attack damage increase per upgrade
        this.attackDamageUpgradeLevel = 0;
        this.attackDamageMaxUpgradeLevel = 3;
        this.attackDamageUpgradeCost = 250;
        this.maxAttackDamage = 30;

        this.ammo = 50; // number of shots
        this.ammoUnit = 15; // number of shots the player can buy at once
        this.maxAmmo = 100;
        this.ammoUnitCost = 30;

        this.range = 150;

        this.weaponCost = 600;

        this.attacking = false; // true if this shotgun is firing
        this.targetX = 0;
        this.targetY = 0;

        this.reloadSpeed = 1; // minimum time between shots
        this.reloadSpeedUpgradeLevel = 0;
        this.reloadSpeedDecrease = 0.15; // percentage
        this.reloadSpeedMaxUpgradeLevel = 3;
        this.reloadSpeedUpgradeCost = 250;
        this.maxReloadSpeed = this.reloadSpeed;

        this.elapsedTime = 0; // elapsed time since last attack

        this.updateBB();

        this.animations = [];
        this.loadAnimations();
    };

    update() {
        this.elapsedTime += this.game.clockTick;
        if (this.attacking && this.elapsedTime >= this.reloadSpeed && this.ammo > 0) {
            let isOnHeroTeam = this.isOwnedByHero;

            let bulletX;
            let bulletY;
            if (this.facing == 0) { // east
                bulletX = this.x + 35;
                bulletY = this.y + 7;
            } else if (this.facing == 1) { // north
                bulletX = this.x + 7;
                bulletY = this.y;
            } else if (this.facing == 2) { // west
                bulletX = this.x;
                bulletY = this.y + 7;
            } else { // south
                bulletX = this.x + 7;
                bulletY = this.y + 35;
            }

            // 7.5 degrees
            let angle7p5 = 0.1308997;
            // 15 degrees
            let angle15 = 0.2617994;
            // Sets the origin to the shotgun's position
            let newTargetX = this.targetX - this.x;
            let newTargetY = this.targetY - this.y;
            // Finds the new rotated coordinates relative to the shotgun
            let rotatedTarget7p5X1 = newTargetX * Math.cos(angle7p5) - newTargetY * Math.sin(angle7p5);
            let rotatedTarget7p5Y1 = newTargetX * Math.sin(angle7p5) + newTargetY * Math.cos(angle7p5);
            let rotatedTarget7p5X2 = newTargetX * Math.cos(-angle7p5) - newTargetY * Math.sin(-angle7p5);
            let rotatedTarget7p5Y2 = newTargetX * Math.sin(-angle7p5) + newTargetY * Math.cos(-angle7p5);
            let rotatedTarget15X1 = newTargetX * Math.cos(angle15) - newTargetY * Math.sin(angle15);
            let rotatedTarget15Y1 = newTargetX * Math.sin(angle15) + newTargetY * Math.cos(angle15);
            let rotatedTarget15X2 = newTargetX * Math.cos(-angle15) - newTargetY * Math.sin(-angle15);
            let rotatedTarget15Y2 = newTargetX * Math.sin(-angle15) + newTargetY * Math.cos(-angle15);
            // Sets the origin back to the map's origin
            rotatedTarget7p5X1 += this.x;
            rotatedTarget7p5Y1 += this.y;
            rotatedTarget7p5X2 += this.x;
            rotatedTarget7p5Y2 += this.y;
            rotatedTarget15X1 += this.x;
            rotatedTarget15Y1 += this.y;
            rotatedTarget15X2 += this.x;
            rotatedTarget15Y2 += this.y;
            let bullet1 = new Bullet(this.game, rotatedTarget15X1, rotatedTarget15Y1, isOnHeroTeam, this.attackDamage, this.range, bulletX, bulletY);
            let bullet2 = new Bullet(this.game, rotatedTarget7p5X1, rotatedTarget7p5Y1, isOnHeroTeam, this.attackDamage, this.range, bulletX, bulletY);
            let bullet3 = new Bullet(this.game, this.targetX, this.targetY, isOnHeroTeam, this.attackDamage, this.range, bulletX, bulletY);
            let bullet4 = new Bullet(this.game, rotatedTarget7p5X2, rotatedTarget7p5Y2, isOnHeroTeam, this.attackDamage, this.range, bulletX, bulletY);
            let bullet5 = new Bullet(this.game, rotatedTarget15X2, rotatedTarget15Y2, isOnHeroTeam, this.attackDamage, this.range, bulletX, bulletY);
            this.game.addEntity(bullet1);
            this.game.addEntity(bullet2);
            this.game.addEntity(bullet3);
            this.game.addEntity(bullet4);
            this.game.addEntity(bullet5);

            this.state = 3;
            this.ammo--;
            this.attacking = false;
            this.elapsedTime = 0;
        }

        if (!this.attacking && this.state == 3) {
            this.state = 2;
        }

        this.updateBB();
    };

    draw(ctx) {
        //this.animations[this.action][this.facing].drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    };

    getAnimation() {
        return this.animations[this.state][this.facing];
    }

    loadAnimations() {
        for (let i = 0; i < 5; i++) { // five visible states
            this.animations.push([]);
            for (i = 0; i < 4; i++) { // four directions
                this.animations.push([]);
            }
        }

        //not equipped
        this.animations[0][0] = null;
        this.animations[0][1] = null;
        this.animations[0][2] = null;
        this.animations[0][3] = null;

        // secondary weapon
        // east
        this.animations[1][0] = null;
        // north
        this.animations[1][1] = null;
        // west
        this.animations[1][2] = null;
        // south
        this.animations[1][3] = null;

        // primary weapon not firing
        // east
        this.animations[2][0] = new Animator(this.spritesheet, 9, 56, 43, 16, 1, 0.15, 0, false, true);
        // north
        this.animations[2][1] = new Animator(this.spritesheet, 22, 142, 16, 43, 1, 0.15, 0, false, true);
        // west
        this.animations[2][2] = new Animator(this.spritesheet, 8, 19, 43, 16, 1, 0.15, 0, false, true);
        // south
        this.animations[2][3] = new Animator(this.spritesheet, 22, 87, 16, 43, 1, 0.15, 0, false, true);

        // primary weapon firing
        // east
        this.animations[3][0] = new Animator(this.spritesheet, 95, 55, 55, 17, 1, 0.15, 0, false, true);
        // north
        this.animations[3][1] = new Animator(this.spritesheet, 112, 146, 17, 55, 1, 0.15, 0, false, true);
        // west
        this.animations[3][2] = new Animator(this.spritesheet, 93, 18, 55, 17, 1, 0.15, 0, false, true);
        // south
        this.animations[3][3] = new Animator(this.spritesheet, 112, 86, 17, 55, 1, 0.15, 0, false, true);
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    updateX(ownerX) {
        // this.x = ownerX + ownerOffset + shotgunOffset
        let playerOffset;
        let shotgunOffset;
        if (this.facing == 0) { // east
            playerOffset = 10;
            shotgunOffset = 0;
        } else if (this.facing == 1) { // north
            playerOffset = 13;
            shotgunOffset = -11;
        } else if (this.facing == 2) { // west
            playerOffset = 13;
            if (this.state == 3) shotgunOffset = -46; // firing
            else shotgunOffset = -34; // not firing
        } else { // south
            playerOffset = 5;
            shotgunOffset = -11;
        }
        this.x = ownerX + playerOffset + shotgunOffset;
    }

    updateY(ownerY) {
        // this.y = ownerY + ownerOffset + shotgunOffset
        let playerOffset;
        let shotgunOffset;
        if (this.facing == 0) { // east
            playerOffset = 28;
            shotgunOffset = -10;
        } else if (this.facing == 1) { // north
            playerOffset = 30;
            if (this.state == 3) shotgunOffset = -46; // firing
            else shotgunOffset = -34 // not firing
        } else if (this.facing == 2) { // west
            playerOffset = 28;
            shotgunOffset = -11;
        } else { // south
            playerOffset = 31;
            shotgunOffset = -8;
        }
        this.y = ownerY + playerOffset + shotgunOffset;
    }

    attack(specificTargetExists, targetX = 0, targetY = 0) {
        this.attacking = true;
        if (specificTargetExists) {
            this.targetX = targetX;
            this.targetY = targetY;
        } else {
            let targetDistance = 25;
            if (this.facing == 0) { // east
                this.targetX = this.x + 35 + targetDistance;
                this.targetY = this.y + 7;
            } else if (this.facing == 1) { // north
                this.targetX = this.x + 7;
                this.targetY = this.y - targetDistance;
            } else if (this.facing == 2) { // west
                this.targetX = this.x - targetDistance;
                this.targetY = this.y + 7;
            } else { // south
                this.targetX = this.x + 7;
                this.targetY = this.y + 35 + targetDistance;
            }
        }
    }

    setNotEquipped() {
        this.state = 0;
    }

    setSecondaryWeapon() {
        this.state = 1;
    }

    setPrimaryWeapon() {
        this.state = 2;
    }

    updateFacing(newFacing) {
        this.facing = newFacing;
    }

    upgradeAttackDamage() {
        if (this.canUpgradeAttackDamage()) {
            this.attackDamage += this.attackDamageIncrease;
            this.attackDamageUpgradeLevel++;
            this.hero.exp.expCounter -= this.attackDamageUpgradeCost;
        }
    }

    getAttackDamageUpgradeLevel() {
        return this.attackDamageUpgradeLevel;
    }

    canUpgradeAttackDamage() {
        return this.attackDamageUpgradeLevel < this.attackDamageMaxUpgradeLevel && 
        this.hero.exp.getExp() >= this.attackDamageUpgradeCost && this.hero.hasShotgun;
    }

    upgradeReloadSpeed() {
        if (this.canUpgradeReloadSpeed()) {
            this.reloadSpeed = (this.reloadSpeed * (1 - this.reloadSpeedDecrease)).toFixed(2);
            this.reloadSpeedUpgradeLevel++;
            this.hero.exp.expCounter -= this.reloadSpeedUpgradeCost;
        }
    }

    getReloadSpeedUpgradeLevel() {
        return this.reloadSpeedUpgradeLevel;
    }

    canUpgradeReloadSpeed() {
        return this.reloadSpeedUpgradeLevel < this.reloadSpeedMaxUpgradeLevel && 
        this.hero.exp.getExp() >= this.reloadSpeedUpgradeCost && this.hero.hasShotgun;
    }

    getAmmo() {
        return this.ammo;
    }

    addAmmo() {
        if (this.canAddAmmo()) {
            this.ammo += this.ammoUnit;
            this.hero.exp.expCounter -= this.ammoUnitCost;
        }
    }

    getAmmoUnit() {
        return this.ammoUnit;
    }

    canAddAmmo() {
        return this.ammo <= this.maxAmmo - this.ammoUnit && 
        this.hero.exp.getExp() >= this.ammoUnitCost && this.hero.hasShotgun;
    }

    buy() {
        if (this.canBuy()) {
            this.hero.equipShotgun();
            this.hero.exp.expCounter -= this.weaponCost;
        }
    }

    canBuy() {
        return this.hero.exp.getExp() >= this.weaponCost && !this.hero.hasShotgun;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

}