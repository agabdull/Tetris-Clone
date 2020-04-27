function withinBounds(type, rot, x) {
    if (type == "T") {
        if (rot == 0) {
            return 0 <= x && x <= 7;
        }
        else if (rot == 1) {
            return -1 <= x && x <= 7;
        }
        else if (rot == 2) {
            return 0 <= x && x <= 7;
        }
        else if (rot == 3) {
            return 0 <= x && x <= 8;
        }
    }
    else if (type == "S") {
        if (rot == 0) {
            return 0 <= x && x <= 7;
        }
        else if (rot == 1) {
            return -1 <= x && x <= 7;
        }
        else if (rot == 2) {
            return 0 <= x && x <= 7;
        }
        else if (rot == 3) {
            return 0 <= x && x <= 8;
        }
    }
    else if (type == "Z") {
        if (rot == 0) {
            return 0 <= x && x <= 7;
        }
        else if (rot == 1) {
            return -1 <= x && x <= 7;
        }
        else if (rot == 2) {
            return 0 <= x && x <= 7;
        }
        else if (rot == 3) {
            return 0 <= x && x <= 8;
        }
    }
    else if (type == "J") {
        if (rot == 0) {
            return -1 <= x && x <= 7;
        }
        else if (rot == 1) {
            return 0 <= x && x <= 7;
        }
        else if (rot == 2) {
            return 0 <= x && x <= 8;
        }
        else if (rot == 3) {
            return 0 <= x && x <= 7;
        }
    }
    else if (type == "L") {
        if (rot == 0) {
            return 0 <= x && x <= 8;
        }
        else if (rot == 1) {
            return 0 <= x && x <= 7;
        }
        else if (rot == 2) {
            return -1 <= x && x <= 7;
        }
        else if (rot == 3) {
            return 0 <= x && x <= 7;
        }
    }
    else if (type == "O") {
        return 0 <= x && x <= 8;
    }
    else if (type == "I") {
        if (rot == 0) {
            return -1 <= x && x <= 8;
        }
        else if (rot == 1) {
            return 1 <= x && x <= 7;
        }
        else if (rot == 2) {
            return 0 <= x && x <= 9;
        }
        else if (rot == 3) {
            return 1 <= x && x <= 7;
        }
    }
}
