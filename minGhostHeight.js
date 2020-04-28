function minGhostHeight(type, rot){
    if (type == "T") {
        if (rot == 0) {
            return 1;
        }
        else if (rot == 1) {
            return 2;
        }
        else if (rot == 2) {
            return 2;
        }
        else if (rot == 3) {
            return 2;
        }
    }
    else if (type == "S") {
        if (rot == 0) {
            return 1;
        }
        else if (rot == 1) {
            return 2;
        }
        else if (rot == 2) {
            return 2;
        }
        else if (rot == 3) {
            return 2;
        }
    }
    else if (type == "Z") {
        if (rot == 0) {
            return 1;
        }
        else if (rot == 1) {
            return 2;
        }
        else if (rot == 2) {
            return 2;
        }
        else if (rot == 3) {
            return 2;
        }
    }
    else if (type == "J") {
        if (rot == 0) {
            return 2;
        }
        else if (rot == 1) {
            return 2;
        }
        else if (rot == 2) {
            return 2;
        }
        else if (rot == 3) {
            return 1;
        }
    }
    else if (type == "L") {
        if (rot == 0) {
            return 2;
        }
        else if (rot == 1) {
            return 1;
        }
        else if (rot == 2) {
            return 2;
        }
        else if (rot == 3) {
            return 2;
        }
    }
    else if (type == "O") {
        return 1;
    }
    else if (type == "I") {
        if (rot == 0) {
            return 2;
        }
        else if (rot == 1) {
            return 1;
        }
        else if (rot == 2) {
            return 2;
        }
        else if (rot == 3) {
            return 0;
        }
    }
}