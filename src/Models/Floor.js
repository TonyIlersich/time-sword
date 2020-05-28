export const FloorType = {
  Empty: 'Empty',
  Semisolid: 'Semisolid',
  Solid: 'Solid',
};

export default class Floor {
  constructor(type, pos) {
    this.type = type;
    this.pos = pos;
  }
  isOnScreen(topLeft) {
    return this.pos.x + 52 >= topLeft.x &&
      this.pos.x <= topLeft.x + 320 &&
      this.pos.y + 6 >= topLeft.y &&
      this.pos.y <= topLeft.y + 180;
  }
}