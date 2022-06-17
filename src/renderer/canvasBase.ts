export interface CanvasBase {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    clear(): void; 
}