import Direction from "./Direction";
import { WallType } from "./Wall";
import Vector from "./Vector";
import { RoomSpacing, RoomMargin } from "./Game";

export default class Enemy {
  constructor(pos) {
    this.pos = pos;
    this.facing = Math.random() < .5 ? Direction.Left : Direction.Right;
    this.moving = Direction.None;
    this.shootInterval = 1.5;
    this.flareDuration = .4;
    this.lastShootTime = -Infinity;
    this.isDead = false;
  }
  onReceiveShot() {
    this.isDead = true;
  }
  makeSnapshot() {
    return {
      pos: this.pos,
      facing: this.facing,
      moving: this.moving,
      lastShootTime: this.lastShootTime,
      isDead: this.isDead,
    };
  }
  loadSnapshot(snapshot) {
    this.pos = snapshot.pos;
    this.facing = snapshot.facing;
    this.moving = snapshot.moving;
    this.lastShootTime = snapshot.lastShootTime;
    this.isDead = snapshot.isDead;
  }
  shouldDrawFlare(time) {
    return (time - this.lastShootTime) < this.flareDuration;
  }
  canShoot(time) {
    return (time - this.lastShootTime) >= this.shootInterval
  }
  shoot(time) {
    this.lastShootTime = time;
  }
  getWorldCenter() {
    return this.pos.add(new Vector(26, 26));
  }
  canSee(game, pos) {
    const viewDistance = 2;
    const dir = this.facing === Direction.Left ? -1 : 1;
    const p1 = this.getWorldCenter()
      .subtract(new Vector(RoomMargin / 2, RoomMargin / 2))
      .scale(1 / RoomSpacing);
    const c1 = Math.floor(p1.x);
    const r1 = Math.floor(p1.y);
    const p2 = pos
      .subtract(new Vector(RoomMargin / 2, RoomMargin / 2))
      .scale(1 / RoomSpacing);
    const c2 = Math.floor(p2.x);
    const r2 = Math.floor(p2.y);
    if (r1 !== r2 || (c2 - c1) * dir > viewDistance || (p2.x - p1.x) * dir < 0) {
      return false;
    }
    for (let i = 0; i < Math.abs(c2 - c1); i++) {
      const c = i * dir + c1;
      const wall = game.getWall(c, r1, this.facing);
      if (wall.type === WallType.Solid) {
        return false;
      }
    }
    return true;
  }
}