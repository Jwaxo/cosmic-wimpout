/**
 * Information and methods related to individual dice for Cosmic Wimpout.
 *
 * This is only an abstract; different types of dice should be defined in
 * src/plugins/dice, and extend this functionality.
 */

let Wimpout;

class DieAbstract {

  constructor(cosmic) {
    this.id = null;
    this.type = null;
    this.face_count = null;
    this.face_values = {};
    this.status = 0;
    this.face = null;

    Wimpout = cosmic;

    if (new.target === DieAbstract) {
      throw new TypeError("Cannot construct Abstract classes directly.");
    }
  }

  getId() {
    return this.id;
  }
  getType() {
    return this.type;
  }
  getStatus() {
    return this.status;
  }
  setFace(roll) {
    this.face = roll;
  }
  getFace() {
    return this.face;
  }

  getFaceCount() {
    if (this.face_count === null) {
      throw new TypeError(this.constructor.name + " does not initialize face_count property.");
    }

    return this.face_count;
  }

  getFaceValue() {
    const roll = this.getFace();
    if (!this.face_values.hasOwnProperty(roll)) {
      throw new TypeError(this.constructor.name + " does not define face_value property for roll of " + roll);
    }

    return this.face_values[roll];
  }

  roll() {
    const face_count = this.getFaceCount();
    // Subtract 1 from the face count to index at 0.
    this.setFace(Math.floor(Math.random() * Math.floor(face_count - 1)));

    return this.getFaceValue();
  }

}

module.exports = DieAbstract;
