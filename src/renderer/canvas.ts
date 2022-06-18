import { CanvasBase } from "./canvasBase";

export class Canvas implements CanvasBase {
    private static active = false;
    private canvas = document.createElement("canvas");
    private context: CanvasRenderingContext2D;
    private offX = 0;
    private offY = 0; 

    constructor() {
        if (Canvas.active) {
            throw new Error("Instance is already running");
        }
        document.body.appendChild(this.canvas);
        const context = this.canvas.getContext("2d");
        if (!context) {
            throw new Error("Not supported");
        }
        this.context = context;
        window.addEventListener("resize", this.resize);
        this.resize();
        Canvas.active = true;
    }
    destroy() {
        const pe = this.canvas.parentElement;
        window.removeEventListener("resize", this.resize);
        if (pe) {
            pe.removeChild(this.canvas);
        }
    }
    rotateDraw(rotation: number, rotateDraw: () => void) {
        //this.ctx.save();
        this.offX = Math.round(this.canvas.width * 0.50);
        this.offY = Math.round(this.canvas.height * 0.50);
        this.ctx.translate(this.offX, this.offY);
        this.ctx.rotate(rotation);
  
        rotateDraw();
        this.ctx.rotate(-rotation);
        this.ctx.translate(-this.offX, -this.offY);
        this.offX = 0;
        this.offY = 0;
        //this.ctx.restore();
    
    }
    drawImage(image: CanvasImageSource, dx: number, dy: number) {
        this.ctx.drawImage(image, dx - this.offX, dy - this.offY);
    }
    fillRect(x: number, y: number, w: number, h: number) {
        this.ctx.fillRect(x - this.offX, y - this.offY, w, h);
    }
    moveTo(x: number, y: number) {
        this.ctx.moveTo(x - this.offX, y - this.offY);
    }
    lineTo(x: number, y: number) {
        this.ctx.lineTo(x - this.offX, y - this.offY);
    }
    fillText(text:string, x: number, y: number, maxWidth?: number) {
        this.ctx.fillText(text, x - this.offX, y - this.offY, maxWidth);
    }

    private resize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    get ctx() {
        return this.context;
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}