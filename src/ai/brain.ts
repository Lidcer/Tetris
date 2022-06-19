import { Output } from "./controller";
import { pieces, PieceTypes, Rotation } from "../pieces";
import { TetisEngine } from "../engine/engine";
import { RenderLoop } from "../engine/renderLoop";
import { generateBoardOnCurrentFalling, FallingData, getBoardCost, getShapeWidth, getBoardBlockHeight, Weights } from "./aiUtils";
import { Board } from "../engine/board";
import { SeededMath } from "../engine/seededMath";
import { filter, random } from "lodash";

interface BoardScoreObj {
    board: Board;
    cost: number;
    piece: FallingData;
}

const weights: Weights ={
    heightWeight: 0.510066,
    linesWeight: 0.760666,
    holesWeight: 0.35663,
    bumpinessWeight: 0.184483
};

//WIP
export class AI {
    private loop: RenderLoop;
    private controller = new Output(window);
    constructor(private engine: TetisEngine, private seed = random(1000, 5000), speed = 0) {
        this.loop = new RenderLoop(this.tick, speed);
    }

    start() {
        this.engine.start();
        this.loop.start();
    }
    stop() {
        this.loop.stop();
        this.engine.stop();
    }

    compareBoards = (a: BoardScoreObj, b: BoardScoreObj) => {
        const bad = a.cost > b.cost;
        return bad ? -1 : 1;
    };

    getBestBoard(boards: BoardScoreObj[]) {
        const seeded = new SeededMath(this.seed);
        boards.sort(this.compareBoards);
        const sampleBoard = boards[0];
        const samples = boards.filter(e => e.cost === sampleBoard.cost && e.cost === sampleBoard.cost); 
        return seeded.sample(samples)!;
    }

    getBestPicePos() {
        const engineFalling = this.engine["falling"]; 
        const boards = [this.getPieceAllBoards(engineFalling["type"])];
        
        // if (this.engine.hold.available) {
        //     const a = this.engine.hold.drop || this.engine.bag.peek(1)[0];
        //     boards.push(this.getPieceAllBoards(a));
        // }
        const best = this.getBestBoard(boards[0]);
        if (boards[1]) {
            const holdBest = this.getBestBoard(boards[1]);
            const r = this.compareBoards(best, holdBest);
            if (r === -1) {
                return null;
            }
        }
        return best.piece;
    }

    boardScore(board: Board, piece?: FallingData): BoardScoreObj {
        const score = getBoardCost(board, weights);
        const obj: Partial<BoardScoreObj> = {
            board,
            cost: score,
        };
        
        if(piece) {
            obj.piece = piece;
        }
        return obj as BoardScoreObj;
    }

    getPieceAllBoards(type: PieceTypes): BoardScoreObj[] {
        const rotations = [Rotation.Zero, Rotation.Right, Rotation.UpsideDown, Rotation.Left];
        const fallingDatas: FallingData[] = [];

        for (const rotation of rotations) {
            const width = getShapeWidth(pieces[type].shape[rotation]);
            for (let x = -width; x < this.engine.board.width + width; x++) {
                const block: FallingData = { type, r: rotation, x, y: 0 };
                fallingDatas.push(block);
            }
        }
        const currentScore = this.boardScore(this.engine.board);
        const boards = fallingDatas.map(d => {
            const board = generateBoardOnCurrentFalling(this.engine.board, d);
            if (!board) return;
            return this.boardScore(board, d);
            
        }).filter(e => e);
        for (const board of boards) {
            board.cost -= currentScore.cost;
            // let a = "";
            // for (let y = 0; y < board.board["grid"].length; y++) {
            //     for (let x = 0; x < board.board["grid"][y].length; x++) {
            //         const e = board.board["grid"][y][x];
            //         a += e ? e : "_";
            //     }
            //     a += "\n";
            // }
            // console.log(a);
            // console.log(board.score, currentScore.score);
        }     
          

        return boards;
    }


    tick = (_delta: number, _fps: number) => {
        const piece = this.getBestPicePos();
        if (!piece) {
            this.controller.hold();
            return;
        }
        const falling = this.engine["falling"];

        const px = piece.x;
        const fx = falling.x - 1;
        const checks = [piece.r !== falling["r"], px > fx, px < fx];
        if(checks.find(e => e === true)) {
            let i = -1;
            while(true) {
                if (checks[i] === true) {
                    break;
                }
                i = random(0, checks.length);
            }

            switch (i) {
            case 0: {
                if (
                    (falling["r"] === Rotation.Zero && piece.r === Rotation.UpsideDown) || 
                        (falling["r"] === Rotation.Left && piece.r === Rotation.Right) || 
                        (falling["r"] === Rotation.Right && piece.r === Rotation.Left) || 
                        (falling["r"] === Rotation.UpsideDown && piece.r === Rotation.Zero)
                ) {
                    this.controller.c180();
                } else if (
                    (falling["r"] === Rotation.Zero && piece.r === Rotation.Right) || 
                        (falling["r"] === Rotation.Right && piece.r === Rotation.UpsideDown) || 
                        (falling["r"] === Rotation.UpsideDown && piece.r === Rotation.Left) || 
                        (falling["r"] === Rotation.Left && piece.r === Rotation.Zero)
                ) {
                    
                    this.controller.cw();
                } else {
                    this.controller.ccw();
                }
                break;
            }
            case 1: {
                this.controller.right();
                break;
            }
            case 2: {
                this.controller.left();
                break;
            } 
            
            default:
                break;
            }

        } else  {
            const y = this.engine.board.height - falling.ay;
            if (getBoardBlockHeight(this.engine.board) + 5 > (y)) {
                this.controller.hardDrop();
                this.seed = (new SeededMath(this.seed)).randomInteger(0, 99999);
            } else {
                this.controller.softDrop();
            }
        }
    };

}

