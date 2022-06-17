import { Note, notes, SmoothSync } from "./synthEngine";

export class ComboSound {
    private index = 0
    private scale: Note[] = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5" ];
    private resetSound: Note = "G3";


    constructor(private sync: SmoothSync) {}

    next() {
        this.sync.beepSmooth(notes[this.scale[this.index]], 0.75, 0.75, "triangle");
        this.index = (this.index + 1);
        if (this.index > this.scale.length - 1) {
            this.index = this.scale.length - 1
        }
    }
    reset() {
        if(this.index !== 0) {
            if(this.index > 1) {
                this.sync.beepSmooth(notes[this.resetSound], 0.75, 0.75, "triangle");
            }
            this.index = 0;
        }
    }
}