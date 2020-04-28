//The table cell indices are 0-based

let grid = document.querySelector("#main-grid");

const width = 10;
const height= 15;
let x = 3;
let y = 12;
let type = genPieceType();
let rot = 0;
let key = "";
let activeCellArr = [[[]],[],[],[]];
let potentialCellArr = [[[]],[],[],[]];
let ghostCellArr = [[[]],[],[],[]];
let ghostY = -1;


function drawGrid(){
    let html = "";
    for(i=height-1; i>=0; i--){
        html += `<tr id="row-${i}">`;
        for(j=0; j<width; j++){
            html += `<td id="cell-${j}-${i}"> </td>`;
        }
        html += "</tr>";
}
    grid.innerHTML = html;
}

function drawPiece(){
    activeCellArr.forEach(arr => {
        if (arr[1] <= 14){
            document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.add(`${type}`);
        }
    });

    ghostCellArr.forEach(arr => {
        document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.add('ghost');
    });
}

function undrawPiece(){
    activeCellArr.forEach(arr => {
        if (arr[1] <= 14){
            document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.remove(`${type}`);
        }
    });

    ghostCellArr.forEach(arr => {
        document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.remove('ghost');
    });    
}

// start at bottom of grid, work up until we're not intersecting any placed cells
function getGhostArray(){
    ghostY = minGhostHeight(type, rot);  //makes sure the cells we check below are in a valid row (i.e. non-negative #)
    while (piecesOverlap(pieceToArr(type, x, ghostY, rot))){
        ghostY+=1;
    }
    return pieceToArr(type, x, ghostY, rot);
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


function placedBelowActive(){
    let shiftedArr = activeCellArr.map(arr => [arr[0], arr[1]-1]);
    return piecesOverlap(shiftedArr);
}



function bottomContact(){
    let bottomRow = false;
    activeCellArr.forEach(arr => {
        if (arr[1] === 0){
            bottomRow = true;
        }
    })
    return bottomRow;
}


function instantDrop(){
    undrawPiece();
    y = ghostY;
    activeCellArr = pieceToArr(type, x, y, rot);
    drawPiece();

    activeCellArr.forEach(arr => {
        document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.add('placed');
    });
    clearLines();
    x = 3;
    y = 12;
    type = genPieceType();
    rot = 0;
    activeCellArr = pieceToArr(type,x,y,rot);
    ghostCellArr = getGhostArray();
    drawPiece();
}



function clearLines(){
    for (i=0; i<=14; i++){
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
            for (k=i; k<14; k++){
                for (l=0; l<=9; l++){
                    document.getElementById(`cell-${l}-${k}`).className = document.getElementById(`cell-${l}-${k+1}`).className;
                }
            }
            let emptyRow = "";
            for (l=0; l<=9;l++){
                emptyRow += `<td id=cell-${l}-14>`;
            }
            document.getElementById("row-14").innerHTML = emptyRow;
            i--;  // we just shifted the next row back one index, but we still want to check it!
        }
    }
}


function moveDown(){
    // short circuiting behaviour ensures active piece not on last row during placeBelowActive function call
    if (bottomContact() || placedBelowActive()){
        activeCellArr.forEach(arr => {
            document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.add('placed');
        });
        clearLines();
        x = 3;
        y = 12;
        type = genPieceType();
        rot = 0;
        activeCellArr = pieceToArr(type,x,y,rot);
        ghostCellArr = getGhostArray();
        drawPiece();
    } else {
        undrawPiece();
        y-=1;
        activeCellArr = pieceToArr(type,x,y,rot);
        // don't have to redraw the ghost
        drawPiece();
    }
}

window.addEventListener('keydown', e =>{
    key = e.key;
    if (key === "w"){
        instantDrop();

    } else {
        if (key === "q"){
            if (withinBounds(type, rot, x-1)){
                potentialCellArr = pieceToArr(type, x-1, y, rot);
                if (!piecesOverlap(potentialCellArr)){
                    x-=1;
                }
            }
        } else if (key === "e"){
            if (withinBounds(type, rot, x+1)){
                potentialCellArr = pieceToArr(type, x+1, y, rot);
                if (!piecesOverlap(potentialCellArr)){
                    x+=1;
                }
            }
        } else if (key === "PageUp"){
            if (withinBounds(type, (rot+1) % 4, x)){
                potentialCellArr = pieceToArr(type, x, y, (rot+1) % 4);
                if (!piecesOverlap(potentialCellArr)){
                    rot = (rot+1) % 4;
                }
            }
        } else if (key === "ArrowUp"){
            if (withinBounds(type, (rot+2) % 4, x)){
                potentialCellArr = pieceToArr(type, x, y, (rot+2) % 4);
                if (!piecesOverlap(potentialCellArr)){
                    rot = (rot+2) % 4;
                }
            }
        } else if (key === "Home"){
            if (withinBounds(type, (rot+3) % 4, x)){
                potentialCellArr = pieceToArr(type, x, y, (rot+3) % 4);
                if (!piecesOverlap(potentialCellArr)){
                    rot = (rot+3) % 4;
                }
            }
        } else if (key === "/" && e.repeat === false){   // fast drop activated once
            window.clearInterval(intervalID);
            intervalID = window.setInterval(moveDown, 100);
        }

        undrawPiece();
        activeCellArr = pieceToArr(type,x,y,rot);
        ghostCellArr = getGhostArray();
        drawPiece();
    }
});

window.addEventListener('keyup', e =>{
    if(e.key === "/"){
        window.clearInterval(intervalID);
        intervalID = window.setInterval(moveDown, 500);
    }
})

drawGrid();
activeCellArr = pieceToArr(type,x,y,rot);
ghostCellArr = getGhostArray();
drawPiece();

var intervalID = window.setInterval(moveDown, 500);