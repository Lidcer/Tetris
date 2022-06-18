import { Output } from "./controller";
import { pieces, PieceTypes, Rotation } from "../pieces";
import { TetisEngine } from "../engine/engine";
import { RenderLoop } from "../engine/renderLoop";
import { BoardScore, generateBoardOnCurrentFalling, FallingData, getBoardBadScore, getShapeWidth, getBoardBlockHeight } from "./aiUtils";
import { Board } from "../engine/board";

interface BoardScoreObj {
    board: Board;
    score: BoardScore;
    peice: FallingData;
}

//WIP
export class AI {
    private loop: RenderLoop;
    private controller = new Output(window);
    constructor(private engine: TetisEngine, speed = 25) {
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
        const bad = a.score.badScore > b.score.badScore;
        if (a.score.height === a.score.height) {
            return bad ? 1 : -1;
        }  else {
            return a.score.height > a.score.height ? 1 : -1;
        }
    };

    getBestBoard(boards: BoardScoreObj[]) {
        boards.sort(this.compareBoards);
        return boards[0];
    }

    getBestPicePos() {
        const engineFalling = this.engine["falling"]; 
        const boards = [this.getPieceAllBoards(engineFalling["type"])];
        
        if (this.engine.hold.available){
            const a = this.engine.hold.drop || this.engine.bag.peek(1)[0];
            boards.push(this.getPieceAllBoards(a));
        }
        const best = this.getBestBoard(boards[0]);
        if (boards[1]) {
            const holdBest = this.getBestBoard(boards[1]);
            const r = this.compareBoards(best, holdBest);
            if (r === -1) {
                return null;
            }
        }
        return best.peice;
    }

    getPieceAllBoards(type: PieceTypes): BoardScoreObj[] {
        const rotations = [Rotation.Zero, Rotation.Right, Rotation.UpsideDown, Rotation.Left];
        const fallingDatas: FallingData[] = [];

        for (const rotation of rotations) {
            const width = getShapeWidth(pieces[type].shape[rotation]);
            for (let x = 0; x < this.engine.board.width + width; x++) {
                const block: FallingData = {
                    type,
                    r: rotation,
                    x,
                    y: 0,
                };
                fallingDatas.push(block);
            }
        }
        const boards = fallingDatas.map(d => {
            const board = generateBoardOnCurrentFalling(this.engine.board, d);
            if (!board) return;
            const score = getBoardBadScore(board);
            const peice = d;
            return {
                board,
                score,
                peice,
            };

        }).filter(e => e);
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
        if (piece.r !== falling["r"]) {
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

        } else if (px > fx) {
            this.controller.right();
        } else if (px < fx) {
            this.controller.left();
        } else {
            const y = this.engine.board.height - falling.ay;
            if (getBoardBlockHeight(this.engine.board) + 5 > (y)) {
                this.controller.hardDrop();
            } else {
                this.controller.softDrop();
            }
        }
    
    };

}

