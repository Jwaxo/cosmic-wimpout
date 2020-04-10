/**
 * Information and methods related to different rules for Cosmic Wimpout.
 *
 * This is only an abstract; different sets of rules should be defined in
 * src/plugins/rules, and extend this functionality.
 */

let Wimpout;

class RulesAbstract {

  constructor(cosmic) {
    this.type = null;
    this.dice_types = [];
    this.max_score = null;

    Wimpout = cosmic;

    if (new.target === RulesAbstract) {
      throw new TypeError("Cannot construct Abstract classes directly.");
    }
  }

  getType() {
    if (this.type === null) {
      throw new TypeError(this.constructor.name + " does not initialize type property.");
    }
    return this.type;
  }
  getDiceTypes() {
    if (this.dice_types === {}) {
      throw new TypeError(this.constructor.name + " does not initialize dice_types property.");
    }
    return this.dice_types;
  }
  getMaxScore() {
    if (this.max_score === null) {
      throw new TypeError(this.constructor.name + " does not initialize max_score property.");
    }
    return this.max_score;
  }

  generateDice() {
    const dice = [];
    const dice_types = this.getDiceTypes();
    for (let dice_info of dice_types) {
      if (!dice_info.hasOwnProperty('type')) {
        throw new TypeError(this.constructor.name + " does not define all dice types.");
      }

      if (!dice_info.hasOwnProperty('count')) {
        throw new TypeError(this.constructor.name + " does not define all dice counts.");
      }

      for (let i = 0;i < dice_info.count;i++) {
        const Die = require(`./../plugins/dice/cosmic-${dice_info.type}Die.js`);
        dice.push(new Die(Wimpout));
      }
    }
    return dice;
  }

}

module.exports = RulesAbstract;
