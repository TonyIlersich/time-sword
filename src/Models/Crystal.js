export default class Crystal {
  constructor(maxTime, positions) {
    this.maxTime = maxTime;
    this.positions = positions;
    this.isCollected = false;
  }
  doesExist(time) {
    return !this.isCollected && time % 10 >= 7;
  }
  getPos(time) {
    return this.positions[Math.floor(time / this.maxTime * this.positions.length)];
  }
}