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

const app = express();
const server = http.Server(app);
const uuid = require('uuid/v4');
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


  // Listen at the port.
  server.listen(port, () => {
    console.log(`Listening on ${port}`);
  });

};
