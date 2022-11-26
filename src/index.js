import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 如果我们希望我们的组件中只有一个render的话
// 接下来我们把 Square 组件重写为一个函数组件。

//如果你想写的组件只包含一个 render 方法，
//并且不包含 state，那么使用函数组件就会更简单。
//我们不需要定义一个继承于 React.Component 的类，我们可以定义一个函数，
//这个函数接收 props 作为参数，然后返回需要渲染的元素。
//函数组件写起来并不像 class 组件那么繁琐，很多组件都可以使用函数组件来写。
//
//把 Square 类替换成下面的函数：

// Square渲染了一个按钮
//class Square extends React.Component {
//  // 首先，我们将向类中添加一个构造函数来初始化状态：
//  constructor(props) {
//    // 在JavaScript 类中，您需要super在定义子类的构造函数时始终调用
//    // 在 JavaScript class 中，每次你定义其子类的构造函数时，都需要调用 super 方法。
//    // 因此，在所有含有构造函数的的 React 组件中，构造函数必须以 super(props) 开头
//    super(props);
//    this.state = {
//      value: null,
//    };
//  }

  //render() {
  //  return (
  //    <button
  //      className="square"
  //      //props:理解成属性传递的意思
  //      // 注意函数的写法，请注意onClick={() => console.log('click')}
  //      // 我们是如何将一个函数作为onClickprop 传递的。 React 只会在点击后调用这个函数。
  //      // 遗忘() =>和书写onClick={console.log('click')}是一个常见的错误，每次组件重新渲染时都会触发。
  //      onClick={() => this.props.onClick()}
  //    >
  //      {this.props.value}
  //      {/* 使用自己内部的state来代替（忽略）props传递过来的数*/}
  //      {/*this.state.value*/}
  //    </button>
  //  );
  //}
//}
function Square(props) {
  return (
  <button className='square' onClick={props.onClick}>
   {props.value}
  </button>
  );
}

// Board 渲染了九个方格
class Board extends React.Component {
  // 提升state状态管理，放在game中
  //constructor(props) {
  //  super(props);
  //  this.state = {
  //    squares: Array(9).fill(null),
  //    // 设置state中默认值true，就是默认为‘X’
  //    xIsNext: true,
  //  };
  //}

 
  // renderSquare 函数，下面的render中进行了调用
  renderSquare(i) {
    // 传递一个名为 value 的 prop 到 Square 当中
    // 注意这里我们就是把i的值传递给Square了通过props进行了传递
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    ); // 也就是完成了父组件传递到子组件的过程
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null)
      }],
      // 设置state中默认值true，就是默认为‘X’
      xIsNext: true,
      // 记录步数
      stepNumber: 0,
    };
  }

 handClick(i) {
    // 
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // 对当前数据进行了拷贝；之后就是正常的判断，以及赋值操作，还有提示下部信操作
    const squares = current.squares.slice();
    // 这个就是说如果有已经获胜的或者说已经填写过的（就是不允许修改）的都直接返回
    if(calculateWinner(squares) || squares[i]) return ;
    // 判断是否为true，为true就是X
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // 对这个默认值进行取反
      xIsNext: !this.state.xIsNext,
      // concat() 方法可能与你比较熟悉的 push() 方法不太一样
      // 它并不会改变原数组，所以我们推荐使用 concat()。
      history: history.concat([{
        squares:squares,
      }]),
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // 获取history的数组
    const history = this.state.history;
    // 获取数组中最后一个数据，也就是最新的记录
    // const current = history[history.length - 1];
    // 最后我们需要render渲染的是stepNumer的图形
    const current = history[this.state.stepNumber];
    // 获取这个最新的记录中的squares来确定是否获胜
    const winner = calculateWinner(current.squares);
    // 当我们遍历 history 数组时，step 变量指向的是当前 history 元素的值，
    // 而 move 则指向的是 history 元素的索引
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
       <li key={move}>
         <button onClick={() => this.jumpTo(move)}>
          {desc}
          </button> 
        </li>
      );
    });

    let status;
    if(winner) {
      status = 'Winner: ' + winner; 
    }else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X':'O') 
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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
      return squares[a];
    }
  }
  return null;
}
// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
