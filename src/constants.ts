interface Score {
    name: string, value: number
}

// scoring
export const LINES_SCORES: Score[] = [
    { name: "Single", value: 100},
    { name: "Double", value: 300},
    { name: "Triple" , value: 500},
    { name: "Quad"  , value: 800}
];

export const SPIN_BONUS: Score[] = [
    { name: "-spin Single", value: 800 },
    { name: "-spin Double", value: 1200 },
    { name: "-spin Triple" , value: 1600 },
];
export const CLEAR_ALL = 3500;