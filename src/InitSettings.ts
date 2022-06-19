
const a = (value: string) => (new URLSearchParams(location.search)).get(value);
export class InitSettings {

    static get expose() {
        return a("expose") !== null;
    }
    static get ai() {
        return a("ai") !== null;
    }

    static get seed() {
        const seed = a("seed");
        if(seed !== null) {
            const int = parseInt(a("seed"), 10);
            if(!isNaN(int)) {
                return int;
            }
        }
        return undefined;
    }

}