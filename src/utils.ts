export function attachDebugMethod(name: string, obj: any) {
    (window as any)[name] = obj;
    console.debug(`${name} has been attached`);
}

export function pushUniq<T>(array: T[], item: T) {
    const index = array.indexOf(item);

    if (index === -1) {
        array.push(item);
        return array.length;
    } else {
        return index + 1;
    }
}
export function removeItem<T>(items: T[], item: T): boolean {
    const index = items.indexOf(item);

    if (index !== -1) {
        items.splice(index, 1);
        return true;
    } else {
        return false;
    }
}

export function fixRange(value: number, multiplayer: number, limit: number, sum: boolean){
    if(sum) {
        const newValue = value + multiplayer;
        if (newValue > limit) {
            return limit;
        }
        return newValue;
    } else {        
        const newValue = value - multiplayer;
        if (newValue < limit) {
            return limit;
        }
        return newValue;

    }
}

export function delay(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}