/**
 * Definition of Six-Sided Die.
 * A typical six-sided die with unique faces. The symbols on the white die
 * uniformly match up with different numerical values.
 */

const DieAbstract = require('./../../abstracts/cosmic-dieAbstract');

class sixSidedWhiteDie extends DieAbstract {

  constructor(cosmic) {
    super(cosmic);

    this.type = 'six_sided_white';
    this.face_count = 6;
    this.face_values = {
      0: {
        type: 'int',
        value: 10,
        name: 'ten'
      },
      1: {
        type: 'symbol',
        value: 2,
        name: 'whirlpool',
      },
      2: {
        type: 'symbol',
        value: 3,
        name: 'triangles',
      },
      3: {
        type: 'symbol',
        value: 4,
        name: 'lightning',
      },
      4: {
        type: 'int',
        value: 5,
        name: 'five',
      },
      5: {
        type: 'six',
        value: 6,
        name: 'stars',
      }
    };
  }

}

module.exports = sixSidedWhiteDie;
