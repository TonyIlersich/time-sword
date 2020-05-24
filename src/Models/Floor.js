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
}