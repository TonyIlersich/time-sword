import React from 'react';
import styled from "styled-components";

const Container = styled.div`
  background-color: #515357;
  position: fixed;
  box-sizing: border-box;
  top: min(9.375vw, 16.667vh);
  height: min(37.5vw, 66.667vh);
  left: min(16.667vw, 29.63vh);
  width: min(66.667vw, 118.519vh);
  border: .5vw solid #252525;
  font-size: 2vw;
  z-index: 100;
  padding: 1vw;
  font-family: Consolas;
`;

const Button = styled.div`
  color: #252525;
  padding: 1vw;
  text-align: center;
  font-weight: 900;
  flex-grow: 1;
  font-size: 2.5vw;
  border: .5vw solid #252525;
  position: absolute;
  left: 1vw;
  right: 1vw;
  bottom: 1vw;
  cursor: pointer;
  :hover{
    background-color: #63656a;
  }
`;

const Hr = styled.hr`
  border: 0px;
  padding: 0px;
  border-bottom: .5vw solid #252525;
`;

const H1 = styled.h1`
  font-size: 2.5vw;
  margin: 0px;
  padding: 0px;
  text-align: center;
`;

const Spacer = styled.div`
  flex-grow: 1;
  flex-direction: column;
`;

export default ({ title, desc, button, onContinue }) => (
  <Container>
    <H1>{title}</H1>
    <Hr />
    {desc}
    <Spacer />
    <Button onClick={onContinue}>
      {button}
    </Button>
  </Container>
);