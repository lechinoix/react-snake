import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GameGrid, SnakeCell, Fruit, Counter } from './Snake.style';

class Snake extends Component {
  static initialState = {
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

  static defaultProps = {
    grid: 12,
    cell: 30,
    frame: 100,
  }

  constructor(props) {
    super(props);
    this.state = Snake.initialState;
  }

  componentDidMount() {
    this.goForward();
    window.addEventListener('keypress', this.changeNextMove);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.changeNextMove);
  }

  setNewFruit = () => {
    let newFruit = {
      x: Math.round(Math.random() * (this.props.grid - 1)),
      y: Math.round(Math.random() * (this.props.grid - 1)),
    };
    while (!this.checkCellIsEmpty(newFruit) &&
      this.isSameCell(newFruit, this.state.fruit)) {
      newFruit = {
        x: Math.round(Math.random() * (this.props.grid - 1)),
        y: Math.round(Math.random() * (this.props.grid - 1)),
      };
    }
    return newFruit;
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

  goForward = () => {
    const newSnakeCell = this.createNewCell();

    if (!this.isNextMoveValid(newSnakeCell)) {
      this.setState({ gameOver: true });
      return;
    }

    const snake = [...this.state.snake];
    if (this.isSameCell(newSnakeCell, this.state.fruit)) {
      this.eatFruit();
    } else {
      snake.shift();
    }

    snake.push(newSnakeCell);
    this.setState({ snake, previousMove: this.state.nextMove });

    window.setTimeout(this.goForward, this.props.frame);
  }

  eatFruit = () => this.setState({ fruit: this.setNewFruit(), count: this.state.count + 1 });

  isSameCell = (cell1, cell2) => (cell1.x === cell2.x && cell1.y === cell2.y)

  checkCellIsEmpty = (cell) => this.state.snake.reduce(
    (isValid, pos) => isValid && !this.isSameCell(cell, pos),
    true
  );

  isNextMoveValid = (nextCell) => (
    this.checkCellIsEmpty(nextCell)
      && nextCell.x >= 0
      && nextCell.x < this.props.grid
      && nextCell.y >= 0
      && nextCell.y < this.props.grid
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
        this.restartGame();
        break;
      default:
    }
  }

  restartGame = () => {
    this.setState(Snake.initialState);
    this.goForward();
  }

  renderSnakeCell = ({ x, y }, index) => (
    <SnakeCell cell={this.props.cell} x={x} y={y} key={index} className="snake" />
  )

  render() {
    return (
      <div>
        <GameGrid grid={this.props.grid} cell={this.props.cell}>
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
          <Fruit cell={this.props.cell} position={this.state.fruit} />
        </GameGrid>
        <Counter>You ate {this.state.count} fruits</Counter>
      </div>
    );
  }
}

Snake.propTypes = {
  grid: PropTypes.number,
  cell: PropTypes.number,
  frame: PropTypes.number,
};

export default Snake;
