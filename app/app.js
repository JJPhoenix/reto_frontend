let origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const thinkMessage = document.getElementById('thinkBot')
const myTurn = document.getElementById('myturn')
const playerName = document.getElementById('playerName')
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const cells = document.querySelectorAll('.cell')

startGame()

function startGame(){
    if (playerName.value.length < 1){
        document.querySelector(".endgame").style.display = "block";
        document.querySelector(".endgame .text").innerText = "Ingrese su nombre";
    }else{
        document.querySelector(".endgame").style.display = "block";
        document.querySelector(".endgame .text").innerText = "Inicie";
        if (random(0,10) % 2 === 0){
            thinkMessage.style.display = 'block'
            setTimeout(()=>{
                thinkMessage.style.display = 'none'
                turn(random(0,8),aiPlayer)
            },3000)
        }else{
            myTurn.style.display = 'block'
            myTurn.innerText = 'Su turno'
            setTimeout(()=>{
                myTurn.style.display = 'none'
            },2000)
        }
    }
    setTimeout(()=>{
        document.querySelector(".endgame").style.display = "none";
    },2000)
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i<cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick, false);
    }
}

function random(min, max){
    return Math.floor((Math.random() * (max - min + 1)) + min)
}

function turnClick(square){
    if (playerName.value.length > 1){
        if (typeof origBoard[square.target.id] == 'number') {
            turn(square.target.id, huPlayer)
            if (!checkTie()) {
                thinkMessage.style.display = 'block'
                for (let i = 0; i < cells.length; i++) {
                    cells[i].removeEventListener('click', turnClick, false);
                    cells[i].style.cursor = 'default'
                }
                setTimeout(()=>{
                    turn(bestSpot(), aiPlayer)
                    thinkMessage.style.display = 'none'
                    for (let i = 0; i<cells.length; i++){
                        cells[i].addEventListener('click',turnClick, false);
                        cells[i].style.cursor = 'pointer'
                    }
                },2000)
            }
        }
    }else{
        document.querySelector(".endgame").style.display = "block";
        document.querySelector(".endgame .text").innerText = "Ingrese su nombre";
        setTimeout(()=>{
            document.querySelector(".endgame").style.display = "none";
        },2000)
    }
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player

    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player === huPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(  gameWon.player === huPlayer ? playerName.value + " ganó!!" : playerName.value + " no ganó!! :(")
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;

    setTimeout(()=>{
        document.querySelector(".endgame").style.display = "none";
    },2000)
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    //return emptySquares()[0]; aleatorio
    return minimax(origBoard, aiPlayer).index
}

function checkTie() {
    if (emptySquares().length === 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Empate!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    let availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            let result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if(player === aiPlayer) {
        let bestScore = -10000;
        for(let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for(let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
