import { CanvasBase } from "./canvasBase";

export class Canvas implements CanvasBase {
    private static active = false;
    private canvas = document.createElement("canvas");
    private context: CanvasRenderingContext2D;

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