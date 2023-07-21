class Experience {
    constructor() {
        this.expCounter = 0;
    };

    // Returns player's current exp count. 
    getExp() {
        return this.expCounter;
    }

    // Subtracts the amount of exp cost for a bought item.
    spendExp(amount) {
        this.expCounter -= amount;
        if (this.expCounter < 0) {
            this.expCounter += amount;
        }
    }

    // Gives player 5 exp for killing a skeleton.
    zombieKill() {
        this.expCounter += 5;
    }

    // Gives player 10 exp for killing a skeleton.
    skeletonKill() {
        this.expCounter += 10;
    }

    // Gives player 15 exp for killing a witch.
    witchKill() {
        this.expCounter += 15;
    }

    // Gives player 100 exp for killing a dragon.
    dragonKill() {
        this.expCounter += 100;
    }
}