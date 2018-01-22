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
    let newFruit = this.chooseRandomCell();
    while (
      !this.checkCellIsEmpty(newFruit) ||
      this.isSameCell(newFruit, this.state.fruit)
    ) {
      newFruit = this.chooseRandomCell();
    }
    return newFruit;
  }

  chooseRandomCell = () => ({
    x: Math.round(Math.random() * (this.props.grid - 1)),
    y: Math.round(Math.random() * (this.props.grid - 1)),
  })

  moveSnakeHead = () => {
    const snakeHead = Object.assign({}, this.state.snake[this.state.snake.length - 1]);
    switch (this.state.nextMove) {
      case 'right':
        snakeHead.x += 1;
        break;
      case 'left':
        snakeHead.x -= 1;
        break;
      case 'up':
        snakeHead.y -= 1;
        break;
      case 'down':
        snakeHead.y += 1;
        break;
      default:
    }
    return snakeHead;
  }

  goForward = () => {
    const snakeHead = this.moveSnakeHead();

    if (!this.isNextMoveValid(snakeHead)) {
      this.setState({ gameOver: true });
      return;
    }

    const snake = [...this.state.snake];
    if (this.isSameCell(snakeHead, this.state.fruit)) {
      this.eatFruit();
    } else {
      snake.shift();
    }

    snake.push(snakeHead);
    this.setState({ snake, previousMove: this.state.nextMove });

    window.setTimeout(this.goForward, this.props.frame);
  }

  eatFruit = () => this.setState({
    fruit: this.setNewFruit(),
    count: this.state.count + 1,
  });

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
    <SnakeCell cell={this.props.cell} x={x} y={y} key={index} />
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
        <Counter>
          You ate {this.state.count} fruits
          <br />
          <br />
          Commands
          <br />
          <br />
          A : left
          <br />
          S : down
          <br />
          D : right
          <br />
          W : up
          <br />
          R : restart
        </Counter>

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
