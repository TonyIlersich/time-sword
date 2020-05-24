import Vector from "./Vector";
import Direction from "./Direction";

export const playerSpeed = 100;

export default class Player {
  constructor(pos) {
    this.pos = pos;
    this.center = new Vector(26, 26);
    this.attackDuration = .1;
    this.facing = Direction.Right;
    this.moving = Direction.None;
  }
  setMoving(direction) {
    this.moving = direction;
  }
  setFacing(direction) {
    this.facing = direction;
  }
  beginAttack() {
    this.attackTimeRemaining = this.attackDuration;
  }
  isAttacking() {
    return this.attackTimeRemaining > 0;
  }
  update(frame) {
    this.attackTimeRemaining -= frame.fixedDeltaTime;
  }
  getWorldCenter() {
    return this.pos.add(this.center);
  }
}