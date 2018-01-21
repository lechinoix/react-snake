import styled from 'styled-components';

export const GameGrid = styled.div`
  position: relative;
  width: ${GRID_SIZE * CELL_SIZE}px;
  height: ${GRID_SIZE * CELL_SIZE}px;
  border: 1px solid #999;
  margin: auto;

  .game-over {
    color: red;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;

    .title {
      font-size: 30px;
      font-weight: bold;
    }
  }
`;

export const SnakeCell = styled.div`
  position: absolute;
  left: ${({ x }) => `${x * CELL_SIZE}px;`}
  top: ${({ y }) => `${y * CELL_SIZE}px;`}
  background-color: #333;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  z-index: 0;
`;

export const Fruit = styled.div`
  position: absolute;
  left: ${({ position }) => `${position.x * CELL_SIZE}px;`}
  top: ${({ position }) => `${position.y * CELL_SIZE}px;`}
  background-color: red;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border-radius: 50%;
  z-index: 0;
`;
