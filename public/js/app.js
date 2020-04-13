$(document).foundation();

$(function() {
  const socket = io();
  let client = {};

  boardSetup(true);

  socket.on('rebuild-chat', html => {
    const chatContainer = $('#chat_container');
    chatContainer.html(html);
  });

  socket.on('rebuild-dice', html => {
    const diceContainer = $('#dice_container');
    diceContainer.html(html);
  });

  /**
   * Adds a status message to the client's status box.
   *
   * @params {string} html
   *   The HTML of the status message. This should contain everything: the
   *   message, the container, etc.
   */
  socket.on('set-status', html => {
    const statusContainer = $('#status_container');
    statusContainer.append(html);
    statusContainer.last().foundation();
    $('.status').delay(5000).fadeOut(300);
  });

  /**
   * Needs to be run any time the general board info updates.
   */
  function boardSetup(initial = false) {
    const boardInfoContainer = $('#board_info_container');

    /**
     * Starts the round-tracking process.
     */
    $('#start_game').unbind('click').click(() => {
      socket.emit('start-game');
    });

    if (!initial) {
      boardInfoContainer.foundation();
    }

    $('#dice_roll').unbind('click').click(element => {
      rollDice();
    });
  }

  function rollDice() {
    socket.emit('roll-dice');
  }

});
