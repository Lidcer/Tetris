import { clamp } from "lodash";

export class RenderLoop {
    private drawFrame?: number | NodeJS.Timer;
    private lastPref = 0;
    private _updateRate = 100;
    private running = false;
    constructor(private draw: (delta: number, fps: number) => void, private time?: number) {}
    start() {
        this.stop();
        this.running = true;
        if (this.drawFrame === undefined) {
            this.lastPref = performance.now();
            if(this.time) {
                this.drawFrame = setTimeout(this.internalDraw, this.time);
            } else {
                this.drawFrame = requestAnimationFrame(this.internalDraw);
            }
        }
    }
    stop() {
        if (this.drawFrame !== undefined) { 
            if(this.time) {
                clearTimeout(this.drawFrame);
            } else {
                cancelAnimationFrame(this.drawFrame as number);
            }
            this.drawFrame = undefined;
        }
        this.running = false;
    }
    get isActive() {
        return this.drawFrame !== undefined;
    }
    private internalDraw = () => {
        const now = performance.now();
        const delta = clamp(now - this.lastPref, 0, 50) ;
        this.lastPref = now;
        const fps = Math.round(1000 / delta);
        this.draw(delta, fps);
        if(this.running) {
            if (this.time) {
                this.drawFrame = setTimeout(this.internalDraw, this.time);
            } else {
                this.drawFrame = requestAnimationFrame(this.internalDraw);
            }
        }
    };
    get updateRate() {
        return this._updateRate;
    }
    set updateRate(value: number) {
        this._updateRate = value;
        if(this.isActive) {
            this.start();
        }
    }
}
