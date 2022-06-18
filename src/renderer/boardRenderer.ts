import { Canvas } from "./canvas";
import { Drawable } from "./baseObject";
import { Block } from "./block";
import { CanvasBase } from "./canvasBase";
import { pieces } from "../pieces";
import { Board, GridPieceTypes} from "../engine/board";
import { clamp, noop } from "lodash";

interface Animator {
    progress: number;
    easeFn: (n: number) => number;
    onFinish: () => void;
    multiplayer: number;
}

export class BoardRenderer implements Drawable, CanvasBase {
    private canvas = document.createElement("canvas");
    private context: CanvasRenderingContext2D;
    
    private blocks: Block[][] = [];
    private dropAnimator: Animator= {
        progress: 1,
        multiplayer: 0.007,
        easeFn: n => n,
        onFinish: noop,
    };
    x = 0;
    y = 0;
    _targetX = 0;
    _targetY = 0;
    private backgroundColor = "#6c6a8420";
 

    constructor(private mainCanvas: Canvas, private grid: Board, public blockSize: number) {
        const context = this.canvas.getContext("2d");
        if (!context) {
            throw new Error("Not supported");
        }
        this.context = context;

        for (let y = 0; y < grid.height; y++) {

            const refBlocks: Block[] = [];
            for (let x = 0; x < grid.width; x++) {
                const piece = grid.at(x, y);
                const color = this.getColor(piece);
                const block = new Block(this, color, x * blockSize, y * blockSize, blockSize,);
                refBlocks.push(block);
            }
            this.blocks.push(refBlocks);
        }
        this.canvas.height = grid.height * blockSize;
        this.canvas.width = grid.width * blockSize;
    }
    get ctx() {
        return this.context;
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height - (this.grid.offset * this.blockSize);
    }
    clear(): void {
        this.ctx.clearRect(0, 0, this.width, this.canvas.height);
    }
    getColor(pieceType: GridPieceTypes) {
        if (pieceType === "") {
            return this.backgroundColor;
        } else {
            return pieces[pieceType].color;
        }
    }

    renderBlock(x: number, y: number, pieceType: GridPieceTypes) {
        const color = this.getColor(pieceType);
        if (y < this.grid.offset && color === this.backgroundColor) {
            this.blocks[y][x].color = "#000000ff";
        } else {
            this.blocks[y][x].color = color;
        }
        this.blocks[y][x].drawOutline = this.getColor(pieceType) === this.backgroundColor;
    }
    renderShadow(x: number, y: number) {
        if (this.blocks[y][x].color === this.backgroundColor) {
            this.blocks[y][x].color = "#ffffff38";
            this.blocks[y][x].drawOutline = false;
        }
    }

    update() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const data = this.grid.at(x, y);
                this.renderBlock(x, y, data);
            }
        }
    }
    easeInOutQuad(x: number): number {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
    draw(delta: number) {
        const aD = delta * 0.025;
        if (this.x > this.targetX) {
            this.x -= aD;
            if (this.x < this.targetX) {
                this.x = this.targetX;
            }
        } else if (this.x < this.targetX) {
            this.x += aD;
            if (this.x > this.targetX) {
                this.x = this.targetX;
            }
        } else {
            if(this.targetX > 0) {
                this.targetX -= aD * 2;
                if (this.targetX < 0) {
                    this.targetX = 0;
                }
            } else if (this.targetX < 0) {
                this.targetX += aD * 2;
                if (this.targetX > 0) {
                    this.targetX = 0;
                }
            }
        }
        if (this.dropAnimator.progress !== 1){
            this.dropAnimator.progress += delta * this.dropAnimator.multiplayer;
            if (this.dropAnimator.progress > 1) {
                this.dropAnimator.progress = 1;
                this.dropAnimator.onFinish();
            }
            this.y = this._targetY * this.dropAnimator.progress;
        }


        this.clear();
        this.mainCanvas.ctx.fillStyle = "#ffffff20";
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                this.blocks[y][x].draw();
            }
        }

        const off = this.blockSize * this.grid.offset;
        this.mainCanvas.fillRect(this.ax - 1, this.ay - 1, this.width + 1, this.height + 1);
        this.mainCanvas.drawImage(this.canvas, this.ax, this.ay - off);
        this.mainCanvas.ctx.fillStyle = "#ffffff";
        
        // left
        this.mainCanvas.ctx.beginPath();
        this.mainCanvas.moveTo(this.ax - 1, this.ay - 1);
        this.mainCanvas.lineTo(this.ax - 1,this.ay - 1 + this.height + 1);
        this.mainCanvas.ctx.stroke();

        // right
        this.mainCanvas.ctx.beginPath();
        this.mainCanvas.moveTo(this.ax - 1 + this.width, this.ay - 1);
        this.mainCanvas.lineTo(this.ax - 1 + this.width,this.ay - 1 + this.height + 1);
        this.mainCanvas.ctx.stroke();

        // bottom
        this.mainCanvas.ctx.beginPath();
        this.mainCanvas.moveTo(this.ax - 1, this.ay - 1 + this.height);
        this.mainCanvas.lineTo(this.ax - 1 + this.width,this.ay - 1 + this.height + 1);
        this.mainCanvas.ctx.stroke();

        //if (this.targetX > 0) {
        //    this.targetX = fixRange(this.targetX, aD * .001, 0, true);
        //} //else {
        //     this.x = fixRange(this.targetX, aD, 0, false);
        // }
    }
    drop(value: number) {
        this.dropAnimator.progress = 0;
        this._targetY = -value;
        this.dropAnimator.onFinish = () => { 
            this.dropAnimator.onFinish = noop;
            this.dropAnimator.easeFn = x => Math.sqrt(1 - Math.pow(x - 1, 2));
            this.dropAnimator.progress = 0;
            this._targetY = 0;
        };
        this.dropAnimator.easeFn = (x) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
        
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        };
    }

    get targetX() {
        return this._targetX;
    }
    set targetX(value: number) {
        this._targetX = clamp(value, -10, 10);
    }
    get targetY() {
        return this._targetY;
    }
    set targetY(value: number) {
        this._targetY = clamp(value, -10, 10);
    }
    get ax() { 
        return (this.mainCanvas.width * 0.5) - (this.width * 0.5) - this.x;
    }
    get ay() {
        return (this.mainCanvas.height * 0.5) - (this.height * 0.5) - this.y;
    }
}