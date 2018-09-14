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
