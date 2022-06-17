import { clamp } from "lodash";

export class RenderLoop {
    private drawFrame?: number;
    private lastPref = 0;
    private _updateRate = 100;
    constructor(private draw: (data:number, fps: number) => void) {}
    start() {
        this.stop();
        if (this.drawFrame === undefined) {
            this.lastPref = performance.now();
            this.drawFrame = requestAnimationFrame(this.internalDraw);
        }
    }
    stop() {
        if (this.drawFrame !== undefined) { 
            cancelAnimationFrame(this.drawFrame);
            this.drawFrame = undefined;
        }
    }
    get isActive() {
        return this.drawFrame !== undefined
    }
    private internalDraw = () => {
        const now = performance.now();
        const delta = clamp(now - this.lastPref, 0, 50) ;
        this.lastPref = now
        const fps = Math.round(1000 / delta)
        this.draw(delta, fps);
        this.drawFrame = requestAnimationFrame(this.internalDraw);
    }
    get updateRate() {
        return this._updateRate
    }
    set updateRate(value: number) {
        this._updateRate = value;
        if(this.isActive) {
            this.start();
        }
    }
}
