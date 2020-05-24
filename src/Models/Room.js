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
}