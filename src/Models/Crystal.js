export default class Crystal {
  constructor(maxTime, ...positions) {
    this.maxTime = maxTime;
    this.positions = positions;
  }
  doesExist(time) {
    return time % 60 >= 30;
  }
  getPos(time) {
    return this.positions[Math.floor(time / this.maxTime * this.positions.length)];
  }
}