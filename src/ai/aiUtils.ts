import { Board } from "../engine/board";
import { pieces, PieceTypes, Rotation } from "../pieces";

export interface FallingData {
    x: number;
    y: number;
    type: PieceTypes;
    r: Rotation;
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
export function getBoardCost(board: Board): number {
    let cost = 0;
    const height = getBoardBlockHeight(board);
    const max = board.height * board.height;
    for (let y = 0; y < board.height; y++) {
        const iy = board.height - y - 1;
        const hasLine = hasLineAnyBlock(board, iy);
        if (!hasLine) continue;

        for (let x = 0; x < board.width; x++) {
            const isEmpty = board.at(x, iy) === "";
            if (isEmpty) {
                cost++;
                let additionalCost = max;
                for (let yy = iy + 1; yy > 0; yy--) {
                    const checkY = yy - 1;
                    if (checkY > 0 && checkY < board.height) {
                        const isFilled = board.at(x, checkY) !== "";
                        if (isFilled) {
                            let sideHoles = 0;
                            if (x + 1 < board.width) {
                                if (board.at(x + 1, checkY) !== "") {
                                    sideHoles += additionalCost;
                                }
                            } else {
                                sideHoles += additionalCost;
                            }
                            if (x - 1 >= 0) {
                                if (board.at(x -1, checkY) !== "") {
                                    sideHoles += additionalCost;
                                }
                            } else {
                                sideHoles += additionalCost;
                            }
            
                            cost += additionalCost + sideHoles + iy;
                            additionalCost++;
                        }
                    }
                }
            }
        }
    }
    cost += height * max * max;
    cost = Math.round(cost);
    // for (let y = 0; y < board.height; y++) {
    //     const hasLine = hasLineAnyBlock(board, y);
    //     if (hasLine) {

    //         let blocks = board.width;
    //         let lineScore = 0;
    //         for (let x = 0; x < board.width; x++) {
    //             const value = board.at(x, y);
    //             if (!value) {
    //                 blocks--;
    //                 lineScore += 1 + y + blocks;
    //                 for (let i = 0; i < 3; i++) {
    //                     const ii = i - 1 + x;
    //                     const jj = y + 1;
    //                     if(ii > 0 &&  x < board.width - 1 && y > 0 && y < board.height - 1) {
    //                         const value = board.at(ii, jj);
    //                         const value2 = board.at(ii, y);
    //                         if (value && value2) {
    //                             lineScore += lineScore * 5;
    //                         }
    //                     } else {
    //                         lineScore += lineScore;
    //                     }  
    //                 }

    //             }
    //         }
    //         if (blocks) {
    //             score += lineScore;
    //         } else {
    //             score -= lineScore;
    //         }
    //     }
    // }
    return cost;
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
