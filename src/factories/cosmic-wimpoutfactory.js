/**
 * Logic, query, and other app-wide functions and services.
 *
 * This tracks:
 *   - Possible dice rolls and values.
 *   - All players, current stores, and other data.
 *   - A history of rolls.
 */

const Twig = require('twig');


class Wimpout {

  /**
   *
   * @param {Config} config
   */
  constructor(config) {
    this.config = config;
    this.system = {};
    this.players = {};
    this.games = {};
  }

  async setupAll() {
    return Promise.all([
      // Run various setup functions.
    ]);
  }
}

module.exports = Wimpout;
