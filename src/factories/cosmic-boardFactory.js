/**
 * Information and methods used for a Cosmic Wimpout game board.
 */

let Wimpout;
let Rules;

class Board {
  /**
   * Create a new Board, or load a Board from the DB.
   *
   * @param {Wimpout} cosmic
   * @param {int|null} id
   *   The ID of the board you wish to load; optional.
   * @returns {Board}
   */
  constructor(cosmic, id = null) {
    Wimpout = cosmic;

    this.id = id;
    this.status = 0;

    this.players = {};
    this.dice = [];

    this.setRules('classic'); // Set to classic by default.
    this.dice = Rules.generateDice();
  }

  setId(id) {
    this.id = id;
  }
  getId() {
    return this.id;
  }

  setStatus(status) {
    this.status = status;
  }
  getStatus() {
    return this.status;
  }

  setRules(rules_type) {
    const new_Rules = require(`./../plugins/rules/cosmic-${rules_type}Rules.js`);
    Rules = new new_Rules(Wimpout);
  }
  getRules() {
    return Rules;
  }

  getDice() {
    return this.dice;
  }
  addDie(die_type) {
    const Die = require(`./../plugins/dice/cosmic-${die_type}Die.js`);
    this.dice.push(new Die());
  }

  rollDice() {
    const dice = this.getDice();
    for (let die of dice) {
      die.roll();
    }
  }
}

module.exports = Board;
