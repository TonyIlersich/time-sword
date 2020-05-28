import React from 'react';
import { Sprites } from '../Utils/AssetManager';
import { WallType } from "../Models/Wall";
import Sprite from './Common/Sprite';

export default ({ type, x, y, width, height }) => {
  let src;
  switch (type) {
    case WallType.Empty:
      src = Sprites.WallEmpty;
      break;
    case WallType.Solid:
      src = Sprites.WallSolid;
      break;
    default:
      throw new Error(`unexpected wall type: ${type}`);
  }
  return (
    <Sprite href={src} x={x} y={y} width={width} height={height} />
  );
};