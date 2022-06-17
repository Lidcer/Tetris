import { Drawable } from "./baseObject";
import { CanvasBase } from "./canvasBase";

export class Block implements Drawable {
    drawOutline = false;
    constructor(private canvas: CanvasBase, public color: string, public x: number, public y: number, public size = 10) {}
    
    draw() {
        this.canvas.ctx.fillStyle = this.color;
        this.canvas.ctx.fillRect(this.x, this.y, this.size, this.size);
        if (this.drawOutline) {
            this.canvas.ctx.strokeStyle = this.color;
            this.canvas.ctx.strokeRect(this.x, this.y, this.size, this.size);
        } else {
            this.canvas.ctx.strokeStyle = "#0000003a";
            const half = this.size * .25;
            this.canvas.ctx.strokeRect(this.x + half, this.y + half, this.size - (half * 2), this.size -(half *2));
            this.canvas.ctx.strokeRect(this.x, this.y, this.size, this.size);
        }
    }
}
