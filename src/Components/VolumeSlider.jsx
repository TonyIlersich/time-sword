import React from 'react';
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: min(45vw, 80vh);
  height: min(11.25vw, 20vh);
  left: min(94.375vw, 167.778vh);
  width: min(5.625vw, 10vh);
  background-color: #25252530;
  box-sizing: border-box;
`;

const Rail = styled.div`
  margin: auto;
  width: 5%;
  height: 100%;
  background-color: #252525;
`;

const Knob = styled.div`
  position: absolute;
  top: ${props => `${90 - props.level * 90}%`};
  left: 30%;
  height: 10%;
  width: 40%;
  box-sizing: border-box;
  background-color: #515357;
  border-width: 5%;
  border-style: solid;
  border-color: #252525;
  border-radius: 30%;
`;

export default ({ level, onChangeLevel }) => (
  <Container>
    <Rail />
    <Knob onTouchMove={event => console.log(event)} level={level} />
  </Container>
);