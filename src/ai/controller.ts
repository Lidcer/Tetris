import { random } from "lodash";
import { LEFT, RIGHT, SOFT_DROP, ROTATE_CW, HARD_DROP, ROTATE_CCW, ROTATE180, HOLD, KeyDef
} from "../engine/controller";
function createEvent(down: boolean, keyDef: KeyDef) {
    const cc = {...keyDef} as any;
    delete cc.type;
    const mockEvent = new KeyboardEvent(down ? "keydown" : "keyup", cc);
    // mockEvent.target = document.body // doesn't work because key is readonly
    
    // patching
    Object.defineProperty(mockEvent, "target", {get() {return document.body}})
    return mockEvent;
}
export class Output {
    private activeMap = new Map<KeyDef, NodeJS.Timeout>;
    constructor(private dispatchElement: {dispatchEvent: (any: any) => void} = document) {}

    private cancel(key: KeyDef) {
        const exist = this.activeMap.get(key);
        if (exist) {
            this.dispatchElement.dispatchEvent(createEvent(false, key));
            clearTimeout(exist);
            this.activeMap.delete(key);
        }
    }
    private random() {
        return random(5, 10);
    }
    private createRelease(key: KeyDef) {
        const t = setTimeout(() => {
            this.dispatchElement.dispatchEvent(createEvent(false, key));
        }, this.random());
        this.activeMap.set(key, t);
    }
    private ex(key: KeyDef) {
        this.cancel(key);
        this.dispatchElement.dispatchEvent(createEvent(true, key));
        this.createRelease(key);
    }

    softDrop() {
        this.ex(SOFT_DROP);
    }
    hardDrop() {
        this.ex(HARD_DROP);
    }
    right() {
        this.ex(RIGHT);
    }
    left() {
        this.ex(LEFT);
    }
    hold() {
        this.ex(HOLD);
    }
    cw() {
        this.ex(ROTATE_CW);
    }
    ccw() {
        this.ex(ROTATE_CCW);
    }
    c180() {
        this.ex(ROTATE180);
    }

}