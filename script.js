//The table cell indices are 0-based

const grid = document.getElementById('main-grid');
const gameOverMessage = document.getElementById('game-over-message');
const linesCleared = document.getElementById('lines-cleared');
const nextGrid = document.getElementById('next-grid');

const width = 10;
const height= 18;
let x = 3;
let y = 16;
let type = genPieceType();
let nextType = genPieceType();
let rot = 0;
let key = "";
let activeCellArr = [[[]],[],[],[]];
let ghostCellArr = [[[]],[],[],[]];
let potentialCellArr = [[[]],[],[],[]];
let nextPieceArr = [[[]],[],[],[]];
let gameOver = false;
let numLinesCleared = 0;
let highscore = 0;


if (localStorage.tetrisHighscore){
    highscore = parseInt(localStorage.tetrisHighscore);
} else {
    localStorage.setItem('tetrisHighscore', highscore);
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

    html = ""
    // draw next piece grid
    for(i=3; i>=0; i--){
        html += `<tr id="next-row-${i}">`;
        for(j=0; j<=2; j++){
            html += `<td id="next-cell-${j}-${i}" class="next-cell"> </td>`;
        }
        html += "</tr>";
}
    nextGrid.innerHTML = html;
}

function drawNextPiece(){
    document.querySelectorAll(".next-cell").forEach(cell => {
        cell.classList.remove("T", "S", "Z", "J", "L", "O", "I");
    });
    nextPieceArr = pieceToArr(nextType, 0, 2, 0); // active cells positions relative to nextGrid
    nextPieceArr.forEach(arr => {
        document.getElementById(`next-cell-${arr[0]}-${arr[1]}`).classList.add(`${nextType}`);
    });
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
                localStorage.tetrisHighscore = highscore;
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
    type = nextType;
    rot = 0;

    nextType = genPieceType();
}

function gameOverProtocol(){
    window.clearInterval(intervalID);
    gameOver = true;
    gameOverMessage.style.display = "inline";
}

function resetGame(){
    document.querySelectorAll('td').forEach(cell => {
        // still want to keep the class "next-cell", though, to distinguish grids
        cell.classList.remove("placed", "ghost", "T", "S", "Z", "J", "L", "O", "I"); 
    });
    newPiece();
    activeCellArr = pieceToArr(type,x,y,rot);
    getGhostArray();
    drawPiece();
    drawNextPiece();

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
        drawNextPiece();
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
            drawNextPiece();
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


function leftMove(){
    if (validPosition(type, x-1, y, rot)){
        x-=1;
    }

    undrawPiece();
    activeCellArr = pieceToArr(type,x,y,rot);
    getGhostArray();
    drawPiece();
}

function rightMove(){
    if (validPosition(type, x+1, y, rot)){
        x+=1;
    }

    undrawPiece();
    activeCellArr = pieceToArr(type,x,y,rot);
    getGhostArray();
    drawPiece();
}


window.addEventListener('keydown', e =>{
    key = e.key;
    if (gameOver === true){
        if (key === "r"){
            resetGame();
        }
    } else if (e.repeat === false){
    if (key === "w"){
        instantDrop();
    } else if (key === "9"){   // fast drop activated once
        window.clearInterval(intervalID);
        moveDown();
        intervalID = window.setInterval(moveDown, 60);

    } else {
        if (key === "q"){
            if (validPosition(type, x-1, y, rot)){
                x-=1;
            }
            leftRepeater = window.setInterval(leftMove, 90);
        } else if (key === "e"){
            if (validPosition(type, x+1, y, rot)){
                x+=1;
            }
            rightRepeater = window.setInterval(rightMove, 90);

        } else if (key === "p"){
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

        } else if (key === "o"){
            if (validPosition(type, x, y, (rot+2)%4)){
                rot = (rot+2)%4;
            } else if (validPosition(type, x+1, y, (rot+2)%4)){
                x+=1;
                rot = (rot+2)%4;
            } else if (validPosition(type, x-1, y, (rot+2)%4)){
                x-=1;
                rot = (rot+2)%4;
            }

        } else if (key === "i"){
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
    if(e.key === "9"){
        window.clearInterval(intervalID);
        intervalID = window.setInterval(moveDown, 500);
    } else if (e.key === "q"){
        window.clearInterval(leftRepeater);
    } else if (e.key === "e"){
        window.clearInterval(rightRepeater);
    }
});

// if user alt tabs while holding move key, reset the movement
window.addEventListener('blur', () =>{ 
    window.clearInterval(leftRepeater);
    window.clearInterval(rightRepeater);
});

drawGrid();
activeCellArr = pieceToArr(type,x,y,rot);
getGhostArray();
drawPiece();
drawNextPiece();

let intervalID = window.setInterval(moveDown, 500);
let rightRepeater;
let leftRepeater;