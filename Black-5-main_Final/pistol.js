class Pistol {
    constructor(game, isOwnedByHero, x, y, hero) {
        Object.assign(this, {game, isOwnedByHero, x, y, hero});

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/pistol.png");

        // weapon states
        this.state = 0; // 0 = not equipped, 1 = secondary weapon,
        // 2 = primary weapon uncocked, 3 = primary weapon cocked, 4 = primary weapon firing
        this.facing = 0; // 0 = east, 1 = north, 2 = west, 3 = south

        this.attackDamage = 30;
        this.attackDamageIncrease = 5; // attack damage increase per upgrade
        this.attackDamageUpgradeLevel = 0;
        this.attackDamageMaxUpgradeLevel = 3;
        this.attackDamageUpgradeCost = 250;
        this.maxAttackDamage = 45;

        this.ammo = 50; // number of bullets
        this.ammoUnit = 15; // number of bullets the player can buy at once
        this.maxAmmo = 100;
        this.ammoUnitCost = 25;

        this.range = 0; // infinite range

        this.weaponCost = 500;

        this.attacking = false; // true if this pistol is firing
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
            if (isOnHeroTeam) ASSET_MANAGER.playAsset("./sounds/pistol.mp3");
            let bulletX;
            let bulletY;
            if (this.facing === 0) { // east
                bulletX = this.x + 35;
                bulletY = this.y + 7;
            } else if (this.facing === 1) { // north
                bulletX = this.x + 7;
                bulletY = this.y;
            } else if (this.facing === 2) { // west
                bulletX = this.x;
                bulletY = this.y + 7;
            } else { // south
                bulletX = this.x + 7;
                bulletY = this.y + 35;
            }
            let bullet = new Bullet(this.game, this.targetX, this.targetY, isOnHeroTeam, this.attackDamage, this.range, bulletX, bulletY);
            this.game.addEntity(bullet);
            this.state = 4;
            this.ammo--;
            this.attacking = false;
            this.elapsedTime = 0;
        }

        if (!this.attacking && this.state === 4) {
            this.state = 2;
        }

        if (this.state === 2 && this.elapsedTime >= this.reloadSpeed) {
            this.state = 3;
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

        // primary weapon uncocked
        // east
        this.animations[2][0] = new Animator(this.spritesheet, 198, 64, 36, 21, 1, 0.15, 0, false, true);
        // north
        this.animations[2][1] = new Animator(this.spritesheet, 207, 155, 21, 36, 1, 0.15, 0, false, true);
        // west
        this.animations[2][2] = new Animator(this.spritesheet, 201, 16, 36, 21, 1, 0.15, 0, false, true);
        // south
        this.animations[2][3] = new Animator(this.spritesheet, 200, 100, 21, 36, 1, 0.15, 0, false, true);

        // primary weapon cocked
        // east
        this.animations[3][0] = new Animator(this.spritesheet, 7, 61, 36, 22, 1, 0.15, 0, false, true);
        // north
        this.animations[3][1] = new Animator(this.spritesheet, 12, 154, 22, 36, 1, 0.15, 0, false, true);
        // west
        this.animations[3][2] = new Animator(this.spritesheet, 8, 15, 36, 22, 1, 0.15, 0, false, true);
        // south
        this.animations[3][3] = new Animator(this.spritesheet, 12, 103, 22, 36, 1, 0.15, 0, false, true);

        // primary weapon firing
        // east
        this.animations[4][0] = new Animator(this.spritesheet, 96, 62, 48, 21, 1, 0.15, 0, false, true);
        // north
        this.animations[4][1] = new Animator(this.spritesheet, 108, 152, 21, 48, 1, 0.15, 0, false, true);
        // west
        this.animations[4][2] = new Animator(this.spritesheet, 93, 16, 48, 21, 1, 0.15, 0, false, true);
        // south
        this.animations[4][3] = new Animator(this.spritesheet, 101, 97, 21, 48, 1, 0.15, 0, false, true);
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    updateX(ownerX) {
        // this.x = ownerX + ownerOffset + pistolOffset
        let playerOffset;
        let pistolOffset;
        if (this.facing === 0) { // east
            playerOffset = 10;
            pistolOffset = 0;
        } else if (this.facing === 1) { // north
            playerOffset = 13;
            pistolOffset = -15;
        } else if (this.facing === 2) { // west
            playerOffset = 13;
            if (this.state === 4) {
                pistolOffset = -47;
            }// firing
            else {
                pistolOffset = -35;
            } // not firing
        } else { // south
            playerOffset = 5;
            pistolOffset = -15;
        }
        this.x = ownerX + playerOffset + pistolOffset;
    }

    updateY(ownerY) {
        // this.y = ownerY + ownerOffset + pistolOffset
        let playerOffset;
        let pistolOffset;
        if (this.facing === 0) { // east
            playerOffset = 28;
            pistolOffset = -15;
        } else if (this.facing === 1) { // north
            playerOffset = 30;
            if (this.state === 4) {
                pistolOffset = -35;
            }// firing
            else {
                pistolOffset = -26;
            } // not firing
        } else if (this.facing === 2) { // west
            playerOffset = 28;
            pistolOffset = -15;
        } else { // south
            playerOffset = 31;
            pistolOffset = -10;
        }
        this.y = ownerY + playerOffset + pistolOffset;
    }

    attack(specificTargetExists, targetX = 0, targetY = 0) {
        this.attacking = true;
        if (specificTargetExists) {
            this.targetX = targetX;
            this.targetY = targetY;
        } else {
            if (this.facing == 0) { // east
                this.targetX = this.x + 35 + 1;
                this.targetY = this.y + 7;
            } else if (this.facing == 1) { // north
                this.targetX = this.x + 7;
                this.targetY = this.y - 1;
            } else if (this.facing == 2) { // west
                this.targetX = this.x - 1;
                this.targetY = this.y + 7;
            } else { // south
                this.targetX = this.x + 7;
                this.targetY = this.y + 35 + 1;
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
            this.hero.exp.getExp() >= this.attackDamageUpgradeCost && this.hero.hasPistol;
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
            this.hero.exp.getExp() >= this.reloadSpeedUpgradeCost && this.hero.hasPistol;
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
            this.hero.exp.getExp() >= this.ammoUnitCost && this.hero.hasPistol;
    }

    buy() {
        if (this.canBuy()) {
            this.hero.equipPistol();
            this.hero.exp.expCounter -= this.weaponCost;
        }
    }

    canBuy() {
        return this.hero.exp.getExp() >= this.weaponCost && !this.hero.hasPistol;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

}