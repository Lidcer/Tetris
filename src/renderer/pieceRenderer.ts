import { pieces, PieceTypes, Rotation } from "../pieces";
import { Drawable } from "./baseObject";
import { Canvas } from "./canvas";
import { CanvasBase } from "./canvasBase";

export class PieceRenderer implements Drawable, CanvasBase {
    private canvas = document.createElement("canvas");
    private context: CanvasRenderingContext2D;
    drawGrid = false;
    wSize = 6;
    hSize = 4;
    x = 50;
    y = 50;
    constructor(private mainCanvas: Canvas) {
        const context = this.canvas.getContext("2d");
        if (!context) {
            throw new Error("Not supported");
        }
        this.context = context;
        window.addEventListener("resize", this.resize);
        this.resize();
    }
    get ctx() {
        return this.context;
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    destroy() {
        window.removeEventListener("resize", this.resize);
    }
    get blockSize () {
        return 20;
    }
    resize = () => {
        this.canvas.width = this.blockSize * this.wSize;
        this.canvas.height = this.blockSize * this.hSize;
    };
    drawStroke(){
        this.context.strokeStyle = "#ffffff";
        this.context.lineWidth = 2;
        this.context.strokeRect(0, 0, this.width, this.height);
        this.context.lineWidth = 1;
    }
    setPiece(type: PieceTypes, rotation: Rotation = Rotation.Zero, disabled = false, xx = 0, yy = 0) {
        this.clear();
        const piece = pieces[type];
        const shape = pieces[type].shape[rotation];
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if(shape[y][x]) {
                    this.context.fillStyle = disabled ? "#393c3d" : piece.color;
                    this.context.fillRect((x + 1 + xx) * this.blockSize, (y + 1 + yy) * this.blockSize, this.blockSize, this.blockSize);
                }
            }
        }
    }
    clear() {
        this.context.clearRect(0,0, this.width, this.height);
        this.drawStroke();
        if (this.drawGrid) {
            for (let x = 0; x < this.wSize; x++) {
                for (let y = 0; y < this.hSize; y++) {
                    this.context.strokeStyle = "#ffffff";
                    this.context.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                }   
            }
         
            this.context.lineWidth = 5;
            this.context.strokeRect(this.blockSize, this.blockSize, this.blockSize * 3, this.blockSize * 3);
            this.context.lineWidth = 1;
        }
    }
    draw(_delta: number) {
        this.mainCanvas.drawImage(this.canvas, this.x, this.y);
    }


}