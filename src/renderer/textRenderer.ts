import { Drawable } from "./baseObject";
import { Canvas } from "./canvas";
import { BoardRenderer } from "./boardRenderer";
import { PieceRenderer } from "./pieceRenderer";
import { removeItem } from "../utils";
import { clamp } from "lodash";

interface TextType {
    type: "center" | "side";
    size: "big" | "small";
    text: string;
    time: number;
    duration: number;
}

export class TextRenderer implements Drawable {
    private readonly textFadeout = 100;
    private readonly maxColor = 0B11111111;
    private readonly bigText = 30;
    private readonly smallText = 20;
    private readonly padding = 5;
    private texts: TextType[] = [];
    constructor(private mainCanvas: Canvas, private board: BoardRenderer, private holdRenderer: PieceRenderer) {

    }

    push(text: string, type: TextType["type"], size: TextType["size"], duration = 1000) {
        const t: TextType = { duration, time: 0, size, text, type }; 
        const destroy = () => {
            t.duration = 100;
            t.time == t.duration;
        };
        this.texts.push(t);

        return destroy;

    }
    toHex(number: number) {
        return Math.floor(number).toString(16).padStart(2, "0");
    }
    getApproximateTextLen(text: string, size: TextType["size"]) {
        const aSize = size === "big" ? this.bigText : this.smallText;
        return (text.length * 0.275 * aSize);
    }
    draw(delta: number): void {
        const toRemove: TextType[] = [];
        const ctx = this.mainCanvas.ctx;
        let yc = 0;
        let ys = 0;
        for (let i = this.texts.length - 1; i >= 0; i--) {
            const text = this.texts[i];
            text.time += delta;
            if (text.time > text.duration) {
                const diff = text.time - text.duration;
                const a = clamp(diff / this.textFadeout * this.maxColor, 0, this.maxColor);
                ctx.fillStyle = `#FFFFFF${this.toHex(this.maxColor - a)}`;
    
                if (diff > this.textFadeout) {
                    toRemove.push(text);
                }
            }
            const size = text.size === "big" ? this.bigText : this.smallText;
            if (text.time < text.duration) {
                const a = clamp(text.time / this.textFadeout * this.maxColor, 0, this.maxColor);
                ctx.fillStyle = `#FFFFFF${this.toHex(a)}`;
            }
            ctx.font = `${size}px KdamThmorPro`;
            const t = text.text;
            if (text.type === "center") {
                const x = this.board.ax + (this.board.width - this.board.width * 0.5) - this.getApproximateTextLen(t, text.size);
                const y = this.board.ay + (this.board.height - this.board.height * 0.5) - size;
                this.mainCanvas.fillText(t, x, y + yc);
                yc += size + this.padding;
            } else if (text.type === "side") {
                const t = text.text;
                const x = this.board.ax - this.getApproximateTextLen(t, text.size) * 2;
                const y = this.holdRenderer.y + this.holdRenderer.height + size + this.padding;
                this.mainCanvas.fillText(t, x, y + ys);
                ys += size + this.padding;
            }

        }

        for (const r of toRemove) {
            removeItem(this.texts, r);
        }
    }

}