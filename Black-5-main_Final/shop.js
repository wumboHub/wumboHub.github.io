class Shop {
    constructor(game, hero) {
        Object.assign(this, { game, hero });

        this.sword = this.hero.sword;
        this.crossbow = this.hero.crossbow;
        this.pistol = this.hero.pistol;
        this.shotgun = this.hero.shotgun;
        this.grenades = this.hero.grenades;

        this.initialize(this);
    }

    initialize(that) {
        $("#shop").keydown(function(event) {
            if (event.code == "KeyT") {
                that.toggle();
            }
            console.log("shop key event");
        });

        $("#swordButton").click(function() {
            if ($("swordTab").css("display") != "block") {
                $(".tab").css("display", "none");
                $("#swordTab").css("display", "block");
            }
        });
    
        $("#crossbowButton").click(function() {
            if ($("crossbowTab").css("display") != "block") {
                $(".tab").css("display", "none");
                $("#crossbowTab").css("display", "block");
            }
        });
    
        $("#pistolButton").click(function() {
            if ($("pistolTab").css("display") != "block") {
                $(".tab").css("display", "none");
                $("#pistolTab").css("display", "block");
            }
        });
    
        $("#shotgunButton").click(function() {
            if ($("shotgunTab").css("display") != "block") {
                $(".tab").css("display", "none");
                $("#shotgunTab").css("display", "block");
            }
        });

        $("#grenadeButton").click(function() {
            if ($("grenadeTab").css("display") != "block") {
                $(".tab").css("display", "none");
                $("#grenadeTab").css("display", "block");
            }
        });

        $("#swordAttackDamageUpgradeButton").click(function() {
            that.sword.upgradeAttackDamage();
            that.updateValues();
        });

        $("#crossbowAttackDamageUpgradeButton").click(function() {
            that.crossbow.upgradeAttackDamage();
            that.updateValues();
        });

        
        $("#pistolAttackDamageUpgradeButton").click(function() {
            that.pistol.upgradeAttackDamage();
            that.updateValues();
        });

        $("#shotgunAttackDamageUpgradeButton").click(function() {
            that.shotgun.upgradeAttackDamage();
            that.updateValues();
        });

        $("#crossbowReloadSpeedUpgradeButton").click(function() {
            that.crossbow.upgradeReloadSpeed();
            that.updateValues();
        });

        $("#pistolReloadSpeedUpgradeButton").click(function() {
            that.pistol.upgradeReloadSpeed();
            that.updateValues();
        });

        $("#shotgunReloadSpeedUpgradeButton").click(function() {
            that.shotgun.upgradeReloadSpeed();
            that.updateValues();
        });

        $("#crossbowAmmoButton").click(function() {
            that.crossbow.addAmmo();
            that.updateValues();
        });

        $("#pistolAmmoButton").click(function() {
            that.pistol.addAmmo();
            that.updateValues();
        });

        $("#shotgunAmmoButton").click(function() {
            that.shotgun.addAmmo();
            that.updateValues();
        });

        $("#grenadeAmmoButton").click(function() {
            that.grenades.addAmmo();
            that.updateValues();
        });

        $("#pistolBuyButton").click(function() {
            that.pistol.buy();
            that.updateValues();
        });

        $("#shotgunBuyButton").click(function() {
            that.shotgun.buy();
            that.updateValues();
        });

        $("#grenadeBuyButton").click(function() {
            that.grenades.buy();
            that.updateValues();
        });
    }

    updateValues() {
        this.sword = this.hero.sword;
        this.crossbow = this.hero.crossbow;
        this.pistol = this.hero.pistol;
        this.shotgun = this.hero.shotgun;
        this.grenades = this.hero.grenades;

        $(".currentExperience").html(this.hero.exp.getExp());

        $(".swordCost").html(this.sword.weaponCost);
        $(".swordAttackDamage").html(this.sword.attackDamage);
        $("#swordAttackDamageMeter").prop("value", this.sword.attackDamage);
        $("#swordAttackDamageMeter").prop("max", this.sword.maxAttackDamage);
        $(".swordAttackDamageUpgradeCost").html(this.sword.attackDamageUpgradeCost);
    
        $(".crossbowCost").html(this.crossbow.weaponCost);
        $(".crossbowAttackDamage").html(this.crossbow.attackDamage);
        $("#crossbowAttackDamageMeter").prop("value", this.crossbow.attackDamage);
        $("#crossbowAttackDamageMeter").prop("max", this.crossbow.maxAttackDamage);
        $(".crossbowAttackDamageUpgradeCost").html(this.crossbow.attackDamageUpgradeCost);
        $(".crossbowReloadSpeedUpgradeCost").html(this.crossbow.reloadSpeedUpgradeCost);
        $(".crossbowReloadSpeed").html(this.crossbow.reloadSpeed);
        $("#crossbowReloadSpeedMeter").prop("value", this.crossbow.reloadSpeed);
        $("#crossbowReloadSpeedMeter").prop("max", this.crossbow.maxReloadSpeed);
        $(".crossbowAmmo").html(this.crossbow.ammo);
        $("#crossbowAmmoMeter").prop("value", this.crossbow.ammo);
        $("#crossbowAmmoMeter").prop("max", this.crossbow.maxAmmo);
        $(".crossbowAmmoUnit").html(this.crossbow.getAmmoUnit());
        $(".crossbowAmmoUnitCost").html(this.crossbow.ammoUnitCost);
    
        $(".pistolCost").html(this.pistol.weaponCost);
        $(".pistolAttackDamage").html(this.pistol.attackDamage);
        $("#pistolAttackDamageMeter").prop("value", this.pistol.attackDamage);
        $("#pistolAttackDamageMeter").prop("max", this.pistol.maxAttackDamage);
        $(".pistolAttackDamageUpgradeCost").html(this.pistol.attackDamageUpgradeCost);
        $(".pistolReloadSpeedUpgradeCost").html(this.pistol.reloadSpeedUpgradeCost);
        $(".pistolReloadSpeed").html(this.pistol.reloadSpeed);
        $("#pistolReloadSpeedMeter").prop("value", this.pistol.reloadSpeed);
        $("#pistolReloadSpeedMeter").prop("max", this.pistol.maxReloadSpeed);
        $(".pistolAmmo").html(this.pistol.ammo);
        $("#pistolAmmoMeter").prop("value", this.pistol.ammo);
        $("#pistolAmmoMeter").prop("max", this.pistol.maxAmmo);
        $(".pistolAmmoUnit").html(this.pistol.getAmmoUnit());
        $(".pistolAmmoUnitCost").html(this.pistol.ammoUnitCost);
    
        $(".shotgunCost").html(this.shotgun.weaponCost);
        $(".shotgunAttackDamage").html(this.shotgun.attackDamage);
        $("#shotgunAttackDamageMeter").prop("value", this.shotgun.attackDamage);
        $("#shotgunAttackDamageMeter").prop("max", this.shotgun.maxAttackDamage);
        $(".shotgunAttackDamageUpgradeCost").html(this.shotgun.attackDamageUpgradeCost);
        $(".shotgunReloadSpeedUpgradeCost").html(this.shotgun.reloadSpeedUpgradeCost);
        $(".shotgunReloadSpeed").html(this.shotgun.reloadSpeed);
        $("#shotgunReloadSpeedMeter").prop("value", this.shotgun.reloadSpeed);
        $("#shotgunReloadSpeedMeter").prop("max", this.shotgun.maxReloadSpeed);
        $(".shotgunAmmo").html(this.shotgun.ammo);
        $("#shotgunAmmoMeter").prop("value", this.shotgun.ammo);
        $("#shotgunAmmoMeter").prop("max", this.shotgun.maxAmmo);
        $(".shotgunAmmoUnit").html(this.shotgun.getAmmoUnit());
        $(".shotgunAmmoUnitCost").html(this.shotgun.ammoUnitCost);

        $(".grenadeCost").html(this.grenades.weaponCost);
        $(".grenadeAmmo").html(this.grenades.ammo);
        $("#grenadeAmmoMeter").prop("value", this.grenades.ammo);
        $("#grenadeAmmoMeter").prop("max", this.grenades.maxAmmo);
        $(".grenadeAmmoUnit").html(this.grenades.getAmmoUnit());
        $(".grenadeAmmoUnitCost").html(this.grenades.ammoUnitCost);

        $("#swordAttackDamageUpgradeButton").prop("disabled", !this.sword.canUpgradeAttackDamage());
        $("#crossbowAttackDamageUpgradeButton").prop("disabled", !this.crossbow.canUpgradeAttackDamage());
        $("#pistolAttackDamageUpgradeButton").prop("disabled", !this.pistol.canUpgradeAttackDamage());
        $("#shotgunAttackDamageUpgradeButton").prop("disabled", !this.shotgun.canUpgradeAttackDamage());

        $("#crossbowReloadSpeedUpgradeButton").prop("disabled", !this.crossbow.canUpgradeReloadSpeed());
        $("#pistolReloadSpeedUpgradeButton").prop("disabled", !this.pistol.canUpgradeReloadSpeed());
        $("#shotgunReloadSpeedUpgradeButton").prop("disabled", !this.shotgun.canUpgradeReloadSpeed());

        $("#crossbowAmmoButton").prop("disabled", !this.crossbow.canAddAmmo());
        $("#pistolAmmoButton").prop("disabled", !this.pistol.canAddAmmo());
        $("#shotgunAmmoButton").prop("disabled", !this.shotgun.canAddAmmo());
        $("#grenadeAmmoButton").prop("disabled", !this.grenades.canAddAmmo());

        $("#pistolBuyButton").prop("disabled", !this.pistol.canBuy());
        $("#shotgunBuyButton").prop("disabled", !this.shotgun.canBuy());
        $("#grenadeBuyButton").prop("disabled", !this.grenades.canBuy());
    }

    open() {
        this.updateValues();

        $("#shop").css("display", "block");

        $(".tab").css("display", "none");
        $("#swordTab").css("display", "block");

        $("#shop").focus();

        this.game.shopIsOpen = true;
    }

    close() {
        $("#shop").css("display", "none");

        $("#gameWorld").focus();

        this.game.shopIsOpen = false;
    }

    toggle() {
        if (this.game.shopIsOpen) {
            this.close();
        } else {
            this.open();
        }
    }
}