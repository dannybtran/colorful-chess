let board; // object returned from the chess.js library

let control = {}; // object that stores white (w) and black (b) control counts
                  // the key is a number 0...63 that represents one of the squares
                  // on the chess board ... e.g. { 43: { 'w': 2, 'b': 3 } }
                  // which means the square '43' is controlled twice by white and
                  // three times by black
let influencers = {}; // object that stores list of the squares that are influencing
                      // a particular square
                      // ... e.g. { 's43': { 's42': true, 's57': true } }
                      // which means square 43 is influenced by the pieces on
                      // square 42 and square 57

// this function takes a piece object (p) a square coordinate (sqr_xy) and an
// influencer coordinate (inf_xy). it increment the color control of the square
// based on the piece color and will add the influencer square to the list of
// influencers of that square
const addControl = (influencer, sqr_xy, inf_xy) => {

  const k = sqr_xy.y * 8 + sqr_xy.x // calculate 0...63 value based on row/column coord
  const target = board[sqr_xy.y][sqr_xy.x]

  // if entry doesn't exist in control object, create it
  control[k] = {
    w: (control[k] || {}).w || 0,
    b: (control[k] || {}).b || 0
  }

  // increment control counter for the square and piece color
  control[k][influencer?.color] += 1

  // if entry doesn't exist in influencer object, create it
  influencers[`s${k}`] = influencers[`s${k}`] || {}

  // add influencer to object
  influencers[`s${k}`][`s${inf_xy.y * 8 + inf_xy.x}`] = true

  // grab the HTML element for the square
  const $square = document.getElementById(`s${k}`)

  // calculate the overall control value for the square
  // negative means black, positive means white
  const value = control[k].w - control[k].b

  // colors
  const color_hanging = 'rgb(255,105,180)'
  const color_black_controlled =`rgba(252, 214, 112, ${(3*(Math.abs(value)+1))/8})`
  const color_white_controlled = `rgba(72, 113, 247, ${(3*(Math.abs(value)+1))/8})`
  const color_conflict = `rgba(249, 105, 14, ${(Math.abs(control[k].w) + 1)/3})`

  // black control
  if (value < 0) {
    if (target?.color === 'w') {
      // if this is a white piece and black is "in control" it's hanging
      $square.style.backgroundColor = color_hanging
    } else {
      $square.style.backgroundColor = color_black_controlled
    }
  }

  // white control
  if (value > 0) {
    if (target?.color === 'b') {
      $square.style.backgroundColor = color_hanging
    } else {
      $square.style.backgroundColor = color_white_controlled
    }
  }

  // equal control ... "conflict"
  if (value === 0 && control[k].w > 0) {
    $square.style.backgroundColor = color_conflict
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
      addControl(p, {x: x, y: y + dy}, {x, y})
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
      addControl(p, {x: x + dx, y: y}, {x, y})
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
      addControl(p, {x: x, y: y + dy}, {x, y})
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
      addControl(p, {x: x + dx, y: y}, {x, y})
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
      addControl(p, {x: x + dx, y: y + dy}, {x, y})
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
      addControl(p, {x: x + dx, y: y + dy}, {x, y})
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
      addControl(p, {x: x + dx, y: y + dy}, {x, y})
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
      addControl(p, {x: x + dx, y: y + dy}, {x, y})
      if (newPiece) {
        checkingDownRight = false
      }
      dy += 1
      dx += 1
    }
  }
};

const checkSquare = (p, sqr_xy, inf_xy) => {
  const { x, y } = sqr_xy
  if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
    addControl(p, sqr_xy, inf_xy)
  }
};

const checkKing = (p, x, y) => {
  checkSquare(p, {x: x - 1, y: y - 1}, {x, y})
  checkSquare(p, {x: x + 0, y: y - 1}, {x, y})
  checkSquare(p, {x: x + 1, y: y - 1}, {x, y})
  checkSquare(p, {x: x - 1, y: y + 0}, {x, y})
  checkSquare(p, {x: x + 1, y: y + 0}, {x, y})
  checkSquare(p, {x: x - 1, y: y + 1}, {x, y})
  checkSquare(p, {x: x + 0, y: y + 1}, {x, y})
  checkSquare(p, {x: x + 1, y: y + 1}, {x, y})
};

const checkKnight = (p, x, y) => {
  checkSquare(p, {x: x - 1, y: y - 2}, {x, y})
  checkSquare(p, {x: x + 1, y: y - 2}, {x, y})
  checkSquare(p, {x: x - 2, y: y - 1}, {x, y})
  checkSquare(p, {x: x + 2, y: y - 1}, {x, y})
  checkSquare(p, {x: x - 2, y: y + 1}, {x, y})
  checkSquare(p, {x: x + 2, y: y + 1}, {x, y})
  checkSquare(p, {x: x - 1, y: y + 2}, {x, y})
  checkSquare(p, {x: x + 1, y: y + 2}, {x, y})
};

const checkPawn = (p, x, y) => {
  switch(p?.color) {
    case 'w':
      checkSquare(p, {x: x - 1, y: y - 1}, {x, y})
      checkSquare(p, {x: x + 1, y: y - 1}, {x, y})
      break;
    case 'b':
      checkSquare(p, {x: x - 1, y: y + 1}, {x, y})
      checkSquare(p, {x: x + 1, y: y + 1}, {x, y})
      break;
  }
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
      checkPawn(p, x, y)
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
  control = {} // clear control object
  influencers = {} // clear influencers object
  $board.innerHTML = '' // clear the existing chess board HTML

  board = chess.board() // grab the board array from the chess object

  // create the chessboard HTML
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

  // loop through the board array and calculate control
  // and draw piece
  board.map((r, y) => {
    r.map((p, x) => {
      const key = `s${y * 8 + x}`
      const $square = document.getElementById(key)
      const $piece = $square.getElementsByClassName('piece')[0]
      calcControl(p, x, y)
      $piece.innerHTML = (svgs[p?.type || ''] || {})[p?.color || ''] || ''
    })
  })
};

const squareHoverOn = (e) => {
  const k = e.target.id.replace('s','')
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
