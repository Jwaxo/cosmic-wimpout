/**
 * Information and methods used for an individual user connection.
 */

let Wimpout;

class Client {
  constructor(socket, cosmic) {
    this.id = 0;
    this.socket = socket;
    this.color = null;

    Wimpout = cosmic;

    return this;
  }

  // There shouldn't be a way to set the socket, since clients and sockets have
  // a 1:1 relationship. The only way to remove a socket is to drop it entirely,
  // and this should only be done for utility purposes.
  getSocket() {
    return this.socket;
  }

  setId(clientId) {
    this.id = clientId;
  }
  getId() {
    return this.id;
  }

  setColor(color) {
    this.color = color;
  }
  getColor() {
    return this.color;
  }

}

module.exports = Client;
