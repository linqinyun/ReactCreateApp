import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {

    return (
      <div>
        {
          Array(3).fill(null).map((item, x) => (
            <div className="board-row" key={x}>
              {
                Array(3).fill(null).map((itemy, y) => (
                  this.renderSquare(3 * x + y)
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      position: [{
        row: null,
        colum: null
      }],
      stepNumber: 0,
      xIsNext: true,
      sort: true
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const position = this.state.position.slice(0, this.state.stepNumber + 1)
    // console.log(position)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const row = parseInt(i % 3 + 1)
    const colum = parseInt(i / 3 + 1)
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      position: position.concat([{
        row: row,
        colum: colum
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }
  changeSquence() {
    this.setState({
      sort: !this.state.sort,
    });
  }
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + '最后落棋点:(' + this.state.position[move].colum + ',' + this.state.position[move].row + ')' :
        'Go to game start'
      let font = (move === this.state.stepNumber) ?
        { fontWeight: 'bold' } :
        { fontWeight: 'normal' }
      return (
        <li key={move}>
          <button style={font} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    let status
    if (winner) {
      status = "Winner：" + winner.winnerName;
      for (let i of winner.squares) {
        document.getElementsByClassName('square')[i].style = "background: lightblue;";
      }

    } else if (this.state.stepNumber === 9) {
      status = 'no winner'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/*4.添加一个可以升序或降序显示历史记录的按钮。*/}
          <button onClick={() => this.changeSquence()}>{this.state.sort ? "倒序" : "正序"}</button>
          <ol>{this.state.sort ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        squares: [a, b, c],
        winnerName: squares[a],
      }
    }
  }
  return null;
}