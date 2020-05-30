import Vector from "./Vector";
import Direction from "./Direction";
import { RoomSpacing, RoomMargin } from "./Game";
import { WallType } from "./Wall";

export default class Bullet {
  constructor() {
    this.stop();
  }
  goLeft(pos) {
    this.pos = pos;
    this.exists = true;
    this.direction = Direction.Left;
  }
  goRight(pos) {
    this.pos = pos;
    this.exists = true;
    this.direction = Direction.Right;
  }
  stop() {
    this.pos = new Vector(NaN, NaN);
    this.exists = false;
    this.direction = Direction.None;
  }
  makeSnapshot() {
    return {
      pos: this.pos,
      exists: this.exists,
      direction: this.direction,
    };
  }
  loadSnapshot(snapshot) {
    this.pos = snapshot.pos;
    this.exists = snapshot.exists;
    this.direction = snapshot.direction;
  }
  getWorldCenter() {
    return this.pos.add(new Vector(26, 26));
  }
  isInWall(game) {
    const p = this.getWorldCenter().scale(1 / RoomSpacing);
    const wall = game.getWall(Math.floor(p.x), Math.floor(p.y), Direction.Left);
    return p.x % 1 < RoomMargin / RoomSpacing && wall.type === WallType.Solid;
  }
  isTouchingPerson(center) {
    const delta = center.subtract(this.getWorldCenter());
    return delta.y === 0 && Math.abs(delta.x) < 13;
  }
}