import { PieceTypes } from "../pieces";

export type GridPieceTypes = PieceTypes | "";
export class Board {
    private grid: GridPieceTypes[][] = [];
    readonly offset = 20;

    constructor(private _width: number,private _height: number) {
        for (let y = 0; y < _height + this.offset; y++) {
            const ref: GridPieceTypes[] = [];
            for (let x = 0; x < _width; x++) {
                ref.push("");
            }
            this.grid.push(ref);
        }
    }
    at(x: number, y: number) {
        this.isOutOfBounds(x, y);
        return this.grid[y][x];
        
    }
    set(x:number, y: number, value: GridPieceTypes) {
        this.isOutOfBounds(x, y);
        this.grid[y][x] = value;
      
    }
    getLine(y: number) {
        return this.grid[y];
    }
    clearLine(): number[]{
        const array: number[] = [];
        const arrays: GridPieceTypes[][] = [];
        for (let y = 0; y < this.grid.length; y++) {
            const isFull = this.grid[y].find(e => e === "") === undefined;
            if (isFull) {
                array.push(y);
                arrays.push(this.grid[y]);
            }
        }
        while(arrays.length) {
            const fullLine = arrays.shift()!;
            const index = this.grid.indexOf(fullLine);
            this.grid.splice(index, 1);
        }
        while(this.grid.length < this.height + this.offset) {
            const ref: GridPieceTypes[] = [];
            for (let y = 0; y < this.width; y++) {
                ref.push("");
            }
            this.grid.unshift(ref);
        }

        return array;
    }
    private isOutOfBounds(x: number, y: number) {
        if (!(this.grid[y] !== undefined && this.grid[y][x] !== undefined)) {
            throw new Error(`Out of bounds x: ${x} y: ${y}`);
        }
    }
    clearBoard() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j] = "";
            }
        }
    }

    isEmpty() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if(this.grid[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    get width() {
        return this._width;
    }
    get height() {
        return this._height + this.offset;
    }
}