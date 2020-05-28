export const WallType = {
  Empty: 'Empty',
  Solid: 'Solid',
};

export default class Wall {
  constructor(type, pos) {
    this.type = type;
    this.pos = pos;
  }
  isOnScreen(topLeft) {
    return this.pos.x + 6 >= topLeft.x &&
      this.pos.x <= topLeft.x + 320 &&
      this.pos.y + 52 >= topLeft.y &&
      this.pos.y <= topLeft.y + 180;
  }
}