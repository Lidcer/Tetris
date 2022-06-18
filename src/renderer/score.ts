import { Drawable } from "./baseObject";
import { Canvas } from "./canvas";
import { BoardRenderer } from "./boardRenderer";

interface ScoreObject {
    score: number;
}

export class ScoreRenderer implements Drawable {

    constructor(private mainCanvas: Canvas,private board: BoardRenderer, private score: ScoreObject) {

    }
    draw(_delta: number): void {
        const ctx = this.mainCanvas.ctx;
        ctx.strokeStyle = "#FFFFFF";
        ctx.font = "30px KdamThmorPro";
        this.mainCanvas.fillText(`SCORE: ${this.score.score}`,this.board.ax, this.board.ay + this.board.height + 30);
    }

}