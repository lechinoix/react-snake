import styled from 'styled-components';

export const GameGrid = styled.div`
  position: relative;
  width: ${({ cell, grid }) => cell * grid}px;
  height: ${({ cell, grid }) => cell * grid}px;
  border: 1px solid #999;
  margin: 30px auto;

  .game-over {
    color: red;
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 1;

    .title {
      font-size: 30px;
      font-weight: bold;
    }
  }
`;

export const SnakeCell = styled.div`
  position: absolute;
  left: ${({ x, cell }) => `${x * cell}px;`}
  top: ${({ y, cell }) => `${y * cell}px;`}
  background-color: #333;
  width: ${({ cell }) => cell}px;
  height: ${({ cell }) => cell}px;
  z-index: 0;
`;

export const Fruit = styled.div`
  position: absolute;
  left: ${({ position, cell }) => `${position.x * cell}px;`}
  top: ${({ position, cell }) => `${position.y * cell}px;`}
  background-color: red;
  width: ${({ cell }) => cell}px;
  height: ${({ cell }) => cell}px;
  border-radius: 50%;
  z-index: 0;
`;

export const Counter = styled.p`
  text-align: center;
  left: 0;
  right: 0;
`;
