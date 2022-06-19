import { Board } from "../engine/board";
import { pieces, PieceTypes, Rotation } from "../pieces";

export interface FallingData {
    x: number;
    y: number;
    type: PieceTypes;
    r: Rotation;
}

export interface Weights { 
    heightWeight: number;
    linesWeight: number;
    holesWeight: number;
    bumpinessWeight: number;
}


function hasLineAnyBlock(board: Board, line: number) {
    for (let x = 0; x < board.width; x++) {
        const value = board.at(x, line);
        if (value) return true;
    }
    return false;
}
export function getBoardBlockHeight(board: Board) {
    let c =  0;
    for (let i = board.height - 1; i > 0; i--) {
        if (hasLineAnyBlock(board, i)) {
            c++;
        }       
    }
    return c;
}
export function columHeight(board: Board) {
    let total = 0;
    for (let x = 0; x < board.width; x++) {
        let height = 0;
        for (let y = board.height - 1; y >= 0; y--) {
            if(board.at(x, y) !== "") {
                height = board.height - y;
    
            }
        }
        total += height;
    }
    return total;
}


function isColliding(shape: number[][], board: Board, ax: number, ay: number) {
    // if (ay < 0) {
    //     return true;
    // }
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            const value = shape[y][x];
            if (value) {
                const xx = ax + x;
                const yy = ay + y;
                const b = board;
                if (xx >= b.width || xx < 0 || yy >= b.height) {
                    return true;
                }
                const v = board.at(xx, yy);
                if (v) {
                    return true;
                }
            }
        }
    }
    return false;
}


export function generateBoardOnCurrentFalling(board: Board, falling: FallingData) {
    const copy = new Board(board["_width"], board["_height"]);
    for (let y = 0; y < board.height; y++) {
        for (let x = 0; x < board.width; x++) {
            copy.set(x, y, board.at(x,y));
        }
    }
    const type = falling.type;
    const shape = pieces[type].shape[falling.r];
    //const cloned = cloneShapeAndRemovePadding(shape);


    let lastI = 0; 
    const ax = falling.x;
    const ay = falling.y;
    for (let i = ay; i < copy.height; i++) {
        if (!isColliding(shape, copy, ax, i)) {
            lastI = i;
        } else {
            break;
        }
    }
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            const value = shape[y][x];
            if (value) {
                const xx = ax + x;
                const yy = y + lastI;
                if(xx >= copy.width || xx < 0) {
                    return undefined;
                }
                copy.set(xx, yy, type);
            }
        }
    }


    return copy;
}

export function lines(board: Board) {
    let count = 0;
    for(let r = 0; r < board.height; r++){
        if (isLine(r, board)){
            count++;
        }
    }
    return count;
}

export function getBoardCost(board: Board, weights: Weights): number {
    const hi = -weights.heightWeight * columHeight(board);
    const l = weights.linesWeight * lines(board);
    const ho = weights.holesWeight * holes(board);
    const b = weights.bumpinessWeight * bumpiness(board);

    const cost = hi + l - ho - b;
    return cost;
}
export function bumpiness(board: Board) {
    let total = 0;
    for(let c = 0; c < board.width - 1; c++){
        total += Math.abs(columnHeight(c, board) - columnHeight(c + 1, board));
    }
    return total;
}
export function columnHeight(column: number, board: Board) {
    let r = 0;
    for(; r < board.height && board.at(column, r) === ""; r++);
    return board.height - r;
}
export function isLine(row: number, board: Board): boolean {
    for(let c = 0; c < board.width; c++){
        if (board.at(c, row) === ""){
            return false;
        }
    }
    return true;
}
export function holes(board: Board) {
    let count = 0;
    for(let c = 0; c < board.width; c++) {
        let block = false;
        for(let r = 0; r < board.height; r++) {
            if (board.at(c, r) != "") {
                block = true;
            } else if (board.at(c, r) == "" && block){
                count++;
            }
        }
    }
    return count;
}

export function getShapeWidth(shape:number[][]) {
    let i = 0;
    for (let y = 0; y < shape.length; y++) {
        let m = 0;
        for (let x = 0; x < shape[y].length; x++) {
            if(shape[y][x]) {
                m++;
            }
        }
        if (m > i) {
            i = m;
        }
    }
    return i;
}
