export default class Crystal {
  constructor(maxTime, positions) {
    this.maxTime = maxTime;
    this.positions = positions;
    this.isCollected = false;
  }
  doesExist() {
    return !this.isCollected;
  }
  getPos(time) {
    return this.positions[Math.floor(time / this.maxTime * this.positions.length)] || this.positions[0];
  }
}