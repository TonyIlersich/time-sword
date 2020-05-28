import Room, { RoomType } from "./Room";
import Player, { playerSpeed } from "./Player";
import Vector from "./Vector";
import Wall, { WallType } from "./Wall";
import Floor, { FloorType } from "./Floor";
import Corner, { CornerType } from "./Corner";
import InputManager from "../Utils/InputManager";
import Direction from "./Direction";
import PlayerTimeline, { ActionTypes } from "./PlayerTimeline";
import TimeClone from "./TimeClone";
import Crystal from "./Crystal";

const RoomSize = 52;
const RoomMargin = 6;
export const RoomSpacing = RoomSize + RoomMargin;

export default class Game {
  constructor() {
    this.generate();
    this.time = 0;
    this.maxTime = 5 * 60;
    this.crystal = new Crystal(
      this.maxTime,
      new Array(30).fill('').map(() => new Vector(
        Math.floor(Math.random() * this.width / 2 + this.width) * RoomSpacing + RoomMargin,
        Math.floor(Math.random() * this.height / 2 + this.height) * RoomSpacing + RoomMargin
      )),
    );
    this.player = new Player(new Vector(1 * RoomSpacing + RoomMargin, 0 * RoomSpacing + RoomMargin));
    this.playerTimeline = new PlayerTimeline();
    this.playerTimeline.beginSegment(this.time, this.player);
    this.timeClones = [];
    this.timeLockedObjects = {
      enemies: [],
    };
    this.snapshots = [];
    this.snapshotInteval = 4.9;
    this.isTimeFrozen = false;
    this.saveSnapshot();
  }
  generate() {
    this.width = 15;
    this.height = 8;
    const nodes = new Array(this.width * this.height).fill('').map((_, idx) => idx);
    const first = Math.floor(Math.random() * this.width * this.height);
    const edges = [];
    const stack = [first];
    const visited = [first];
    while (stack.length > 0) {
      const current = stack[0];
      const nbrs = nodes.filter(i => {
        if (i === current - this.width) return current % 2 === 1;
        if (i === current - 1) return current % this.width > 0;
        if (i === current + 1) return current % this.width + 1 < this.width;
        if (i === current + this.width) return current % 2 === 0;
        return false;
      });
      const unvisited = nbrs.filter(i => !visited.includes(i)).sort(() => Math.random() < .5);
      if (unvisited.length === 0) {
        stack.shift();
      } else {
        const chosen = unvisited[0];
        edges.push({ i: current, j: chosen });
        visited.push(chosen);
        stack.unshift(chosen);
      }
    }
    this.corners = [];
    this.floors = [];
    this.rooms = [];
    this.walls = [];
    for (let c = 0; c <= this.width; c++) {
      for (let r = 0; r <= this.height; r++) {
        this.setCorner(c, r, Direction.UpLeft, new Corner(
          CornerType.Solid,
          new Vector(c * RoomSpacing, r * RoomSpacing)
        ));
      }
    }
    for (let c = 0; c < this.width; c++) {
      for (let r = 0; r <= this.height; r++) {
        const type = edges.some(({ i, j }) =>
          (c + r * this.width === i && c + (r - 1) * this.width === j) ||
          (c + r * this.width === j && c + (r - 1) * this.width === i))
          ? FloorType.Semisolid : FloorType.Solid;
        this.setFloor(c, r, Direction.Up, new Floor(
          type,
          new Vector(c * RoomSpacing + RoomMargin, r * RoomSpacing)
        ));
      }
    }
    for (let c = 0; c < this.width; c++) {
      for (let r = 0; r < this.height; r++) {
        const type = edges.some(({ i, j }) =>
          (c + r * this.width === i && c + (r - 1) * this.width === j) ||
          (c + r * this.width === j && c + (r - 1) * this.width === i))
          ? RoomType.DownRamp : RoomType.Empty;
        this.setRoom(c, r, new Room(
          type,
          new Vector(c * RoomSpacing + RoomMargin, r * RoomSpacing + RoomMargin)
        ));
      }
    }
    for (let c = 0; c <= this.width; c++) {
      for (let r = 0; r < this.height; r++) {
        const type = edges.some(({ i, j }) =>
          (c - 1 + r * this.width === i && c + r * this.width === j) ||
          (c - 1 + r * this.width === j && c + r * this.width === i))
          ? WallType.Empty : WallType.Solid;
        this.setWall(c, r, Direction.Left, new Wall(
          type,
          new Vector(c * RoomSpacing, r * RoomSpacing + RoomMargin)
        ));
      }
    }
  }
  saveSnapshot() {
    this.snapshots.push({
      time: this.time,
      enemies: this.timeLockedObjects.enemies.map(e => e.makeSnapshot()),
    });
  }
  loadSnapshot(snapshot) {
    this.time = snapshot.time;
    this.timeLockedObjects.enemies.forEach((e, idx) => e.loadSnapshot(snapshot.enemies[idx]));
  }
  previewSnapshot(snapshotId) {
    const snapshot = this.snapshots[snapshotId];
    this.loadSnapshot(snapshot);
    this.timeClones.forEach(tc => {
      tc.reset();
      tc.fastForward(this.time);
    });
  }
  setCorner(c, r, direction, corner) {
    let offset;
    switch (direction) {
      case Direction.UpLeft:
        offset = 0;
        break;
      case Direction.UpRight:
        offset = 1;
        break;
      case Direction.DownLeft:
        offset = this.width + 1;
        break;
      case Direction.DownRight:
        offset = this.width + 2;
        break;
      default:
        throw new Error(`invalid direction for corner: ${direction}`);
    }
    this.corners[c + r * (this.width + 1) + offset] = corner;
  }
  getCorner(c, r, direction) {
    let offset;
    switch (direction) {
      case Direction.UpLeft:
        offset = 0;
        break;
      case Direction.UpRight:
        offset = 1;
        break;
      case Direction.DownLeft:
        offset = this.width + 1;
        break;
      case Direction.DownRight:
        offset = this.width + 2;
        break;
      default:
        throw new Error(`invalid direction for corner: ${direction}`);
    }
    return this.corners[c + r * (this.width + 1) + offset];
  }
  setRoom(c, r, room) {
    this.rooms[c + r * this.width] = room;
  }
  getRoom(c, r) {
    return this.rooms[c + r * this.width];
  }
  setFloor(c, r, direction, floor) {
    let offset;
    switch (direction) {
      case Direction.Up:
        offset = 0;
        break;
      case Direction.Down:
        offset = this.width;
        break;
      default:
        throw new Error(`invalid direction for floor: ${direction}`);
    }
    this.floors[c + r * this.width + offset] = floor;
  }
  getFloor(c, r, direction) {
    let offset;
    switch (direction) {
      case Direction.Up:
        offset = 0;
        break;
      case Direction.Down:
        offset = this.width;
        break;
      default:
        throw new Error(`invalid direction for floor: ${direction}`);
    }
    return this.floors[c + r * this.width + offset];
  }
  setWall(c, r, direction, wall) {
    let offset;
    switch (direction) {
      case Direction.Left:
        offset = 0;
        break;
      case Direction.Right:
        offset = 1;
        break;
      default:
        throw new Error(`invalid direction for wall: ${direction}`);
    }
    this.walls[c + r * (this.width + 1) + offset] = wall;
  }
  getWall(c, r, direction) {
    let offset;
    switch (direction) {
      case Direction.Left:
        offset = 0;
        break;
      case Direction.Right:
        offset = 1;
        break;
      default:
        throw new Error(`invalid direction for wall: ${direction}`);
    }
    return this.walls[c + r * (this.width + 1) + offset];
  }
  getEndState() {
    if (this.time < this.maxTime) {
      return null;
    } else if (this.player.hasCrystal) {
      return { title: 'You Win!', desc: 'You saved spacetime!' };
    } else {
      return { title: 'Game Over!', desc: 'Time has run out, and the spacetime continuum has collapsed!' };
    }
  }
  update = frame => {
    if (this.time >= this.maxTime) {
      return;
    }
    if (InputManager.wasPressedThisFrame['KeyK']) {
      this.isTimeFrozen = !this.isTimeFrozen;
      if (this.isTimeFrozen) {
        this.playerTimeline.endSegment(this.time);
        const newSegment = this.playerTimeline.segments[this.playerTimeline.segments.length - 1];
        this.timeClones.push(new TimeClone(newSegment));
        this.previewSnapshotId = this.snapshots.length - 1;
        this.previewSnapshot(this.previewSnapshotId);
      } else {
        this.playerTimeline.beginSegment(this.time, this.player);
        // TODO commit to preview snapshot and delete future snapshots
      }
    }
    if (this.isTimeFrozen) {
      const prevId = this.previewSnapshotId;
      if (InputManager.wasPressedThisFrame['KeyD']) {
        this.previewSnapshotId = Math.min(this.snapshots.length - 1, this.previewSnapshotId + 1);
      }
      if (InputManager.wasPressedThisFrame['KeyA']) {
        this.previewSnapshotId = Math.max(0, this.previewSnapshotId - 1);
      }
      if (prevId !== this.previewSnapshotId) {
        this.previewSnapshot(this.previewSnapshotId);
      }
    } else {
      if (this.time - this.snapshots[this.snapshots.length - 1].time >= this.snapshotInteval) {
        this.saveSnapshot();
      }
      this.timeClones.forEach(tc => tc.fastForward(this.time));
      // figure out which room the player is in
      const relativePos = this.player.getWorldCenter()
        .add(new Vector(0, RoomSpacing / 2))
        .subtract(new Vector(RoomMargin / 2, RoomMargin / 2))
        .scale(1 / RoomSpacing);
      const c = Math.floor(relativePos.x);
      const r = Math.floor(relativePos.y) - 1;
      const room = this.rooms[c + r * this.width];
      const floor = this.getFloor(c, r, Direction.Down);
      let step = new Vector();
      if (InputManager.wasPressedThisFrame['KeyS'] && floor.type === FloorType.Semisolid) {
        step = step.add(new Vector(0, RoomSpacing));
        this.playerTimeline.pushAction(ActionTypes.Drop, this.time);
      } else if (InputManager.wasPressedThisFrame['KeyW'] && room.type === RoomType.DownRamp) {
        step = step.subtract(new Vector(0, RoomSpacing));
        this.playerTimeline.pushAction(ActionTypes.Rise, this.time);
      }
      if (InputManager.isKeyDown['KeyD']) {
        if (!this.player.isAttacking()) {
          step = step.add(new Vector(playerSpeed * frame.fixedDeltaTime, 0));
        }
      }
      if (InputManager.isKeyDown['KeyA']) {
        if (!this.player.isAttacking()) {
          step = step.add(new Vector(-playerSpeed * frame.fixedDeltaTime, 0));
        }
      }
      const wall = !!step.x && this.getWall(c, r, step.x < 0 ? Direction.Left : Direction.Right);
      if (wall && wall.type === WallType.Solid && (
        (step.x < 0 && relativePos.x % 1 < this.player.width / RoomSpacing) ||
        (step.x > 0 && relativePos.x % 1 > 1 - this.player.width / RoomSpacing)
      )) {
        step.x = 0;
      }
      if (!step.isZero()) {
        this.player.pos = this.player.pos.add(step);
      }
      if (step.x < 0 && this.player.moving !== Direction.Left) {
        this.player.setMoving(Direction.Left);
        if (this.player.facing !== Direction.Left) {
          this.player.setFacing(Direction.Left);
          this.playerTimeline.pushAction(ActionTypes.TurnLeft, this.time);
        }
        this.playerTimeline.pushAction(ActionTypes.StartMovingLeft, this.time);
      }
      if (step.x > 0 && this.player.moving !== Direction.Right) {
        this.player.setMoving(Direction.Right);
        if (this.player.facing !== Direction.Right) {
          this.player.setFacing(Direction.Right);
          this.playerTimeline.pushAction(ActionTypes.TurnRight, this.time);
        }
        this.playerTimeline.pushAction(ActionTypes.StartMovingRight, this.time);
      }
      if (step.x === 0 && this.player.moving !== Direction.None) {
        this.player.setMoving(Direction.None);
        this.playerTimeline.pushAction(ActionTypes.StopMoving, this.time);
      }
      if (InputManager.wasPressedThisFrame['KeyJ']) {
        this.player.beginAttack();
        this.playerTimeline.pushAction(ActionTypes.Attack, this.time);
      }
      if (!this.player.hasCrystal && this.player.pos.subtract(this.crystal.getPos(this.time)).isZero(RoomSpacing / 2)) {
        this.player.hasCrystal = true;
        this.crystal.isCollected = true;
      }
      this.player.update(frame);
      this.time += frame.fixedDeltaTime;
    }
  }
}