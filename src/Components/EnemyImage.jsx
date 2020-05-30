import React from 'react';
import Sprite from "./Common/Sprite";
import { Sprites } from "../Utils/AssetManager";
import Direction from '../Models/Direction';

export default ({ x, y, size, showFlare, facing }) => (
  <Sprite
    href={showFlare ? Sprites.EnemyAttack : Sprites.EnemyIdle}
    flip={facing === Direction.Left}
    x={facing === Direction.Left ? -x - size : x}
    y={y}
    width={size}
    height={size}
  />
);