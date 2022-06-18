
const a = (value: string) => (new URLSearchParams(location.search)).get(value);
export class InitSettings {

    static get expose() {
        return a("expose") !== null;
    }
    static get ai() {
        return a("ai") !== null;
    }

}