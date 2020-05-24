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
const RoomSpacing = RoomSize + RoomMargin;

export default class Game {
  constructor() {
    this.width = 10;
    this.height = 5;
    this.corners = [];
    this.floors = [];
    this.rooms = [];
    this.walls = [];
    for (let c = 0; c <= this.width; c++) {
      for (let r = 0; r <= this.height; r++) {
        this.setCorner(c, r, Direction.UpLeft, new Corner(
          r === 0 || r === this.height || c === 0 || c === this.width
            ? CornerType.Solid
            : CornerType.Empty,
          new Vector(c * RoomSpacing, r * RoomSpacing)
        ));
      }
    }
    for (let c = 0; c < this.width; c++) {
      for (let r = 0; r <= this.height; r++) {
        this.setFloor(c, r, Direction.Up, new Floor(
          r === 0 || r === this.height ? FloorType.Solid : FloorType.Empty,
          new Vector(c * RoomSpacing + RoomMargin, r * RoomSpacing)
        ));
      }
    }
    for (let c = 0; c < this.width; c++) {
      for (let r = 0; r < this.height; r++) {
        this.setRoom(c, r, new Room(
          RoomType.Empty,
          new Vector(c * RoomSpacing + RoomMargin, r * RoomSpacing + RoomMargin)
        ));
      }
    }
    for (let c = 0; c <= this.width; c++) {
      for (let r = 0; r < this.height; r++) {
        this.setWall(c, r, Direction.Left, new Wall(
          c === 0 || c === this.width ? WallType.Solid : WallType.Empty,
          new Vector(c * RoomSpacing, r * RoomSpacing + RoomMargin)
        ));
      }
    }
    this.time = 0;
    this.maxTime = 5 * 60;
    this.crystal = new Crystal(
      this.maxTime,
      new Vector(2 * RoomSpacing + RoomMargin, 2 * RoomSpacing + RoomMargin),
      new Vector(4 * RoomSpacing + RoomMargin, 1 * RoomSpacing + RoomMargin),
      new Vector(1 * RoomSpacing + RoomMargin, 0 * RoomSpacing + RoomMargin),
      new Vector(0 * RoomSpacing + RoomMargin, 2 * RoomSpacing + RoomMargin),
    );
    this.player = new Player(new Vector(RoomMargin, RoomMargin));
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
  update = frame => {
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
      let step = new Vector();
      if (InputManager.isKeyDown['KeyD']) {
        if (!this.player.isAttacking()) {
          step = step.add(new Vector(1, 0));
        }
      }
      if (InputManager.isKeyDown['KeyA']) {
        if (!this.player.isAttacking()) {
          step = step.add(new Vector(-1, 0));
        }
      }
      if (!step.isZero()) {
        this.player.pos = this.player.pos.add(step.scale(playerSpeed * frame.fixedDeltaTime));
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
      }
      this.player.update(frame);
      this.time += frame.fixedDeltaTime;
    }
  }
}