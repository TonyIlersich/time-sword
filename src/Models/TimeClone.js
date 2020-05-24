import Direction from "./Direction";
import { ActionTypes } from "./PlayerTimeline";
import { playerSpeed } from "./Player";
import Vector from "./Vector";

export default class TimeClone {
  constructor(timelineSegment) {
    this.timelineSegment = timelineSegment;
    this.attackDuration = .1; // keep this the same as in Player
    this.reset();
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
    if (this.moving) {
      this.movingStartPos = this.pos;
      this.movingStartTime = this.timelineSegment.startTime;
    }
    this.nextActionId = 0;
  }
  fastForward(time) {
    const pendingActions = this.getPendingActions(time);
    pendingActions.forEach(a => {
      switch (a.action) {
        case ActionTypes.Attack:
          this.attackTimeRemaining = this.attackDuration + a.time - time;
          break;
        case ActionTypes.StartMovingLeft:
          this.moving = Direction.Left;
          this.movingStartTime = a.time;
          this.movingStartPos = this.pos;
          break;
        case ActionTypes.StartMovingRight:
          this.moving = Direction.Right;
          this.movingStartTime = a.time;
          this.movingStartPos = this.pos;
          break;
        case ActionTypes.StopMoving:
          const step = new Vector((a.time - this.movingStartTime) * playerSpeed, 0);
          if (this.moving === Direction.Right) {
            this.pos = this.movingStartPos.add(step);
          } else {
            this.pos = this.movingStartPos.subtract(step);
          }
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
      const step = new Vector((time - this.movingStartTime) * playerSpeed, 0);
      if (this.moving === Direction.Right) {
        this.pos = this.movingStartPos.add(step);
      } else {
        this.pos = this.movingStartPos.subtract(step);
      }
    }
  }
}