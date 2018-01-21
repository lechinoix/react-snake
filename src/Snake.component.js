import React, { Component } from 'react';
import { GameGrid, SnakeCell, Fruit, Counter } from './Snake.style';

const GRID_SIZE = 12;
const CELL_SIZE = 30;
const FRAME_DURATION = 100;

class Snake extends Component {
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
    <SnakeCell cell={CELL_SIZE} x={x} y={y} key={index} className="snake" />
  )

  render() {
    return (
      <div>
        <GameGrid grid={GRID_SIZE} cell={CELL_SIZE}>
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
          <Fruit cell={CELL_SIZE} position={this.state.fruit} />
        </GameGrid>
        <Counter>You ate {this.state.count} fruits</Counter>
      </div>
    );
  }
}

export default Snake;
