export const RoomType = {
  Empty: 'Empty',
  UpRamp: 'Up Ramp',
  DownRamp: 'Down Ramp',
};

export default class Room {
  constructor(type, pos) {
    this.type = type;
    this.pos = pos;
  }
  isOnScreen(topLeft) {
    return this.pos.x + 52 >= topLeft.x &&
      this.pos.x <= topLeft.x + 320 &&
      this.pos.y + 52 >= topLeft.y &&
      this.pos.y <= topLeft.y + 180;
  }
}