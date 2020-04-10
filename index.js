/**
 * @file
 * index.js
 *
 * The main Cosmic Wimpout app.
 *
 * For assistance with running, see README.md
 */

const config = require('config');

const Wimpout = require('./src/factories/cosmic-wimpoutfactory');

const cosmic = new Wimpout(config);

// This needs to be synchronous to ensure that the server only starts running once
// everything else is complete.

cosmic.setupAll().then(() => {
  // We silo all of the main server logic to a separate file.
  require('./cosmic-server')(cosmic, config);

  // Build the sass and start to watch for style or JS changes.
  require('./cosmic-sass')();
});
