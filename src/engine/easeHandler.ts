type EaseFn = (x: number) => number;
export class EaseHandler {
    private actual = 0;
    private target = 0;
    private initValue = 0;
    
    private time = 0;
    private duration = 0;
    private ended = true;
    constructor(private easeFn: EaseFn = (x) => x, private onEnd: () => void) { }

    setAnimator(value: number, duration: number, easeFn?: EaseFn) {
        this.target = value;
        this.initValue = this.actual;
        this.duration = duration;
        this.time = 0;
        this.ended = false;
        if (easeFn) {
            this.easeFn = easeFn;
        }
    }


    update(delta: number) {
        this.time += delta;
        if (this.time > this.duration) {
            this.actual = this.target;
            if (!this.ended) {
                this.ended = true;
                this.onEnd();
            }
        } else {
            const pr = this.time / this.duration;
            let diff = 0;
            let plus = true;
            if (this.initValue > this.target) {
                diff = this.initValue - this.target;
                plus = false;
            } else if (this.initValue < this.target) {
                diff = this.target - this.initValue;
            }
            const distance = diff * this.easeFn(pr);
            if(plus) {
                this.actual = this.initValue + distance;
            } else {
                this.actual = this.initValue - distance;
            }
        }
        // if (this.actual > this.target) {
        //     this.actual -= delta * this.multiplyFactor;
        //     if (this.actual > this.target) {
        //         this.actual = this.target;
        //     }
        // } else if (this.actual < this.target) {
        //     this.actual += delta * this.multiplyFactor;
        //     if (this.actual > this.target) {
        //         this.actual = this.target;
        //     }
        // }
    }

    get value() {
        return this.actual;
    }
}
