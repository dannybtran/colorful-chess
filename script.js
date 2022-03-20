const ascii = {
  'r': {
    'w': '&#9814',
    'b': '&#9820',
  },
  'p': {
    'w': '&#9817',
    'b': '&#9823',
  },
  'n': {
    'w': '&#9816',
    'b': '&#9822',
  },
  'b': {
    'w': '&#9815',
    'b': '&#9821',
  },
  'k': {
    'w': '&#9812',
    'b': '&#9818',
  },
  'q': {
    'w': '&#9813',
    'b': '&#9819',
  },

};

let board;

let control = {};
let influencers = {};

const addControl = (p, x, y, ox, oy) => {
  const k = y * 8 + x
  const np = board[y][x]
  control[k] = {
    w: (control[k] || {}).w || 0,
    b: (control[k] || {}).b || 0
  }
  influencers[`s${k}`] = influencers[`s${k}`] || {}
  influencers[`s${k}`][`s${oy * 8 + ox}`] = true

  control[k][p?.color] += 1
  const $square = document.getElementById(`s${k}`)
  const $control = $square.getElementsByClassName('control')[0]
  const value = control[k].w - control[k].b
  $control.innerText = String(value)

  // colors
  const hanging = 'rgb(255,105,180)'
  const black_controlled =`rgba(252, 214, 112, ${(3*(Math.abs(value)+1))/8})`
  const white_controlled = `rgba(72, 113, 247, ${(3*(Math.abs(value)+1))/8})`
  const conflict = `rgba(249, 105, 14, ${(Math.abs(control[k].w) + 1)/3})`

  if (value < 0) {
    if (np?.color === 'w') {
      $square.style.backgroundColor = hanging
    } else {
      $square.style.backgroundColor = black_controlled
    }
  }
  if (value > 0) {
    if (np?.color === 'b') {
      $square.style.backgroundColor = hanging
    } else {
      $square.style.backgroundColor = white_controlled
    }
  }
  if (value === 0 && control[k].w > 0) {
    $square.style.backgroundColor = conflict
  }

};

const checkRook = (p, x, y) => {
  // check up
  let checkingUp = true
  dy = -1
  while (checkingUp) {
    if (y + dy < 0 || y + dy > 7) { checkingUp = false }
    else {
      const newPiece = board[y + dy][x]
      addControl(p, x, y + dy, x, y)
      if (newPiece) {
        checkingUp = false
      }
      dy -= 1
    }
  }
  // check right
  let checkingRight = true
  let dx = 1
  while (checkingRight) {
    if (x + dx < 0 || x + dx > 7) { checkingRight = false }
    else {
      const newPiece = board[y][x + dx]
      addControl(p, x + dx, y, x, y)
      if (newPiece) {
        checkingRight = false
      }
      dx += 1
    }
  }
  // check down
  let checkingDown = true
  dy = 1
  while (checkingDown) {
    if (y + dy < 0 || y + dy > 7) { checkingDown = false }
    else {
      const newPiece = board[y + dy][x]
      addControl(p, x, y + dy, x, y)
      if (newPiece) {
        checkingDown = false
      }
      dy += 1
    }
  }
  // check left
  let checkingLeft = true
  dx = -1
  while (checkingLeft) {
    if (x + dx < 0 || x + dx > 7) { checkingLeft = false }
    else {
      const newPiece = board[y][x + dx]
      addControl(p, x + dx, y, x, y)
      if (newPiece) {
        checkingLeft = false
      }
      dx -= 1
    }
  }
};

const checkBishop = (p, x, y) => {
  // checkUpLeft
  let checkingUpLeft = true
  dy = -1
  dx = -1
  while (checkingUpLeft) {
    if (y + dy < 0 || y + dy > 7 || x + dx < 0 || x + dx > 7) { checkingUpLeft = false }
    else {
      const newPiece = board[y + dy][x + dx]
      addControl(p, x + dx, y + dy, x, y)
      if (newPiece) {
        checkingUpLeft = false
      }
      dy -= 1
      dx -= 1
    }
  }
  // checkUpRight
  let checkingUpRight = true
  dy = -1
  dx = 1
  while (checkingUpRight) {
    if (y + dy < 0 || y + dy > 7 || x + dx < 0 || x + dx > 7) { checkingUpRight = false }
    else {
      const newPiece = board[y + dy][x + dx]
      addControl(p, x + dx, y + dy, x, y)
      if (newPiece) {
        checkingUpRight = false
      }
      dy -= 1
      dx += 1
    }
  }
  // checkDownLeft
  let checkingDownLeft = true
  dy = 1
  dx = -1
  while (checkingDownLeft) {
    if (y + dy < 0 || y + dy > 7 || x + dx < 0 || x + dx > 7) { checkingDownLeft = false }
    else {
      const newPiece = board[y + dy][x + dx]
      addControl(p, x + dx, y + dy, x, y)
      if (newPiece) {
        checkingDownLeft = false
      }
      dy += 1
      dx -= 1
    }
  }
  // checkDownRight
  let checkingDownRight = true
  dy = 1
  dx = 1
  while (checkingDownRight) {
    if (y + dy < 0 || y + dy > 7 || x + dx < 0 || x + dx > 7) { checkingDownRight = false }
    else {
      const newPiece = board[y + dy][x + dx]
      addControl(p, x + dx, y + dy, x, y)
      if (newPiece) {
        checkingDownRight = false
      }
      dy += 1
      dx += 1
    }
  }
};

const checkSquare = (p, x, y, ox, oy) => {
  if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
    addControl(p, x, y, ox, oy)
  }
};

const checkKing = (p, x, y) => {
  checkSquare(p, x - 1, y - 1, x, y)
  checkSquare(p, x + 0, y - 1, x, y)
  checkSquare(p, x + 1, y - 1, x, y)
  checkSquare(p, x - 1, y, x, y)
  checkSquare(p, x + 1, y, x, y)
  checkSquare(p, x - 1, y + 1, x, y)
  checkSquare(p, x + 0, y + 1, x, y)
  checkSquare(p, x + 1, y + 1, x, y)
};

const checkKnight = (p, x, y) => {
  checkSquare(p, x - 1, y - 2, x, y)
  checkSquare(p, x + 1, y - 2, x, y)
  checkSquare(p, x - 2, y - 1, x, y)
  checkSquare(p, x + 2, y - 1, x, y)
  checkSquare(p, x - 2, y + 1, x, y)
  checkSquare(p, x + 2, y + 1, x, y)
  checkSquare(p, x - 1, y + 2, x, y)
  checkSquare(p, x + 1, y + 2, x, y)
};

const calcControl = (p, x, y) => {
  switch(p?.type) {
    case 'r':
      checkRook(p, x, y)
      break;
    case 'b':
      checkBishop(p, x, y)
      break;
    case 'q':
      checkRook(p, x, y)
      checkBishop(p, x, y)
      break;
    case 'p':
      switch(p.color) {
        case 'w':
          checkSquare(p, x - 1, y - 1, x, y)
          checkSquare(p, x + 1, y - 1, x, y)
          break;
        case 'b':
          checkSquare(p, x - 1, y + 1, x, y)
          checkSquare(p, x + 1, y + 1, x, y)
          break;
      }
      break;
    case 'k':
      checkKing(p, x, y)
      break;
    case 'n':
      checkKnight(p, x, y)
      break;
  }


};

const goFen = () => {
  const $fen = document.getElementById('fen')
  const chess = new Chess($fen.value || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  go(chess)
};

const goPgn = () => {
  const $pgn = document.getElementById('pgn')
  const chess = new Chess()
  chess.load_pgn($pgn.value)
  go(chess)
};

const go = (chess) => {
  control = {}
  $board.innerHTML = ''
  board = chess.board()
  for(id of Array(64).keys()) {
    const $div = document.createElement('div')
    const $label1 = document.createElement('label')
    const $label2 = document.createElement('label')
    $label1.classList.add('piece')
    $label2.classList.add('control')
    $div.classList.add('square')
    $div.id = `s${id}`
    $div.appendChild($label1)
    $div.appendChild($label2)
    $board.appendChild($div)
  }

  board.map((r, y) => {
    r.map((p, x) => {
      const key = `s${y * 8 + x}`
      const $square = document.getElementById(key)
      const $piece = $square.getElementsByClassName('piece')[0]
      calcControl(p, x, y)
      $piece.innerHTML = (ascii[p?.type || ''] || {})[p?.color || ''] || ''
    })
  })
};

const squareHoverOn = (e) => {
  e.target.classList.add('hovered')
  const ins = Object.keys(influencers[e.target.id] || {})
  ins.forEach(i => {
    const $e = document.getElementById(i)
    $e.classList.add('influence')
  })
};

const squareHoverOff = (e) => {
  const $squares = document.getElementsByClassName('square')
  Array.from($squares).forEach($s => {
    $s.classList.remove('hovered')
    $s.classList.remove('influence')
  })
}

const $load = document.getElementById('load')
const $loadPgn = document.getElementById('loadPgn')
const $board = document.getElementById('board')

$load.addEventListener('click', goFen)
$loadPgn.addEventListener('click', goPgn)
$board.addEventListener('mouseover', squareHoverOn)
$board.addEventListener('mouseout', squareHoverOff)
goFen()
