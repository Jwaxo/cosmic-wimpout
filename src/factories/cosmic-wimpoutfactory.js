/**
 * Logic, query, and other app-wide functions and services.
 *
 * This tracks:
 *   - Possible dice rolls and values.
 *   - All players, current stores, and other data.
 *   - A history of rolls.
 */

const Twig = require('twig');
const Board = require('./cosmic-boardfactory');

class Wimpout {

  /**
   *
   * @param {Config} config
   */
  constructor(config) {
    this.config = config;
    this.system = {};
    this.players = {};
    this.last_player_id = 0;
    this.boards = {};
    this.last_board_id = 0;

    // Ensure that our first board has an id of 1. Ideally we would just say
    // this.addBoard(new Board(this));
    this.addBoard(new Board(this), 1);
  }

  /**
   * Adds a board to Wimpout's configuration.
   *
   * @param board
   * @param board_id
   *
   * @return int
   *   The board's ID, new or old.
   */
  addBoard(board, board_id = null) {
    // If no ID is provided, we're either adding a loaded board to memory or we
    // are creating a fresh board and need it to be assigned an ID.
    if (board_id === null) {
      let loaded_board_id = board.getId();

      // If the board already has an ID, we slot it in with that ID.
      if (loaded_board_id !== null) {
        if (this.boards.hasOwnProperty(loaded_board_id)) {
          throw "Tried to load a board that is already loaded.";
        }
        else {
          this.boards[loaded_board_id] = board;
        }
      }
      // Otherwise we create an ID for it and assign it.
      else {
        ++this.last_board_id;
        this.boards[this.last_board_id] = board;
        board.setId(this.last_board_id);
      }
    }
    else {
      if (this.boards[board_id]) {
        throw "Tried to use a Board ID that already exists.";
      }
      else {
        this.boards[board_id] = board;
        board.setId(board_id);
      }
    }
    return board.getId();
  }

  getBoardById(board_id) {
    return this.boards[board_id];
  }

  async setupAll() {
    // Currently nothing to setup, but ideally this is where any saved states
    // would be loaded into memory.
    return Promise.all([
      // Run various setup functions.
      this.setupBoards(),
    ]);
  }

  async setupBoards() {
    return this.boards;
  }
}

module.exports = Wimpout;
