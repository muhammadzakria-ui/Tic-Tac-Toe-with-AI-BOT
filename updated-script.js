const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");

let turnO = true; // true = Human (O), false = Computer (X)
let board = ["", "", "", "", "", "", "", "", ""];

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const scores = { X: 1, O: -1, draw: 0 };

// Handle click by Human
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (turnO && box.innerText === "") {
      box.innerText = "O";
      box.disabled = true;
      board[index] = "O";
      checkWinner();

      setTimeout(() => {
        if (!turnO) computerMove();
      }, 400);

      turnO = false;
    }
  });
});

const checkWinner = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      board[a] && board[a] === board[b] && board[b] === board[c]
    ) {
      showWinner(board[a]);
      return;
    }
  }

  if (board.every(cell => cell !== "")) {
    msg.innerText = "It's a Draw!";
    msgContainer.classList.remove("hide");
  }
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations! Player ${winner} is the winner!`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  boxes.forEach(box => box.disabled = true);
};

const enableBoxes = () => {
  boxes.forEach(box => {
    box.innerText = "";
    box.disabled = false;
  });
};

const resetGame = () => {
  turnO = true;
  board = ["", "", "", "", "", "", "", "", ""];
  enableBoxes();
  msgContainer.classList.add("hide");
};

const computerMove = () => {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "X";
      let score = minimax(board, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== undefined) {
    boxes[move].innerText = "X";
    boxes[move].disabled = true;
    board[move] = "X";
    checkWinner();
    turnO = true;
  }
};

const minimax = (newBoard, isMaximizing) => {
  let result = evaluate(newBoard);
  if (result !== null) return scores[result];

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, false);
        newBoard[i] = "";
        best = Math.max(score, best);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, true);
        newBoard[i] = "";
        best = Math.min(score, best);
      }
    }
    return best;
  }
};

const evaluate = (board) => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      board[a] && board[a] === board[b] && board[b] === board[c]
    ) {
      return board[a]; // 'X' or 'O'
    }
  }

  if (board.every(cell => cell !== "")) return "draw";
  return null;
};

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
