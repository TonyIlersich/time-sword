import Direction from "./Direction";
import { ActionTypes } from "./PlayerTimeline";
import { playerSpeed } from "./Player";
import Vector from "./Vector";
import { RoomSpacing } from "./Game";

export default class TimeClone {
  constructor(timelineSegment) {
    this.timelineSegment = timelineSegment;
    this.attackDuration = .1; // keep this the same as in Player
    this.isDead = false;
    this.reset();
  }
  onReceiveShot() {
    this.isDead = true;
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
  doesExist(time) {
    return this.timelineSegment.startTime <= time && time <= this.timelineSegment.endTime;
  }
  getPendingActions(time) {
    const pendingActions = [];
    while (
      this.nextActionId < this.timelineSegment.actions.length &&
      this.timelineSegment.actions[this.nextActionId].time <= time
    ) {
      pendingActions.push(this.timelineSegment.actions[this.nextActionId++]);
    }
    if (pendingActions.length) {
    }
    return pendingActions;
  }
  reset() {
    this.moving = this.timelineSegment.moving;
    this.facing = this.timelineSegment.facing;
    this.pos = this.timelineSegment.pos.clone();
    this.nextActionId = 0;
    this.lastUpdateTime = this.timelineSegment.startTime;
  }
  fastForward(time) {
    if (time < this.lastUpdateTime || !this.doesExist(time)) return;
    const deltaTime = time - this.lastUpdateTime;
    this.lastUpdateTime = time;
    this.attackTimeRemaining -= deltaTime;
    const pendingActions = this.getPendingActions(time);
    pendingActions.forEach(a => {
      switch (a.action) {
        case ActionTypes.Attack:
          this.attackTimeRemaining = this.attackDuration - (time - a.time);
          break;
        case ActionTypes.Drop:
          this.pos = this.pos.add(new Vector(0, RoomSpacing));
          break;
        case ActionTypes.Rise:
          this.pos = this.pos.subtract(new Vector(0, RoomSpacing));
          break;
        case ActionTypes.StartMovingLeft:
          this.moving = Direction.Left;
          break;
        case ActionTypes.StartMovingRight:
          this.moving = Direction.Right;
          break;
        case ActionTypes.StopMoving:
          this.moving = Direction.None;
          break;
        case ActionTypes.TurnLeft:
          this.facing = Direction.Left;
          break;
        case ActionTypes.TurnRight:
          this.facing = Direction.Right;
          break;
        default:
          throw new Error(`unexpected action: ${a.action}`);
      }
    });
    if (this.moving !== Direction.None) {
      const step = new Vector(deltaTime * playerSpeed, 0);
      if (this.moving === Direction.Right) {
        this.pos = this.pos.add(step);
      } else {
        this.pos = this.pos.subtract(step);
      }
    }
  }
  getWorldCenter() {
    return this.pos.add(new Vector(26, 26));
  }
}