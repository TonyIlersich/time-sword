export default class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  isZero(epsilon = 0) {
    return Math.abs(this.x) <= epsilon && Math.abs(this.y) <= epsilon;
  }
  isNaN() {
    return Number.isNaN(this.x) || Number.isNaN(this.y);
  }
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }
  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
  scale(factor) {
    return typeof factor === 'number'
      ? new Vector(this.x * factor, this.y * factor)
      : new Vector(this.x * factor.x, this.y * factor.y);
  }
  clamp(min, max) {
    return new Vector(
      Math.min(Math.max(this.x, min.x), max.x),
      Math.min(Math.max(this.y, min.y), max.y),
    );
  }
  clone() {
    return new Vector(this.x, this.y);
  }
}