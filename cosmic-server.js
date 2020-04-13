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

const Client = require('./src/factories/cosmic-clientFactory');

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

  /**
   * Handling of individual sockets as they remain connected.
   * Creates a Client to track the user at the socket, which is then used for all
   * received commands.
   */
  io.on('connection', socket => {
    serverLog(`New connection established with hash ${socket.id}`, true);

    const randomColor = Math.floor(Math.random() * (console_colors.length));

    const clientSession = socket.handshake.session;
    const client = new Client(socket, Wimpout);
    const clientId = clients.push(client);
    client.setId(clientId);
    client.setColor(chalk[console_colors[randomColor]]);

    serverLog(`${client.getId()} assigned to socket ${socket.id}`, true);

    // Generate everything that may change based off of an existing client connection
    // or resumed session.
    regenerateChatSingle(socket);

    /**
     * A client rolled the dice.
     *
     * @todo: only allow rolling on your turn.
     */
    socket.on('roll-dice', data => {
      board.rollDice();

      regenerateDice(board);

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
 * Renders the players and updates all clients with new player info.
 */
function regenerateChatSingle(socket) {
  Twig.renderFile('./views/chat-container.twig', {chatHistory}, (error, html) => {
    socket.emit('rebuild-chat', html);
  });
}

/**
 * Renders the dice cards with new info.
 */
function regenerateDice(board) {
  Twig.renderFile('./views/dice-container.twig', {board}, (error, html) => {
    io.sockets.emit('rebuild-dice', html);
  });
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
