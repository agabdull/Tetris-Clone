function bottomContact(type, y, rot){
    if (type == "T") {
        if (rot == 0) {
            return y === 1;
        }
        else if (rot == 1) {
            return y == 2;
        }
        else if (rot == 2) {
            return y == 2;
        }
        else if (rot == 3) {
            return y == 2;
        }
    }
    else if (type == "S") {
        if (rot == 0) {
            return y == 1;
        }
        else if (rot == 1) {
            return y == 2;
        }
        else if (rot == 2) {
            return y == 2;
        }
        else if (rot == 3) {
            return y == 2;
        }
    }
    else if (type == "Z") {
        if (rot == 0) {
            return y == 1;
        }
        else if (rot == 1) {
            return y == 2;
        }
        else if (rot == 2) {
            return y == 2;
        }
        else if (rot == 3) {
            return y == 2;
        }
    }
    else if (type == "J") {
        if (rot == 0) {
            return y == 2;
        }
        else if (rot == 1) {
            return y == 2;
        }
        else if (rot == 2) {
            return y == 2;
        }
        else if (rot == 3) {
            return y == 1;
        }
    }
    else if (type == "L") {
        if (rot == 0) {
            return y == 2;
        }
        else if (rot == 1) {
            return y == 1;
        }
        else if (rot == 2) {
            return y == 2;
        }
        else if (rot == 3) {
            return y == 2;
        }
    }
    else if (type == "O") {
        return y == 1;
    }
    else if (type == "I") {
        if (rot == 0) {
            return y == 2;
        }
        else if (rot == 1) {
            return y == 1;
        }
        else if (rot == 2) {
            return y == 2;
        }
        else if (rot == 3) {
            return y == 0;
        }
    }
}