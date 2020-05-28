import React from 'react';
import Sprite from "./Common/Sprite";
import { Sprites } from "../Utils/AssetManager";
import Direction from '../Models/Direction';

export default ({ x, y, size, isAttacking, facing, isFaded, isWarping }) => (
  <Sprite
    href={isWarping ? Sprites.PlayerWarp : (isAttacking ? Sprites.PlayerAttack : Sprites.PlayerIdle)}
    flip={facing === Direction.Left}
    x={facing === Direction.Left ? -x - size : x}
    y={y}
    width={size}
    height={size}
    opacity={isFaded ? .5 : 1}
  />
);