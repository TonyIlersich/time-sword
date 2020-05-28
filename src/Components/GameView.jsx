import React from 'react';
import styled from 'styled-components';
import RoomImage from './RoomImage';
import WallImage from './WallImage';
import FloorImage from './FloorImage';
import CornerImage from './CornerImage';
import PlayerImage from './PlayerImage';
import Vector from '../Models/Vector';
import TimerOverlay from './TimerOverlay';
import Sprite from './Common/Sprite';
import { Sprites } from '../Utils/AssetManager';

const Container = styled.svg`
  width: min(100vw, 177.778vh);
  height: min(56.25vw, 100vh);
  background-color: #bbb;
`;

export default ({ game }) => {
  const topLeft = new Vector(-320 / 2, -180 / 2).add(game.player.getWorldCenter()).clamp(
    new Vector(0, 0),
    new Vector(game.width * 58 + 6 - 320, game.height * 58 + 6 - 180)
  );
  return (
    <Container viewBox='0 0 320 180'>
      {game.rooms.filter(room => room.isOnScreen(topLeft)).map((room, idx) => (
        <RoomImage key={idx} type={room.type} {...room.pos.subtract(topLeft)} size={52} />
      ))}
      {game.walls.filter(wall => wall.isOnScreen(topLeft)).map((wall, idx) => (
        <WallImage key={idx} type={wall.type} {...wall.pos.subtract(topLeft)} width={6} height={52} />
      ))}
      {game.floors.filter(floor => floor.isOnScreen(topLeft)).map((floor, idx) => (
        <FloorImage key={idx} type={floor.type} {...floor.pos.subtract(topLeft)} width={52} height={6} />
      ))}
      {game.corners.filter(corner => corner.isOnScreen(topLeft)).map((corner, idx) => (
        <CornerImage key={idx} type={corner.type} {...corner.pos.subtract(topLeft)} size={6} />
      ))}
      {game.crystal.doesExist(game.time) && (
        <Sprite
          href={Sprites.Crystal}
          {...game.crystal.getPos(game.time).subtract(topLeft)}
          width={52}
          height={52}
        />
      )}
      <PlayerImage
        {...game.player.pos.subtract(topLeft)}
        size={52}
        isAttacking={game.player.isAttacking()}
        facing={game.player.facing}
        isWarping={game.isTimeFrozen}
      />
      {game.timeClones.map((tc, idx) => tc.doesExist(game.time) && (
        <PlayerImage
          key={idx}
          {...tc.pos.subtract(topLeft)}
          size={52}
          isAttacking={tc.isAttacking()}
          facing={tc.facing}
          isFaded
        />
      ))}
      <TimerOverlay timeRemaining={game.maxTime - game.time} />
      {game.player.hasCrystal && <Sprite href={Sprites.Vignette} x={0} y={0} width={320} height={180} />}
    </Container>
  );
};