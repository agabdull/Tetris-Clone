//The table cell indices are 0-based

const grid = document.getElementById('main-grid');
const gameOverMessage = document.getElementById('game-over-message');
const linesCleared = document.getElementById('lines-cleared');

const width = 10;
const height= 18;
let x = 3;
let y = 16;
let type = genPieceType();
let rot = 0;
let key = "";
let activeCellArr = [[[]],[],[],[]];
let ghostCellArr = [[[]],[],[],[]];
let potentialCellArr = [[[]],[],[],[]];
let gameOver = false;
let numLinesCleared = 0;
let highscore = 0;

if (localStorage.highscore){
    highscore = parseInt(localStorage.highscore);
} else {
    localStorage.setItem('highscore', highscore);
}

linesCleared.innerText = `Lines cleared: ${numLinesCleared}        High score: ${highscore}`;

function drawGrid(){
    let html = "";
    for(i=height-1; i>=0; i--){
        if (i>14){
            html += `<tr id="row-${i}" style ="display: none;">`;
        } else {
            html += `<tr id="row-${i}">`;
        }
        for(j=0; j<width; j++){
            html += `<td id="cell-${j}-${i}"> </td>`;
        }
        html += "</tr>";
}
    grid.innerHTML = html;
}

function drawPiece(){
    activeCellArr.forEach(arr => {
        document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.add(`${type}`);
    });

    ghostCellArr.forEach(arr => {
        document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.add('ghost');
    });
}

function undrawPiece(){
    activeCellArr.forEach(arr => {
            document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.remove(`${type}`);
    });

    ghostCellArr.forEach(arr => {
        document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.remove('ghost');
    });    
}



// returns true if the cells corresponding to elements of cellArr already have the class "placed"
//   in our grid, and false otherwise
function piecesOverlap(cellArr){
    let overlap = false;
    cellArr.forEach(arr => {
        if(document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.contains('placed')){
            overlap = true;
        }
    });
    return overlap;
}


function placedBelowActive(cellArr){
    let shiftedArr = cellArr.map(arr => [arr[0], arr[1]-1]);
    return piecesOverlap(shiftedArr);
}



function bottomContact(cellArr){
    let bottomRow = false;
    cellArr.forEach(arr => {
        if (arr[1] === 0){
            bottomRow = true;
        }
    })
    return bottomRow;
}


// copy active piece to ghost array, then keep lowering it until it hits something
function getGhostArray(){
    for(i=0; i<4;i++){
        ghostCellArr[i][0] = activeCellArr[i][0];
        ghostCellArr[i][1] = activeCellArr[i][1];
    }
    while(!bottomContact(ghostCellArr) && !placedBelowActive(ghostCellArr)){
        lower(ghostCellArr);
    }
}


function clearLines(){
    for (i=0; i < height; i++){
        let completed = true;
        for (j=0; j<=9; j++){
            if (!document.getElementById(`cell-${j}-${i}`).classList.contains('placed')){
                completed = false;
                break;
            }
        }
        if (completed == true){
            // For each cell in a row equal to or above k, replace contents with the row above it
            //   But the contents of the cell are determined by the classes!
            for (k=i; k< height-1; k++){
                for (l=0; l<=9; l++){
                    document.getElementById(`cell-${l}-${k}`).className = document.getElementById(`cell-${l}-${k+1}`).className;
                }
            }
            let emptyRow = "";
            for (l=0; l<=9;l++){
                emptyRow += `<td id=cell-${l}-${height-1}>`;
            }
            document.getElementById(`row-${height-1}`).innerHTML = emptyRow;
            i--;  // we just shifted the next row back one index, but we still want to check it!

            numLinesCleared += 1;
            if (numLinesCleared > highscore){
                highscore = numLinesCleared;
                localStorage.highscore = highscore;
            }
            linesCleared.innerText = `Lines cleared: ${numLinesCleared}        High score: ${highscore}`;
        }
    }
}


function placePiece(){
    activeCellArr.forEach(arr => {
        document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.add('placed');
    });
}

function newPiece(){
    x = 3;
    y = 16;
    type = genPieceType();
    rot = 0;
}

function gameOverProtocol(){
    window.clearInterval(intervalID);
    gameOver = true;
    gameOverMessage.style.display = "inline";
}

function resetGame(){
    document.querySelectorAll('td').forEach(cell => {
        cell.className = "";
    });
    newPiece();
    activeCellArr = pieceToArr(type,x,y,rot);
    getGhostArray();
    drawPiece();

    gameOverMessage.style.display = "none";
    gameOver = false;
    numLinesCleared = 0;
    linesCleared.innerText = `Lines cleared: ${numLinesCleared}        High score: ${highscore}`;

    intervalID = window.setInterval(moveDown, 500);
}

function instantDrop(){
    undrawPiece();
    while(!bottomContact(activeCellArr) && !placedBelowActive(activeCellArr)){
        lower(activeCellArr);
        y-=1;
    }
    drawPiece();

    placePiece();
    clearLines();
    newPiece();
    activeCellArr = pieceToArr(type,x,y,rot);

    if (piecesOverlap(activeCellArr)){ // game over, our new piece is already in an invalid position
        gameOverProtocol();

    } else {
        getGhostArray();
        drawPiece();
    }
}


function moveDown(){
    // short circuiting behaviour ensures active piece not on last row during placeBelowActive function call
    if (bottomContact(activeCellArr) || placedBelowActive(activeCellArr)){
        placePiece();
        clearLines();
        newPiece();
        activeCellArr = pieceToArr(type,x,y,rot);

        if (piecesOverlap(activeCellArr)){ // game over, our new piece is already in an invalid position
            gameOverProtocol();
        } else {
            getGhostArray();
            drawPiece();
        }
    } else {
        undrawPiece();
        y-=1;
        activeCellArr = pieceToArr(type,x,y,rot);
        // don't have to redraw the ghost
        drawPiece();
    }
}


function validPosition(type, x, y, rot){
    let validPos = true;
    if (withinBounds(type, rot, x)){
        potentialCellArr = pieceToArr(type, x, y, rot);
        if (piecesOverlap(potentialCellArr)){
            validPos = false;
        }
    } else {
        validPos = false;
    }
    return validPos;
}


window.addEventListener('keydown', e =>{
    key = e.key;
    if (gameOver === true){
        if (key === "r"){
            resetGame();
        }
    } else {
    if (key === "w"){
        instantDrop();
    } else if (key === "/" && e.repeat === false){   // fast drop activated once
        window.clearInterval(intervalID);
        intervalID = window.setInterval(moveDown, 100);

    } else {
        if (key === "q"){
            if (validPosition(type, x-1, y, rot)){
                x-=1;
            }
        } else if (key === "e"){
            if (validPosition(type, x+1, y, rot)){
                x+=1;
            }

        } else if (key === "PageUp" || key === "ArrowRight"){
            if (validPosition(type, x, y, (rot+1)%4)){
                rot = (rot+1)%4;
            } else if (validPosition(type, x+1, y, (rot+1)%4)){
                x+=1;
                rot = (rot+1)%4;
            } else if (validPosition(type, x-1, y, (rot+1)%4)){
                x-=1;
                rot = (rot+1)%4;
            }  else if (validPosition(type, x-2, y, (rot+1)%4) && type =="I" && rot==2){
                 x-=2;
                 rot = (rot+1)%4;
            } else if (validPosition(type, x+2, y, (rot+1)%4) && type =="I" && rot==0){
                x+=2;
                rot = (rot+1)%4;
           }

        } else if (key === "ArrowUp" || key === "ArrowDown"){
            if (validPosition(type, x, y, (rot+2)%4)){
                rot = (rot+2)%4;
            } else if (validPosition(type, x+1, y, (rot+2)%4)){
                x+=1;
                rot = (rot+2)%4;
            } else if (validPosition(type, x-1, y, (rot+2)%4)){
                x-=1;
                rot = (rot+2)%4;
            }

        } else if (key === "Home" || key === "ArrowLeft"){
            if (validPosition(type, x, y, (rot+3)%4)){
                rot = (rot+3)%4;
            } else if (validPosition(type, x+1, y, (rot+3)%4)){
                x+=1;
                rot = (rot+3)%4;
            } else if (validPosition(type, x-1, y, (rot+3)%4)){
                x-=1;
                rot = (rot+3)%4;
            }
            else if (validPosition(type, x-2, y, (rot+3)%4) && type =="I" && rot==2){
                x-=2;
                rot = (rot+3)%4;
           } else if (validPosition(type, x+2, y, (rot+3)%4) && type =="I" && rot==0){
               x+=2;
               rot = (rot+3)%4;
          }
        }

        undrawPiece();
        activeCellArr = pieceToArr(type,x,y,rot);
        getGhostArray();
        drawPiece();
    }
}
});

window.addEventListener('keyup', e =>{
    if(e.key === "/"){
        window.clearInterval(intervalID);
        intervalID = window.setInterval(moveDown, 500);
    }
});

drawGrid();
activeCellArr = pieceToArr(type,x,y,rot);
getGhostArray();
drawPiece();

var intervalID = window.setInterval(moveDown, 500);