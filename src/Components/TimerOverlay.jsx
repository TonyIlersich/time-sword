import React from 'react';
import styled from 'styled-components';

const Text = styled.text`
  fill: #11113318;
  alignment-baseline: middle;
  font-size: 240px;
  font-family: Consolas;
  letter-spacing: -10px;
  transform: scaleX(.5);
  text-anchor: middle;
  pointer-events: none;
`;

export default ({ timeRemaining }) => {
  const mm = Math.floor(Math.max(0, timeRemaining) / 60);
  const ss = Math.max(0, Math.floor(timeRemaining)) % 60;
  return (
    <Text y={107} x={320}>
      {mm.toFixed(0).padStart(2, '0')}:{ss.toFixed(0).padStart(2, '0')}
    </Text>
  );
};