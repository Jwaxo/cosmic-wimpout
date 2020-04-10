/**
 * Information and methods used for a Cosmic Wimpout game board.
 */

let Wimpout;

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
  }

  setId(id) {
    this.id = id;
  }
  getId() {
    return this.id;
  }
}

module.exports = Board;
