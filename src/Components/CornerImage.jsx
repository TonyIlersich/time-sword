import React from 'react';
import { Sprites } from '../Utils/AssetManager';
import Sprite from './Common/Sprite';
import { CornerType } from '../Models/Corner';

export default ({ type, x, y, size }) => {
  let src;
  switch (type) {
    case CornerType.Empty:
      src = Sprites.CornerEmpty;
      break;
    case CornerType.Solid:
      src = Sprites.CornerSolid;
      break;
    default:
      throw new Error(`unexpected room type: ${type}`);
  }
  return (
    <Sprite href={src} x={x} y={y} width={size} height={size} />
  );
};