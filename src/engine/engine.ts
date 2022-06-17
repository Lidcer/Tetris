import { Canvas } from "../renderer/canvas";
import { Board, GridPieceTypes } from "./board";
import { RenderLoop } from "./renderLoop";
import { Bag, Mode } from "./bag";
import { BoardRenderer } from "../renderer/boardRenderer";
import { ScoreRenderer } from "../renderer/score";
import { Control, Controller } from "./controller";
import { Falling } from "./falling";
import { Settings } from "./settings";
import { notes, SmoothSync } from "./synthEngine";
import { ComboSound } from "./comboSound";
import { PieceRenderer } from "../renderer/pieceRenderer";
import { TextRenderer } from "../renderer/textRenderer";
import { Rotation } from "../pieces";
import { delay } from "../utils";

export class TetisEngine {
    bag: Bag;
    board: Board;   
    boardRenderer: BoardRenderer;
    settings = new Settings();
    audio = new SmoothSync();
    private canvas: Canvas;
    private render: RenderLoop;
    private controller: Controller;
    private falling: Falling;
    comboSound = new ComboSound(this.audio);
    scoreRenderer: ScoreRenderer;
    private textRenderer: TextRenderer;
    private combo = 0;
    private drop = false;
    score = 0; 
    private gameOverText: () => void;

    // Move somewhere else
    private lineScores = [
        ["Single",100],
        ["Double",300],
        ["Tripe" ,500],
        ["Quad"  ,800]
    ];
    allClear = 3500;

    
    private holdRenderer: PieceRenderer;
    private queueRenderer: PieceRenderer[] = [];
    hold: {
        drop: GridPieceTypes,
        available: boolean;
    } = {
            available: true,
            drop: "",
        };

    constructor() {
        this.canvas = new Canvas();
        this.bag = new Bag(Mode.Bag7);
        this.board = new Board(10, 20);   
        this.boardRenderer = new BoardRenderer(this.canvas, this.board, 30);
        this.holdRenderer = new PieceRenderer(this.canvas);
        this.controller = new Controller(this.settings.handling);
        this.render = new RenderLoop(this.draw);
        this.falling = new Falling(this);
        this.scoreRenderer = new ScoreRenderer(this.canvas, this.boardRenderer, this);
        this.textRenderer = new TextRenderer(this.canvas, this.boardRenderer, this.holdRenderer);
        
        this.falling.setupNext();
        for (let i = 0; i < this.settings.bagItemsCount; i++) {
            this.queueRenderer.push(new PieceRenderer(this.canvas));
        }
        this.controller.register(c => {
            if (this.over){
                if(c === Control.HardDrop) {
                    this.reset();
                }
                return;
            }
            switch(c) {
            case Control.Left: {
                const s = this.falling.move(-1);
                if (!s) {
                    this.boardRenderer.targetX += 10;
                }
                break;
            }
            case Control.Right: {
                const s = this.falling.move(1);
                if (!s) {
                    this.boardRenderer.targetX -= 10;
                }
                break;
            }
            case Control.SoftDrop: {
                this.falling.soft();
                break;
            }
            case Control.HardDrop: {
                this.falling.hard();
                this.drop = true;
                this.hold.available = true;
                break;
            }
            case Control.RotateCCW: {
                this.falling.rotateCCW();
                break;
            }
            case Control.RotateCW: {
                this.falling.rotateCW();
                break;
            }
            case Control.Rotate180: {
                this.falling.rotate180();
                break;
            }
            case Control.Hold: {
                this.falling.hold();
                break;
            }
            }
        });
    }
    start() {
        this.render.start();
        this.controller.start();
        // const rotation: Rotation[] = [Rotation.Zero, Rotation.Right, Rotation.UpsideDown, Rotation.Left];
        // const type: PieceTypes = "t";
        // const kickSet = srsRotationDef[type];
        // let x = 0;
        // let y = 0;
        // for (const r of rotation) {
        //     let h = 0;
        //     for (let i = 0; i < kickSet.kickTable[r].length; i++) {
        //         const rr = kickSet.kickTable[r][i];
        //         const a = new PieceRenderer(this.canvas);
        //         a.x = x;
        //         a.y = y;
        //         a.setPiece(type, r, false, rr[0], rr[1])
        //         a.draw(0);
        //         x += a.width + 10;
        //         h = a.height;
                
        //     }
        //     y += h + 10;
        //     x = 0
        // }
    }

    drawDebug(lines: string[]) {
        const ctx = this.canvas.ctx;
        ctx.fillStyle = "#FFFFFFFF";
        const lineHeight = 15;

        ctx.font = `${lineHeight}px KdamThmorPro`;
        const offset = 5;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], offset, lineHeight * i + lineHeight + offset);
        }
    }

    playClearAll = async () => {
        this.audio.beepSmooth(notes["A#1"], 0.05, 0.7, "sawtooth");
        await delay(100);
        this.audio.beepSmooth(notes["A#2"], 0.05, 0.7, "sawtooth");
        await delay(100);
        this.audio.beepSmooth(notes["A#3"], 0.05, 0.7, "sawtooth");
        await delay(100);
        this.audio.beepSmooth(notes["A#4"], 0.05, 0.7, "sawtooth");
        await delay(100);
        this.audio.beepSmooth(notes["A#5"], 0.05, 0.7, "sawtooth");
    };
    update = (delta: number) => {
        this.boardRenderer.update();
        this.falling.update(delta);
        const lines = this.board.clearLine();
        if (lines.length) {
            this.comboSound.next();
            this.combo++;
            if(this.combo > 1) {
                this.textRenderer.push(`${this.combo - 1} combo`, "side", "big");
            }
            
            if(this.board.isEmpty()) {
                this.textRenderer.push("All clear", "center", "big");
                this.textRenderer.push("All clear", "side", "big");
                this.textRenderer.push(`${this.allClear} +`, "side", "small");
                this.score += this.allClear;
                this.playClearAll();
                this.comboSound.resetNoSound();
            } else {
                const s =  this.lineScores[lines.length - 1];
                const text = s[0] as string;
                const score = s[1] as number;
                this.textRenderer.push(text, "side", "big");
                this.textRenderer.push(`${score} +  `, "side", "small");
                this.score += score;
            }


            this.boardRenderer.drop(lines.length * 10);
        } else if (this.drop) {
            this.boardRenderer.drop(10);
            this.combo = 0;
            this.comboSound.reset();
            this.settings.gravity +=  0.00001;
            this.hold.available = true;
        }
        this.drop = false;
    };
    over = false;
    draw = (delta: number, fps: number) => {
        if (!this.over)  {
            this.update(delta);
        }

        this.canvas.clear();
        this.drawDebug([
            `FPS: ${Math.round(fps)}`,
            `Delta: ${delta.toFixed(2)}`,
            `Gravity: ${this.settings.gravity.toFixed(4)}`,
        ]);

        //this.controller.tick(delta);
        this.boardRenderer.draw(delta);
        this.holdRenderer.x = this.boardRenderer.ax - this.holdRenderer.width - 10;
        this.holdRenderer.y = this.boardRenderer.ay;
        if (this.hold.drop) {
            this.holdRenderer.setPiece(this.hold.drop, Rotation.Zero, !this.hold.available);
        } else {
            this.holdRenderer.clear();
        }
        const bag = this.bag.peek(this.settings.bagItemsCount);
        for (let i = 0; i < this.settings.bagItemsCount; i++) {
            const renderer = this.queueRenderer[i];
            renderer.x = this.boardRenderer.ax + this.boardRenderer.width + 10;
            renderer.y = this.boardRenderer.ay + (i * renderer.height);
            renderer.setPiece(bag[i]);
            renderer.draw(delta);
        }

        if (!this.over) {
            this.drop = this.falling.update(delta);
        }
        this.holdRenderer.draw(delta);
        this.scoreRenderer.draw(delta);
        this.textRenderer.draw(delta);
    };

    gameOver() {
        if (this.over) return;
        this.over = true;
        this.gameOverText = this.textRenderer.push("Game over", "center", "big", Number.MAX_SAFE_INTEGER);
    }
    reset() {
        this.over = false;
        this.score = 0;
        this.combo = 0;
        if (this.gameOverText) {
            this.gameOverText();
            this.gameOverText = undefined;
        }
        for (let i = 0; i < 1000; i++) { // TODO find better way to reset bag
            this.bag.getNext();
        }
        this.hold.available = true;
        this.hold.drop = "";
        this.board.clearBoard();
    }

}