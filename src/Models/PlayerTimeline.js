export const ActionTypes = {
  Attack: 'Attack',
  StartMovingLeft: 'Start Moving Left',
  StartMovingRight: 'Start Moving Right',
  StopMoving: 'Stop Moving',
  TurnLeft: 'Turn Left',
  TurnRight: 'Turn Right',
};

class TimelineSegment {
  constructor(startTime, facing, moving, pos) {
    this.startTime = startTime;
    this.facing = facing;
    this.moving = moving;
    this.pos = pos;
    this.actions = [];
  }
  end(endTime) {
    this.endTime = endTime;
  }
  pushAction(action, time) {
    this.actions.push({ action, time });
  }
}

export default class PlayerTimeline {
  constructor() {
    this.segments = [];
  }
  pushAction(action, time) {
    this.segments[this.segments.length - 1].pushAction(action, time);
  }
  endSegment(time) {
    this.segments[this.segments.length - 1].end(time);
  }
  beginSegment(time, player) {
    this.segments.push(new TimelineSegment(
      time,
      player.facing,
      player.moving,
      player.pos.clone(),
    ));
  }
}
