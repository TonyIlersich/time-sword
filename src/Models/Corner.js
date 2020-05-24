export const CornerType = {
  Empty: 'Empty',
  Solid: 'Solid',
};

export default class Corner {
  constructor(type, pos) {
    this.type = type;
    this.pos = pos;
  }
}