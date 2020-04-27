//The table cell indices are 0-based

let grid = document.querySelector("#main-grid");

const width = 10;
const height= 15;
let x = 3;
let y = 12;
let type = genPieceType();
let rot = 0;
let key = "";
let activeCellArr = [[[4,12]],[5,12],[5,13],[6,12]];

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
}

function undrawPiece(){
    activeCellArr.forEach(arr => {
        if (arr[1] <= 14){
            document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.remove(`${type}`);
        }
    });
}

function placedBelowActive(){
    let placedBelow = false;
    activeCellArr.forEach(arr => {
        if(document.getElementById(`cell-${arr[0]}-${arr[1]-1}`).classList.contains('placed')){
            placedBelow = true;
        }
    });
    return placedBelow;
}


function moveDown(){
    // short circuiting behaviour ensures active piece not on last row during placeBelowActive function call
    if (bottomContact(type, y, rot) || placedBelowActive()){
        activeCellArr.forEach(arr => {
            document.getElementById(`cell-${arr[0]}-${arr[1]}`).classList.add('placed');
        });
        x = 3;
        y = 12;
        type = genPieceType();
        rot = 0;
        activeCellArr = pieceToArr(type,x,y,rot);
        drawPiece();
    } else {
        undrawPiece();
        y-=1;
        activeCellArr = pieceToArr(type,x,y,rot);
        drawPiece();
    }
}

window.addEventListener('keydown', e =>{
    key = e.key;
    if (key === "q"){
        if (withinBounds(type, rot, x-1)){
            x-=1;
        }
    } else if (key === "e"){
        if (withinBounds(type, rot, x+1)){
            x+=1;
        }
    } else if (key === "PageUp"){
        if (withinBounds(type, (rot+1) % 4, x)){
            rot = (rot+1) % 4;
        }
    } else if (key === "ArrowUp"){
        if (withinBounds(type, (rot+2) % 4, x)){
            rot = (rot+2) % 4;
        }
    } else if (key === "Home"){
        if (withinBounds(type, (rot+3) % 4, x)){
            rot = (rot+3) % 4;
        }
    } else if (key === "/" && e.repeat === false){
        window.clearInterval(intervalID);
        intervalID = window.setInterval(moveDown, 100);
    }

    undrawPiece();
    activeCellArr = pieceToArr(type,x,y,rot);
    drawPiece();
});

window.addEventListener('keyup', e =>{
    if(e.key === "/"){
        window.clearInterval(intervalID);
        intervalID = window.setInterval(moveDown, 500);
    }
})

drawGrid();
activeCellArr = pieceToArr(type,x,y,rot);
drawPiece();

var intervalID = window.setInterval(moveDown, 500);