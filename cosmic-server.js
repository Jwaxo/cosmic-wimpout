/**
 * @file
 * Defines overall server and socket functionality of Cosmic Wimpout.
 */

const Twig = require('twig');
const express = require('express');

const socketio = require('socket.io');
const http = require('http');
const request = require('request');

const chalk = require('chalk');
const stripAnsi = require('strip-ansi');

const Board = require('./src/factories/cosmic-boardFactory');

const clients = [];
const chatHistory = [];
const app = express();
const server = http.Server(app);
const { v4: uuid } = require('uuid');
const io = socketio(server);

let Wimpout;
let console_colors = {};

// Define how sessions are created and tracked.
const session = require('express-session')({
  genid: req => {
    return uuid(); // use UUIDs for session IDs
  },
  secret: 'too many points',
  resave: false,
  saveUninitialized: true,
});
// Since Express and IO are technically two different types of server trackers,
// we need to track sessions using some middleware.
const sharedSession = require("express-socket.io-session");

module.exports = (cosmic, config) => {
  const port = config.get('server.port');
  Wimpout = cosmic;
  console_colors = config.get('server.console_colors');

  // Currently we only run one board at a time, so create Wimpout with a board.
  const board = Wimpout.getBoardById(1);

  // Listen at the port.
  server.listen(port, () => {
    console.log(`Listening on ${port}`);
  });

  serverLog(`New game board generated with ID ${board.getId()}.`, true);

  // Do basic server setup stuff.
  app.use(express.static(__dirname + '/public'));

  // Here we do the Express/IO shared session magic.
  app.use(session);
  io.use(sharedSession(session));

  app.set("twig options", {
    allow_async: true,
    strict_variables: false
  });

  // Serve up the default page.
  app.get('/', (req, res) => {
    res.render('index.twig', {
      board,
      chatHistory,
    });
  });
};

/**
 * Creates a simple message for displaying to the server, with timestamp.
 *
 * @param {string} message
 *   The message to set. This can have chalk.js formatting, which will be stripped
 *   prior to sending to clients.
 * @param {boolean} serverOnly
 *   If the message should not be broadcast in the clientside chat.
 */
function serverLog(message, serverOnly = false) {
  const date = new Date();
  const timestamp = date.toLocaleString("en-US");
  const log = `${timestamp}: ${message}`;

  if (!serverOnly) {
    updateChat(log);
  }

  console.log(log);
}

/**
 * Adds a new line item to the chat box.
 *
 * @param {string} message
 *   The message to add. This is expected to be formatted using chalk.js for
 *   console formatting; it will be stripped.
 */
function updateChat(message) {
  // Define how console colors look so we can remove them from the HTML.
  message = stripAnsi(message);

  chatHistory.unshift(message);

  Twig.renderFile('./views/chat-item.twig', {message}, (error, html) => {
    io.sockets.emit('update-chat', html);
  });
}
