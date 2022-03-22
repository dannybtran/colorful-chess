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

// `addControl` - this function takes a piece object (influencer) a square coordinate (sqr_xy)
// and an influencer coordinate (inf_xy). it increment the color control of the square
// based on the piece color and will add the influencer square to the list of
// influencers of that square
const addControl = (influencer, sqr_xy, inf_xy) => {

  // calculate 0...63 value based on row/column coord
  const k = sqr_xy.y * 8 + sqr_xy.x
  const target_piece = board[sqr_xy.y][sqr_xy.x]

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
    if (target_piece?.color === 'w') {
      // if this is a white piece and black is "in control" it's hanging
      $square.style.backgroundColor = color_hanging
    } else {
      $square.style.backgroundColor = color_black_controlled
    }
  }

  // white control
  if (value > 0) {
    if (target_piece?.color === 'b') {
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

const calcSquare = (influencer, sqr_xy, inf_xy) => {
  const { x, y } = sqr_xy
  if (y < 0 || y > 7 || x < 0 || x > 7) { return false; }
  else {
    addControl(influencer, sqr_xy, inf_xy)
    if (board[sqr_xy.y][sqr_xy.x]) { return false; }
  }
  return true;
};

const calcRook = (influencer, inf_xy) => {
  const {x, y} = inf_xy
  let dy = 0
  let dx = 0
  // check up
  dy = -1; dx = 0
  while(calcSquare(influencer, {x: x + dx, y: y + dy}, inf_xy)) { dy -= 1 }
  // check right
  dy =  0; dx = 1
  while(calcSquare(influencer, {x: x + dx, y: y + dy}, inf_xy)) { dx += 1 }
  // check down
  dy =  1; dx = 0
  while(calcSquare(influencer, {x: x + dx, y: y + dy}, inf_xy)) { dy += 1 }
  // check left
  dy =  0; dx = -1
  while(calcSquare(influencer, {x: x + dx, y: y + dy}, inf_xy)) { dx -= 1 }
};

const calcBishop = (influencer, inf_xy) => {
  const {x, y} = inf_xy
  let dy = 0
  let dx = 0
  // check up left
  dy = -1; dx = -1
  while(calcSquare(influencer, {x: x + dx, y: y + dy}, inf_xy)) { dy -= 1; dx -= 1 }
  // check up right
  dy = -1; dx = 1
  while(calcSquare(influencer, {x: x + dx, y: y + dy}, inf_xy)) { dy -= 1; dx += 1 }
  // check down left
  dy = 1; dx = -1
  while(calcSquare(influencer, {x: x + dx, y: y + dy}, inf_xy)) { dy += 1; dx -= 1 }
  // check down right
  dy = 1; dx = 1
  while(calcSquare(influencer, {x: x + dx, y: y + dy}, inf_xy)) { dy += 1; dx += 1 }
};

const calcKing = (influencer, inf_xy) => {
  const {x, y} = inf_xy
  calcSquare(influencer, {x: x - 1, y: y - 1}, inf_xy)
  calcSquare(influencer, {x: x + 0, y: y - 1}, inf_xy)
  calcSquare(influencer, {x: x + 1, y: y - 1}, inf_xy)
  calcSquare(influencer, {x: x - 1, y: y + 0}, inf_xy)
  calcSquare(influencer, {x: x + 1, y: y + 0}, inf_xy)
  calcSquare(influencer, {x: x - 1, y: y + 1}, inf_xy)
  calcSquare(influencer, {x: x + 0, y: y + 1}, inf_xy)
  calcSquare(influencer, {x: x + 1, y: y + 1}, inf_xy)
};

const calcKnight = (influencer, inf_xy) => {
  const {x, y} = inf_xy
  calcSquare(influencer, {x: x - 1, y: y - 2}, inf_xy)
  calcSquare(influencer, {x: x + 1, y: y - 2}, inf_xy)
  calcSquare(influencer, {x: x - 2, y: y - 1}, inf_xy)
  calcSquare(influencer, {x: x + 2, y: y - 1}, inf_xy)
  calcSquare(influencer, {x: x - 2, y: y + 1}, inf_xy)
  calcSquare(influencer, {x: x + 2, y: y + 1}, inf_xy)
  calcSquare(influencer, {x: x - 1, y: y + 2}, inf_xy)
  calcSquare(influencer, {x: x + 1, y: y + 2}, inf_xy)
};

const calcPawn = (influencer, inf_xy) => {
  const {x, y} = inf_xy
  switch(influencer?.color) {
    case 'w':
      calcSquare(influencer, {x: x - 1, y: y - 1}, inf_xy)
      calcSquare(influencer, {x: x + 1, y: y - 1}, inf_xy)
      break;
    case 'b':
      calcSquare(influencer, {x: x - 1, y: y + 1}, inf_xy)
      calcSquare(influencer, {x: x + 1, y: y + 1}, inf_xy)
      break;
  }
};

const calcControl = (influencer, inf_xy) => {
  switch(influencer?.type) {
    case 'r':
      calcRook(influencer, inf_xy)
      break;
    case 'b':
      calcBishop(influencer, inf_xy)
      break;
    case 'q':
      calcRook(influencer, inf_xy)
      calcBishop(influencer, inf_xy)
      break;
    case 'p':
      calcPawn(influencer, inf_xy)
      break;
    case 'k':
      calcKing(influencer, inf_xy)
      break;
    case 'n':
      calcKnight(influencer, inf_xy)
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
    const $darkener = document.createElement('div')
    $darkener.classList.add('darkener')
    $label1.classList.add('piece')
    $label2.classList.add('control')
    $div.classList.add('square')
    $div.id = `s${id}`
    if ((id%2 ? 0 : 1) === Math.floor(id/8)%2) {
      $div.appendChild($darkener)
    }
    $div.appendChild($label1)
    $div.appendChild($label2)
    $board.appendChild($div)
  }

  // loop through the board array and each time a piece (i.e. influencer)
  // is found, calculate the control it exerts on squares
  board.forEach((r, y) => {
    r.forEach((influencer, x) => {
      if (influencer) {
        const key = `s${y * 8 + x}`
        const $square = document.getElementById(key)
        const $piece = $square.getElementsByClassName('piece')[0]
        calcControl(influencer, {x, y})
        $piece.innerHTML = (svgs[influencer?.type || ''] || {})[influencer?.color || ''] || ''
      }
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
