import { Piece, pieces, PieceTypes, Rotation } from "../pieces";
import { TetisEngine } from "./engine";
import { PieceRotation, srsRotationDef } from "../rotations/srs";
import { notes } from "./synthEngine";


export class Falling {
    private x = 1;
    private y = 1;
    private type: PieceTypes = "i";
    private r: Rotation = Rotation.Zero;

    constructor(private engine: TetisEngine) {}

    setupNext(piece?: Piece) {
        if (!piece) {
            const pieceType = this.engine.bag.getNext();
            piece = pieces[pieceType];
        }
        const x = Math.floor((this.engine.board.width * 0.5) - (piece.shape[0].length * 0.5)) - 1;
        this.x = x;
        this.y = this.engine.board.offset - 3;
        this.r = 0 ;
        this.type =  piece.type;
    }
    rotSound() {
        this.engine.audio.beepSmooth(notes["C3"], 0.01, 0.01, "triangle");
    }

    isColliding(ax: number, ay: number) {
        const shape = pieces[this.type].shape[this.r];
        //const height = shape[0].length;
        if (ay < -1) {
            return true;
        }
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                const value = shape[y][x];
                if (value) {
                    const xx = ax + x;
                    const yy = ay + y;
                    const b = this.engine.board;
                    if (xx >= b.width || xx < 0 || yy >= b.height) {
                        return true;
                    }
                    const v = this.engine.board.at(xx, yy);
                    if (v) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private writeShape(ax: number, ay: number, shape: number[][]) {
        this.engine.audio.beepSmooth(notes["G1"], 0.025, 0.75, "triangle");
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                const value = shape[y][x];
                if (value) {
                    const xx = ax + x;
                    const yy = ay + y - 1;
                    this.engine.board.set(xx, yy, this.type);
                    this.engine.boardRenderer.renderBlock(xx, yy, this.type);
                }
            }
        }
    }
    move(x: number) {
        if (!this.isColliding(this.ax + x, this.ay)) {
            this.x += x;
            this.engine.audio.beepSmooth(notes["A2"], 0.01, 0.01, "square");
            return true;
        }
        return false;
    }
    soft() {
        if (!this.isColliding(this.ax, this.ay + 1)) {
            this.y += 1;
            this.engine.score++;
            this.y = Math.round(this.y)
            this.engine.audio.beepSmooth(notes["A1"], 0.01, 0.01, "square");
        }
    }
        hold() {
        if (this.engine.hold.available) {
            if (!this.engine.hold.drop) {
                this.engine.hold.available = false;
                this.engine.hold.drop = this.type;
                this.setupNext();
            } else {
                const type = this.engine.hold.drop;
                this.engine.hold.drop = this.type;
                this.engine.hold.available = false;
                this.setupNext(pieces[type]);
            }

        }
    }
    hard() {
        let ay = 0;
        let score = 0
        for (let i = 0; i < this.engine.board.height; i++) {
            if (this.isColliding(this.ax, this.ay + i)) {
                break;
            } else {
                score++;
                ay = this.ay + i;
            }
        }
        this.engine.score += score * 2;
        //this.engine.audio.beepSmooth(notes["A1"], 0.75, 0.1, "sawtooth");
        this.y = ay + 1;
        this.writeShape(this.ax, this.ay, this.shape);
        this.setupNext();
    }
    get rotationSystem() {
        return this.engine.settings.rotationSystem;
    }
    performKickTable(kickTableDef: {[key in PieceTypes]: PieceRotation }, reverse: boolean) {
        const kickTable = kickTableDef[this.type].kickTable[this.r];
        const backup = {
            x: this.x,
            y: this.y,
        }
        for (let i = 0; i < kickTable.length; i++) {
            this.x = backup.x;
            this.y = backup.y;

            if(reverse) {
                this.x += kickTable[i][0];
                this.y += kickTable[i][1];
            } else {
                this.x -= kickTable[i][0];
                this.y -= kickTable[i][1];
            }
            if(!this.isColliding(this.ax, this.ay)) {
                this.rotSound();
                return true;
            }
        }
        this.x = backup.x;
        this.y = backup.y
        return false
    }
    rotate180() {
        const rotationIndex = pieces[this.type].shape.indexOf(this.shape);
        const next = (rotationIndex + 2) % pieces[this.type].shape.length;
        this.r = next;
        if (this.rotationSystem === "SRS") {
            if (!this.performKickTable(srsRotationDef, true)) {
                this.r = rotationIndex;
            }
        } else {
            if (this.isColliding(this.ax, this.ay)) {
                this.r = rotationIndex;
            } else {
                this.rotSound();
            }
        }
    }
    rotateCW() {
        const rotationIndex = pieces[this.type].shape.indexOf(this.shape);
        const next = (rotationIndex + 1) % pieces[this.type].shape.length;
        this.r = next;
        if (this.rotationSystem === "SRS") {
            if (!this.performKickTable(srsRotationDef, true)) {
                this.r = rotationIndex;
            }
        } else {
            if (this.isColliding(this.ax, this.ay)) {
                this.r = rotationIndex;
            } else {
                this.rotSound();
            }
        }
    }
    rotateCCW() {
        const rotationIndex = pieces[this.type].shape.indexOf(this.shape);
        let next = (rotationIndex - 1);
        if (next < 0) {
            next = pieces[this.type].shape.length - 1;
        }
        this.r = next;
        if (this.rotationSystem === "SRS") {
            if (!this.performKickTable(srsRotationDef, false)) {
                this.r = rotationIndex;
            }
        } else {
            if (this.isColliding(this.ax, this.ay)) {
                this.r = rotationIndex;
            } else {
                this.rotSound();
            }
        }
    }

    update(delta: number): boolean {
        this.y += delta * this.engine.settings.gravity;
        const ax = this.ax;
        const ay = this.ay;
        const shape = this.shape;
        //if(this.engine.board.height - this.engine.board.offset)
        if(this.isColliding(ax, ay)) {
            let ok = false;
            for (let i = 0; i < this.engine.board.height; i++) {
                if(!this.isColliding(ax, ay - i)) {
                    const off = this.engine.board.height - this.engine.board.offset;
                    this.writeShape(ax, ay, shape);
                    if( off > ay - 1) {
                        this.engine.gameOver();
                        return;
                    }
                    ok = true;
                    break;
                }
            }
            if (ok) {
                this.setupNext();
                return true;
            } else {
                this.engine.gameOver();
            }
        } else {
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    const value = shape[y][x];
                    if (value) {
                        const xx = ax + x;
                        const yy = ay + y;
                        this.engine.boardRenderer.renderBlock(xx, yy, this.type);
                    }
                }
            }
        }
        if(this.engine.settings.shadowPiece) {
            let lastI = 0; 
            for (let i = this.ay; i < this.engine.board.height; i++) {
                if (!this.isColliding(this.ax, i)) {
                    lastI = i
                } else {
                    break;
                }
            }
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    const value = shape[y][x];
                    if (value) {
                        const xx = ax + x;
                        const yy = y + lastI;
                        this.engine.boardRenderer.renderShadow(xx, yy)
                    }
                }
            }
        }


        return false
    }

    get ax() {
        return Math.round(this.x) + 1;
    }
    get ay() {
        return Math.round(this.y);
    }
    get shape() {
        return pieces[this.type].shape[this.r]
    }
}
