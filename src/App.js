import styled from 'styled-components';
import React, { Component } from 'react';
import './App.css';

export const GRID_SIZE = 12;
export const CELL_SIZE = 30;
export const FRAME_DURATION = 100;

const GameGrid = styled.div`
  position: relative;
  width: ${GRID_SIZE * CELL_SIZE}px;
  height: ${GRID_SIZE * CELL_SIZE}px;
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

const SnakeCell = styled.div`
  position: absolute;
  left: ${({ x }) => `${x * CELL_SIZE}px;`}
  top: ${({ y }) => `${y * CELL_SIZE}px;`}
  background-color: #333;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  z-index: 0;
`;

const Fruit = styled.div`
  position: absolute;
  left: ${({ position }) => `${position.x * CELL_SIZE}px;`}
  top: ${({ position }) => `${position.y * CELL_SIZE}px;`}
  background-color: red;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border-radius: 50%;
  z-index: 0;
`;

const Counter = styled.p`
  text-align: center;
  left: 0;
  right: 0;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  componentDidMount() {
    this.updateGame();
    window.addEventListener('keypress', this.changeNextMove);
  }

  setNewFruit = () => {
    let newFruit = {
      x: Math.round(Math.random() * (GRID_SIZE - 1)),
      y: Math.round(Math.random() * (GRID_SIZE - 1)),
    };
    while (!this.checkCellIsEmpty(newFruit) &&
      this.isSameCell(newFruit, this.state.fruit)) {
      newFruit = {
        x: Math.round(Math.random() * (GRID_SIZE - 1)),
        y: Math.round(Math.random() * (GRID_SIZE - 1)),
      };
    }
    return newFruit;
  }

  initialState = {
    snake: [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    fruit: { x: 2, y: 6 },
    nextMove: 'right',
    previousMove: 'down',
    gameOver: false,
    count: 0,
  }

  createNewCell = () => {
    const newSnakeCell = Object.assign({}, this.state.snake[this.state.snake.length - 1]);
    switch (this.state.nextMove) {
      case 'right':
        newSnakeCell.x += 1;
        break;
      case 'left':
        newSnakeCell.x -= 1;
        break;
      case 'up':
        newSnakeCell.y -= 1;
        break;
      case 'down':
        newSnakeCell.y += 1;
        break;
      default:
    }
    return newSnakeCell;
  }

  updateGame = () => {
    const newSnakeCell = this.createNewCell();

    if (!this.isNextMoveValid(newSnakeCell)) {
      this.setState({ gameOver: true });
      return;
    }

    let snake;
    if (newSnakeCell.x === this.state.fruit.x &&
        newSnakeCell.y === this.state.fruit.y) {
      snake = [...this.state.snake];
      this.setState({ fruit: this.setNewFruit(), count: this.state.count + 1 });
    } else {
      snake = this.state.snake.slice(1, this.state.snake.length);
    }

    snake.push(newSnakeCell);
    this.setState({ snake, previousMove: this.state.nextMove });

    window.setTimeout(this.updateGame, FRAME_DURATION);
  }

  isSameCell = (cell1, cell2) => (cell1.x === cell2.x && cell1.y === cell2.y)

  checkCellIsEmpty = (cell) => this.state.snake.reduce(
    (isValid, pos) => isValid && !this.isSameCell(cell, pos),
    true
  );

  isNextMoveValid = (nextCell) => (
    this.checkCellIsEmpty(nextCell)
      && nextCell.x >= 0
      && nextCell.x < GRID_SIZE
      && nextCell.y >= 0
      && nextCell.y < GRID_SIZE
  )

  changeNextMove = (e) => {
    switch (e.key) {
      case 'a':
        if (this.state.previousMove === 'right') return;
        this.setState({ nextMove: 'left' });
        break;
      case 'w':
        if (this.state.previousMove === 'down') return;
        this.setState({ nextMove: 'up' });
        break;
      case 's':
        if (this.state.previousMove === 'up') return;
        this.setState({ nextMove: 'down' });
        break;
      case 'd':
        if (this.state.previousMove === 'left') return;
        this.setState({ nextMove: 'right' });
        break;
      case 'r':
        this.setState(this.initialState);
        this.updateGame();
        break;
      default:
    }
  }

  renderSnakeCell = ({ x, y }, index) => (
    <SnakeCell x={x} y={y} key={index} className="snake" />
  )

  render() {
    return (
      <div>
        <GameGrid>
          {
            this.state.gameOver &&
              <p className="game-over">
                <span className="title">GAME OVER</span>
                <br />
                <br />
                Press R to restart
              </p>
          }
          {this.state.snake.map(this.renderSnakeCell)}
          <Fruit position={this.state.fruit} />
        </GameGrid>
        <Counter>You ate {this.state.count} fruits</Counter>
      </div>
    );
  }
}

export default App;
