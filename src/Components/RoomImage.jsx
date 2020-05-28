import React from 'react';
import { Sprites } from '../Utils/AssetManager';
import { RoomType } from "../Models/Room";
import Sprite from './Common/Sprite';

export default ({ type, x, y, size }) => {
  let src;
  switch (type) {
    case RoomType.DownRamp:
      src = Sprites.RoomStairs;
      break;
    case RoomType.Empty:
      src = Sprites.RoomEmpty;
      break;
    case RoomType.UpRamp:
      // TODO
      break;
    default:
      throw new Error(`unexpected room type: ${type}`);
  }
  return (
    <Sprite href={src} x={x} y={y} width={size} height={size} />
  );
};