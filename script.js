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

drawGrid();
activeCellArr = pieceToArr(type,x,y,rot);

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

window.addEventListener('keydown', e =>{
    key = e.key;
    console.log(key);
    if (key === "q"){
        x-=1;
    } else if (key === "e"){
        x+=1;
    } else if (key === "PageUp"){
        rot = (rot+1) % 4;
    } else if (key === "ArrowUp"){
        rot = (rot+2) % 4;
    } else if (key === "Home"){
        rot = (rot+3) % 4;
    }

    undrawPiece();
    activeCellArr = pieceToArr(type,x,y,rot);
    drawPiece();
});