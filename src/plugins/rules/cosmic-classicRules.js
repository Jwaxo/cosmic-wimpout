/**
 * Definition of Classic Cosmic Wimpout rules.
 */

const RulesAbstract = require('./../../abstracts/cosmic-rulesAbstract');

class classicRules extends RulesAbstract {

  constructor(cosmic) {
    super(cosmic);

    this.type = 'classic';

    this.dice_types = [
      {
        type: 'sixSidedWhite',
        count: 4,
      },
      {
        type: 'sixSidedBlack',
        count: 1,
      },
    ];
    this.max_score = 500;

  }
}

module.exports = classicRules;
