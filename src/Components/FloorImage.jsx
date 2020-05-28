import React from 'react';
import { Sprites } from '../Utils/AssetManager';
import Sprite from './Common/Sprite';
import { FloorType } from '../Models/Floor';

export default ({ type, x, y, width, height }) => {
  let src;
  switch (type) {
    case FloorType.Empty:
      src = Sprites.FloorEmpty;
      break;
    case FloorType.Semisolid:
      src = Sprites.FloorSemisolid;
      break;
    case FloorType.Solid:
      src = Sprites.FloorSolid;
      break;
    default:
      throw new Error(`unexpected room type: ${type}`);
  }
  return (
    <Sprite href={src} x={x} y={y} width={width} height={height} />
  );
};