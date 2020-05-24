export const WallType = {
  Empty: 'Empty',
  Solid: 'Solid',
};

export default class Wall {
  constructor(type, pos) {
    this.type = type;
    this.pos = pos;
  }
}