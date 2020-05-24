export default class Frame {
  constructor(arg) {
    if (typeof arg === 'number') {
      const fps = arg;
      this.number = 0;
      this.startTime = Date.now() / 1000;
      this.realDeltaTime = NaN;
      this.fixedDeltaTime = 1 / fps;
    } else {
      const other = arg;
      this.number = other.number + 1;
      this.startTime = Date.now() / 1000;
      this.realDeltaTime = this.startTime - other.startTime;
      this.fixedDeltaTime = other.fixedDeltaTime;
    }
  }
}