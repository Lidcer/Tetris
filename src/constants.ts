interface Score {
    name: string, value: number
}

// scoring
export const LINES_SCORES: Score[] = [
    { name: "Single", value: 100},
    { name: "Double", value: 300},
    { name: "Tripe" , value: 500},
    { name: "Quad"  , value: 800}
];

export const SPIN_BONUS: Score[] = [
    { name: "-spin Single", value: 100 },
    { name: "-spin Double", value: 300 },
    { name: "-spin Tripe" , value: 500 },
    { name: "-spin Quad"  , value: 800 }
];
export const CLEAR_ALL = 3500;