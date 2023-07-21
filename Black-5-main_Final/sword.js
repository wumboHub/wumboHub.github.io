class Sword {
    constructor(game, x, y, hero) {
        Object.assign(this, {game, x, y, hero});

        // sprite sheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/sword.png");

        // weapon states
        this.state = 0; // 0 = not equipped, 1 = secondary weapon, 2 = primary weapon, 3 = attacking
        this.facing = 0; // 0 = east, 1 = north, 2 = west, 3 = south

        this.attackAnimationDuration = 0.10;
        this.attackAnimationElapsedTime = 0;
        this.attacking = false;

        this.attackDamage = 35;
        this.attackDamageIncrease = 5; // attack damage increase per upgrade
        this.attackDamageUpgradeLevel = 0;
        this.attackDamageMaxUpgradeLevel = 3;
        this.attackDamageUpgradeCost = 150;
        this.maxAttackDamage = 50;

        this.weaponCost = 0;

        this.attackCooldown = 0.5; // seconds between attacks
        this.elapsedTime = 0; // seconds since last attack

        this.width = 44;
        this.height = 44;
        this.hiltX = this.x; // Location of the sword's hilt
        this.hiltY = this.y + this.height; // Location of the sword's hilt

        this.updateBB();

        this.animations = [];
        this.loadAnimations();
    };

    update() {
        this.elapsedTime += this.game.clockTick;
        if (this.attacking && this.elapsedTime >= this.attackCooldown) {
            ASSET_MANAGER.playAsset("./sounds/sword.mp3");
            var that = this;
            this.game.entities.forEach(function (entity) {
                if (entity instanceof Zombie || entity instanceof Skeleton ||
                    entity instanceof Witch || entity instanceof Dragon) {
                    let distance = Math.sqrt((that.hiltX - entity.getX()) * (that.hiltX -
                        entity.getX()) + (that.hiltY - entity.getY()) * (that.hiltY - entity.getY()));

                    if (that.facing === 0 && that.hiltX <= entity.getX() && distance <= 100) { // east
                        entity.takeDamage(that.attackDamage, 25, entity.getX() - that.hiltX, entity.getY() - that.hiltY);
                        that.elapsedTime = 0;
                    } else if (that.facing === 1 && that.hiltY >= entity.getY() && distance <= 100) { // north
                        entity.takeDamage(that.attackDamage, 25, entity.getX() - that.hiltX, entity.getY() - that.hiltY);
                        that.elapsedTime = 0;
                    } else if (that.facing === 2 && that.hiltX >= entity.getX() && distance <= 100) { // west
                        entity.takeDamage(that.attackDamage, 25, entity.getX() - that.hiltX, entity.getY() - that.hiltY);
                        that.elapsedTime = 0;
                    } else if (that.facing === 3 && that.hiltY <= entity.getY() && distance <= 100) { // south
                        entity.takeDamage(that.attackDamage, 25, entity.getX() - that.hiltX, entity.getY() - that.hiltY);
                        that.elapsedTime = 0;
                    }
                }
            });
            this.attacking = false;
            this.state = 3;
        }

        if (this.state === 3) {
            this.attackAnimationElapsedTime += this.game.clockTick;
            if (this.attackAnimationElapsedTime >= this.attackAnimationDuration) {
                this.state = 2;
                this.attackAnimationElapsedTime = 0;
            }
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
        for (let i = 0; i < 3; i++) { // three visible states
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
        this.animations[1][0] = new Animator(this.spritesheet, 7, 71, 44, 44, 1, 0.15, 0, false, true);
        // north
        this.animations[1][1] = new Animator(this.spritesheet, 4, 16, 44, 44, 1, 0.15, 0, false, true);
        // west
        this.animations[1][2] = new Animator(this.spritesheet, 4, 16, 44, 44, 1, 0.15, 0, false, true);
        // south
        this.animations[1][3] = new Animator(this.spritesheet, 5, 192, 44, 44, 1, 0.15, 0, false, true);

        // primary weapon
        // east
        this.animations[2][0] = new Animator(this.spritesheet, 148, 71, 44, 44, 1, 0.15, 0, false, true);
        // north
        this.animations[2][1] = new Animator(this.spritesheet, 154, 11, 44, 44, 1, 0.15, 0, false, true);
        // west
        this.animations[2][2] = new Animator(this.spritesheet, 154, 11, 44, 44, 1, 0.15, 0, false, true);
        // south
        this.animations[2][3] = new Animator(this.spritesheet, 150, 191, 44, 44, 1, 0.15, 0, false, true);

        // attacking
        // east
        this.animations[3][0] = new Animator(this.spritesheet, 60, 67, 44, 50, 1, 0.15, 0, false, true);
        // north
        this.animations[3][1] = new Animator(this.spritesheet, 58, 5, 44, 50, 1, 0.15, 0, false, true);
        // west
        this.animations[3][2] = new Animator(this.spritesheet, 58, 5, 44, 50, 1, 0.15, 0, false, true);
        // south
        this.animations[3][3] = new Animator(this.spritesheet, 59, 194, 50, 44, 1, 0.15, 0, false, true);
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    updateX(playerX) {
        // this.x = playerX + playerOffset + swordOffset
        if (this.facing === 0) { // east
            this.x = playerX + 9;
            this.hiltX = playerX + 9;
        } else if (this.facing === 1) { // north
            this.x = playerX + 20 - this.width;
            this.hiltX = playerX + 20;
        } else if (this.facing === 2) { // west
            this.x = playerX + 13 - this.width;
            this.hiltX = playerX + 13;
        } else { // south
            this.x = playerX + 4;
            this.hiltX = playerX + 4;
        }
    }

    updateY(playerY) {
        // this.y = playerY + playerOffset + swordOffset
        if (this.facing === 0) { // east
            this.y = playerY + 33 - this.height;
            this.hiltY = playerY + 33;
        } else if (this.facing === 1) { // north
            this.y = playerY + 32 - this.height;
            this.hiltY = playerY + 32;
        } else if (this.facing === 2) { // west
            this.y = playerY + 33 - this.height;
            this.hiltY = playerY + 32;
        } else { // south
            this.y = playerY + 32;
            this.hiltY = playerY + 32;
        }
    }

    attack(specificTargetExists, targetX, targetY) {
        this.attacking = true;
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
            this.hero.exp.getExp() >= this.attackDamageUpgradeCost && this.hero.hasSword;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

}