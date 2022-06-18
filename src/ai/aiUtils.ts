import { Board, GridPieceTypes } from "../engine/board";
import { pieces, PieceTypes, Rotation } from "../pieces";

export interface FallingData {
    x: number;
    y: number;
    type: PieceTypes;
    r: Rotation;
}
export interface BoardScore {
    badScore: number;
    height: number;
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

function writeShape(ax: number, ay: number, shape: number[][], board: Board, type: GridPieceTypes) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            const value = shape[y][x];
            if (value) {
                const xx = ax + x;
                const yy = ay + y - 1;
                board.set(xx, yy, type);
            }
        }
    }
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
                if(xx >= copy.width) {
                    return undefined;
                }
                copy.set(xx, yy, type);
            }
        }
    }


    return copy;
}
export function getBoardBadScore(board: Board): BoardScore {
    let score = 0;
    for (let y = board.height - 1; y >= 0; y--) {
        const hasLine = hasLineAnyBlock(board, y);
        if (hasLine) {
            let line = board.width;
            for (let x = 0; x < board.width; x++) {
                const value = board.at(x, y);
                if (!value) {
                    line--;
                    score += 1 + y + line;
                }
            }
        }
    }
    return {
        badScore: score,
        height: getBoardBlockHeight(board)
    };
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

const board = new Board(10, 20);
const board2 = new Board(10, 20);

board.set(0,19, "t");
board.set(1,19, "t");
board.set(2,19, "t");
board.set(2,18, "t");


board2.set(0,18, "t");
board2.set(1,18, "t");
board2.set(2,18, "t");
board2.set(2,19, "t");

console.log(getBoardBadScore(board));
console.log(getBoardBadScore(board2));