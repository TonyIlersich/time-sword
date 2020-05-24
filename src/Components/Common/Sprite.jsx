import styled from 'styled-components';

export default styled.image`
  image-rendering: pixelated;
  transform: ${props => props.flip ? 'scaleX(-1)' : 'none'};
`;
