export class SeededMath {
    constructor(private seed: number) {}

    random() {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
    randomInteger(min: number, max: number, float = false) {
        if (min > max) {
            const temp = max;
            min = max;
            max = temp;
        }

        const number = (this.random() * max) + min;
        if (float) {
            return number;
        }
        return Math.floor(number);
    }
    sample<T = any>(items: T[]): T | undefined {
        return items[Math.floor(this.random() * items.length)];
    }
}
