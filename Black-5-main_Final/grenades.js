class Grenades {
    constructor(game, hero) {
        Object.assign(this, { game, hero });

        this.range = 200;

        this.weaponCost = 150;

        this.ammo = 0; // number of grenades
        this.ammoUnit = 1; // number of grenades the player can buy at once
        this.maxAmmo = 3;
        this.ammoUnitCost = 50;

        this.equipped = false;
    }

    update() {
        if (this.game.toggleGrenade) {
            if (this.ammo > 0 && !this.equipped && this.hero.hasGrenades) {
                this.equipped = true;
            } else if (this.equipped) {
                this.equipped = false;
            }
            this.game.toggleGrenade = false;
        }
        if (this.equipped && this.game.click != null) {
            let heroX = this.hero.getX() + this.hero.width / 2;
            let heroY = this.hero.getY() + this.hero.height / 2;
            let gameX = this.game.click.x + this.game.camera.x;
            let gameY = this.game.click.y + this.game.camera.y;
            let distance = Math.sqrt((heroX - gameX) * (heroX - gameX) + (heroY - gameY) * (heroY - gameY));
            if (distance <= this.range) {
                let grenade = new Grenade(this.game, gameX, gameY, this.hero);
                this.game.addEntity(grenade);
                this.ammo--;
                this.equipped = false;
            }
            this.game.click = null;
        }
    }

    draw(ctx) {
        if (this.equipped) {
            let heroX = this.hero.getX() + this.hero.width / 2;
            let heroY = this.hero.getY() + this.hero.height / 2;

            let drawX = heroX - this.game.camera.x;
            let drawY = heroY - this.game.camera.y;
            ctx.strokeStyle = "rgb(253, 165, 15)";
            ctx.lineWidth = 1;
            ctx.setLineDash([20, 10]);
            ctx.beginPath();
            ctx.arc(drawX, drawY, this.range, 0, 2 * Math.PI);
            ctx.stroke();
        }
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
        this.hero.exp.getExp() >= this.ammoUnitCost && this.hero.hasGrenades;
    }

    buy() {
        if (this.canBuy()) {
            this.hero.equipGrenades();
            this.hero.exp.expCounter -= this.weaponCost;
        }
    }

    canBuy() {
        return this.hero.exp.getExp() >= this.weaponCost && !this.hero.hasGrenades;
    }

    isEquipped() {
        return this.equipped;
    }
}