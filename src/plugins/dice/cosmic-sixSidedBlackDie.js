/**
 * Definition of Six-Sided Die.
 * A typical six-sided die with unique faces. The symbols on the white die
 * uniformly match up with different numerical values.
 */

const sixSidedWhiteDie = require('./cosmic-sixSidedWhiteDie');

class sixSidedBlackDie extends sixSidedWhiteDie {

  constructor(cosmic) {
    super(cosmic);

    this.type = 'six_sided_black';
    this.face_values[1] = {
      type: 'symbol',
      value: 0,
      name: 'wild',
    };
  }

}

module.exports = sixSidedBlackDie;
