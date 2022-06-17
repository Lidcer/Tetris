import { HandlingSettings } from "./settings";

export enum Control {
    None,
    Left,
    Right,
    Hold,
    SoftDrop,
    HardDrop,
    RotateCW,
    RotateCCW,
    Rotate180,
    Escape,
}
interface KeyDef {
    code: string;
    keyCode: number;
    key: string;
    type: Control;
}

type CB = (data: Control) => void;


const KEY_MAP: KeyDef[] = [
    { type:Control.Left ,code: "ArrowLeft", key: "ArrowLeft", keyCode: 37},
    { type:Control.Right ,code: "ArrowRight", key: "ArrowRight", keyCode: 39},
    { type:Control.SoftDrop ,code: "ArrowDown", key: "ArrowDown", keyCode: 40},
    { type:Control.RotateCW ,code: "ArrowUp", key: "ArrowUp", keyCode: 38},

    { type:Control.HardDrop ,code: "Space", key: " ", keyCode: 32},
    { type:Control.RotateCCW ,code: "ControlLeft", key: "Control", keyCode: 17},
    { type:Control.Rotate180 ,code: "KeyA", key: "a", keyCode: 65},
    { type:Control.Hold ,code: "ShiftLeft", key: "Shift", keyCode: 16},
    { type:Control.Escape ,code: "Escape", key: "Escape", keyCode: 27}
]; 

const sideways = [KEY_MAP[0], KEY_MAP[1]];
const drop = KEY_MAP[2];

export class Controller {
    private cb: CB;
    private map = new Map<any, NodeJS.Timeout>();
    constructor(private settings: HandlingSettings) { }
    start() {
        this.stop();
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }
    stop() {
        window.removeEventListener("keydown", this.keyDown);
        window.removeEventListener("keyup", this.keyUp);
    }

    register(cb: (data: Control) => void) {
        this.cb = cb;
    }


    private getMappedObject = (event: KeyboardEvent): KeyDef => {
        for (const MAP of KEY_MAP) {
            if (MAP.key === event.key && MAP.code === event.code/* && MAP.keyCode === event.keyCode*/) {
                return MAP;
            }
        }
    };
    clearTimeout(key: any) {
        const e = this.map.get(key);
        if(e) {
            clearTimeout(e);
        }
        this.map.delete(key);
    }

    private keyDown = (event: KeyboardEvent) => {
        const key = this.getMappedObject(event);
        if (key) {
            if (this.map.has(key)) return;
            if (sideways.includes(key)) {
                if (this.map.has(sideways)) return;
                this.cb(key.type);
                this.clearTimeout(sideways);
                const timeout = setTimeout(() => {
                    this.cb(key.type);
                    this.clearTimeout(sideways);
                    const repeat = setInterval(() => {
                        this.cb(key.type);
                    }, this.settings.ARR);
                    this.map.set(sideways, repeat);
                }, this.settings.DAS);
                this.map.set(sideways, timeout);
            } else if (key === drop) {

                if (this.map.has(key)) return;
                this.cb(key.type);
                this.clearTimeout(key);
                const timeout = setInterval(() => {
                    this.cb(key.type);
                }, this.settings.SDF);
                this.map.set(key, timeout);

            } else {
                this.cb(key.type);
            }
        }
    };
    private keyUp = (event: KeyboardEvent) => {
        const obj = this.getMappedObject(event);
        if (obj) {
            this.clearTimeout(obj);
            if (sideways.includes(obj)) {
                this.clearTimeout(sideways);
            }
        }
    };
}