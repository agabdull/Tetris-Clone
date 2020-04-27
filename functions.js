//Javascript's native modular arithmetic gives negative remainders when n is negative!
//  The below function fixes this behaviour, so 0<= a%b < b for all values of "a"
function mod(a, b) {
    return ((a % b) + b) % b;
}

function intToPieceType(n){
    if (n==0){ return "T";}
    else if (n==1){ return "S";}
    else if (n==2){ return "Z";}
    else if (n==3){ return "J";}
    else if (n==4){ return "L";}
    else if (n==5){ return "O";}
    else if (n==6){ return "I";}
    else {return "ERROR";}
}

function genPieceType(){
    return(intToPieceType(Math.floor(7*Math.random())));
}

// Hard-coded piece orientations relative to top left corner of "movement window"
function pieceToArr(type,x,y,rot){
    if (type == "T"){
        if (rot == 0){
            return [[x, y-1],[x+1,y],[x+1, y-1],[x+2, y-1]];
        } else if (rot == 1){
            return [[x+1, y],[x+1,y-1],[x+1, y-2],[x+2, y-1]];
        } else if (rot == 2){
            return [[x, y-1],[x+1,y-1],[x+1, y-2],[x+2, y-1]];
        } else if (rot == 3){
            return [[x, y-1],[x+1,y],[x+1, y-1],[x+1, y-2]];
        }
    }

    else if (type == "S"){
        if (rot==0){
            return [[x, y-1],[x+1, y],[x+1, y-1],[x+2, y]];
        } else if (rot==1){
            return [[x+1, y],[x+1, y-1],[x+2, y-1],[x+2, y-2]];
        } else if (rot==2){
            return [[x, y-2],[x+1, y-1],[x+1, y-2],[x+2, y-1]];
        } else if (rot==3){
            return [[x, y],[x, y-1],[x+1, y-1],[x+1, y-2]];
        }
    }

    else if (type == "Z"){
        if (rot==0){
            return [[x, y],[x+1, y],[x+1, y-1],[x+2, y-1]];
        } else if (rot==1){
            return [[x+1, y-2],[x+1, y-1],[x+2, y-1],[x+2, y]];
        } else if (rot==2){
            return [[x, y-1],[x+1, y-1],[x+1, y-2],[x+2, y-2]];
        } else if (rot==3){
            return [[x, y-2],[x, y-1],[x+1, y-1],[x+1, y]];
        }
    }

    else if (type == "J"){
        if (rot==0){
            return [[x+1, y],[x+1, y-1],[x+1, y-2],[x+2, y]];
        } else if (rot==1){
            return [[x, y-1],[x+1, y-1],[x+2, y-1],[x+2, y-2]];
        } else if (rot==2){
            return [[x, y-2],[x+1, y],[x+1, y-1],[x+1, y-2]];
        } else if (rot==3){
            return [[x, y],[x, y-1],[x+1, y-1],[x+2, y-1]];
        }
    }

    else if (type == "L"){
        if (rot==0){
            return [[x+1, y],[x+1, y-1],[x+1, y-2],[x, y]];
        } else if (rot==1){
            return [[x, y-1],[x+1, y-1],[x+2, y-1],[x+2, y]];
        } else if (rot==2){
            return [[x+2, y-2],[x+1, y],[x+1, y-1],[x+1, y-2]];
        } else if (rot==3){
            return [[x, y-2],[x, y-1],[x+1, y-1],[x+2, y-1]];
        }
    }

    else if (type == "O"){
        return [[x,y],[x+1, y-1],[x+1, y],[x, y-1]];
    }

    else if (type == "I"){
        if (rot==0){
            return [[x+1, y+1],[x+1, y],[x+1, y-1],[x+1, y-2]];
        } else if (rot==1){
            return [[x-1, y-1],[x, y-1],[x+1, y-1],[x+2, y-1]];
        } else if (rot==2){
            return [[x, y+1],[x, y],[x, y-1],[x, y-2]];
        } else if (rot==3){
            return [[x-1, y],[x, y],[x+1, y],[x+2, y]];
        }
    }
}