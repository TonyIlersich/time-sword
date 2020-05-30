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
import EnemyImage from './EnemyImage';
import Popup from './Popup';
import Game from '../Models/Game';

const Container = styled.div`
  width: min(100vw, 177.778vh);
  height: min(56.25vw, 100vh);
  background-color: #bbb;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
`;

const introPopupProps = {
  title: 'Protect Your Timeline!',
  desc: `A magic purple element has been discoverd with abilites to distort spacetime. You appeared here with a sword, and a message. You have ${'???'/* put song duration once determined */} to `
    + `collect ${Game.totalCrystalCount} purple crystals. Move with WASD. Swing your sword with J. This will deflect lasers. Travel back in time `
    + `with K. When time-travelling, select a moment with A and D. You will see your time clones retracing your steps. Keep them safe, or else you may sever your timeline and destroy the spacetime continuum. Good luck!`,
};

const initialState = {
  popupProps: introPopupProps,
};

export default class GameView extends React.Component {
  state = initialState;

  render() {
    const game = this.props.game;
    const topLeft = new Vector(-320 / 2, -180 / 2).add(game.player.getWorldCenter()).clamp(
      new Vector(0, 0),
      new Vector(game.width * 58 + 6 - 320, game.height * 58 + 6 - 180)
    );
    return (
      <Container>
        <Svg viewBox='0 0 320 180'>
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
          {game.timeLockedObjects.enemies.map((e, idx) => (
            <EnemyImage
              key={idx}
              {...e.pos.subtract(topLeft)}
              size={52}
              showFlare={e.shouldDrawFlare(game.time)}
              facing={e.facing}
            />
          ))}
          {game.timeLockedObjects.bullets.map((b, idx) => b.exists && (
            <Sprite
              key={idx}
              {...b.pos.subtract(topLeft)}
              href={Sprites.Laser}
              width={52}
              height={52}
            />
          ))}
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
          <Sprite href={Sprites.Vignette} x={0} y={0} width={320} height={180} opacity={game.player.crystalCount / Game.totalCrystalCount} />
          {new Array(game.player.crystalCount).fill('').map((_, idx) => (
            <Sprite
              key={idx}
              href={Sprites.Crystal}
              x={320 - 6 * (idx + 2)}
              y={0}
              width={12}
              height={12}
            />
          ))}
        </Svg>
        {this.state.popupProps && <Popup {...this.state.popupProps} onContinue={() => {
          game.isPaused = false;
          this.setState({ popupProps: null });
        }} />}
        {game.getEndState() && <Popup {...game.getEndState()} onContinue={() => {
          this.props.onRestart();
          this.setState(initialState);
        }} />}
      </Container>
    );
  }
}