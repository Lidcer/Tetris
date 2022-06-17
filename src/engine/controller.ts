
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
    rapid: boolean;
}

type CB = (data: Control) => void;

const KEY_MAP: KeyDef[] = [
    { type:Control.RotateCW ,code: "ArrowUp", key: "ArrowUp", keyCode: 38, rapid: false},
    { type:Control.SoftDrop ,code: "ArrowDown", key: "ArrowDown", keyCode: 40, rapid: true},
    { type:Control.Left ,code: "ArrowLeft", key: "ArrowLeft", keyCode: 37, rapid: true},
    { type:Control.Right ,code: "ArrowRight", key: "ArrowRight", keyCode: 39, rapid: true},
    { type:Control.SoftDrop ,code: "ArrowDown", key: "ArrowDown", keyCode: 40, rapid: true},
    { type:Control.HardDrop ,code: "Space", key: " ", keyCode: 32, rapid: false},
    { type:Control.RotateCCW ,code: "ControlLeft", key: "Control", keyCode: 17, rapid: false},
    { type:Control.Rotate180 ,code: "KeyA", key: "a", keyCode: 65, rapid: false},
    { type:Control.Hold ,code: "ShiftLeft", key: "Shift", keyCode: 16, rapid: false},
    { type:Control.Escape ,code: "Escape", key: "Escape", keyCode: 27, rapid: true}
]; 
type ActiveControl = { type: Control, rapid: boolean, pressed: boolean }

export class Controller {
    private cb: CB;
    private rapidSpeed = 100;
    private frame: NodeJS.Timeout;
    private active: ActiveControl[] = []; 
    start() {
        this.stop();
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
        this.frame = setInterval(this.tick, this.rapidSpeed);
    }
    stop() {
        window.removeEventListener("keydown", this.keyDown);
        window.removeEventListener("keyup", this.keyUp);
        if(this.frame) {
            this.frame = undefined;
            clearInterval(this.frame);
        }
    }
    get isActive() {
        return !!this.frame;
    }
    changeSpeed(value: number) {
        this.rapidSpeed = Math.abs(value);
        if(this.isActive) {
            this.start();
        }
    }

    register(cb: (data: Control) => void) {
        this.cb = cb;
    }
    private tick = () => {
        for (const key of this.active) {
            if (key.rapid) {
                this.cb(key.type);
            } else if (!key.pressed) {
                this.cb(key.type);
                key.pressed = true;
            }
        }
    };

    private getMappedObject = (event: KeyboardEvent): KeyDef => {
        for (const MAP of KEY_MAP) {
            if (MAP.key === event.key && MAP.code === event.code/* && MAP.keyCode === event.keyCode*/) {
                return MAP;
            }
        }
    };

    private keyDown = (event: KeyboardEvent) => {
        const obj = this.getMappedObject(event);
        if (obj) {
            const exist = this.active.find(e => e.type === obj.type);
            if (!exist) {
                this.active.push({type: obj.type, rapid: obj.rapid, pressed: false});
            }
        }

    };
    private keyUp = (event: KeyboardEvent) => {
        const obj = this.getMappedObject(event);
        if (obj) {
            const exist = this.active.find(e => e.type === obj.type);
            if (exist) {
                const index = this.active.indexOf(exist);
                this.active.splice(index, 1);
            }
        }
    };
}