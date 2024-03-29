import { PieceTypes } from "../pieces";
import { random, sample } from "lodash";
import { SeededMath } from "./seededMath";
export enum Mode {
    Bag7,
    Bag14,
    //Classic, 
    //Paris,
    Mayhem

}

export class Bag {
    private readonly renderDistance = 28;
    private seededMath: SeededMath;
    private pieces: PieceTypes[] = ["i", "j", "l", "s", "z", "o", "t",];
    private queue: PieceTypes[] = [];
    constructor(private mode: Mode, seed?: number) {
        this.seededMath = new SeededMath(seed ? seed : random(0,999999));
        this.fillQueue();
    }

    private shuffle<T = any[]>(array: T[]): T[] {
        return array.sort(() => this.seededMath.random() < 0.5 ? 1 : -1);
    }
    private fillQueue() {
        while(this.queue.length < this.renderDistance) {
            switch (this.mode) {
            case Mode.Bag7: {
                const template = [...this.pieces];
                this.shuffle(template);
                this.queue.push(...template);
                break;
            }
            case Mode.Bag14: {
                const template = [...this.pieces, ...this.pieces];
                this.shuffle(template);
                this.queue.push(...template);
                break;
            }
            default:
                this.queue.push(sample(this.pieces)!);
                break;
            }
        }
    }
    getNext() {
        const item = this.queue.shift();
        this.fillQueue();
        return item!;
    }
    peek(distance: number) {
        const peekArray: PieceTypes[] = [];
        for (let i = 0; i < distance; i++) {
            peekArray.push(this.queue[i]);
        }
        return peekArray;
    }
}
