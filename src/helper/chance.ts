export function bool(likelihood: number = 50) {
    return this.random() * 100 < likelihood;
}

export function integer(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function pickone(arr: any[]) {
    return arr[integer(0, arr.length - 1)];
}
