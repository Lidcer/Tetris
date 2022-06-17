import { PieceTypes, Rotation } from "../pieces";

type KickTable = number[][];

export interface PieceRotation {
    type: PieceTypes;
    kickTable: number[][][];
}
export const srsRotationDef: {[key in PieceTypes]: PieceRotation } = {} as any; 
function createSRSRotation(type: PieceTypes, zero: KickTable, right: KickTable, upsideDown: KickTable, left: KickTable) {
    srsRotationDef[type] =  {
        type,
        kickTable: [],
    };
    const shape = srsRotationDef[type].kickTable;
    shape[Rotation.Zero] = zero;
    shape[Rotation.Right] = right;
    shape[Rotation.UpsideDown] = upsideDown;
    shape[Rotation.Left] = left;
}

createSRSRotation("i", 
    [ [0, 0], [1, 0],   [-2, 0], [1, 2],     [-2, -1] ],
    [ [0, 0], [-2, 0],  [1, 0],  [-2, 1],    [1, -2]  ],
    [ [0, 0], [-2, 0],  [2, 0],  [-2, -2],   [2, 1]   ],
    [ [0, 0], [2, 0],   [-1, 0], [2, -1],    [-1, 2]  ],
);

createSRSRotation("j", 
    [ [0, 0], [-1, 0],   [-1, 1], [0, -2],   [-1, -2]],
    [ [0, 0], [-1, 0],  [-1, -1], [0, 2],    [-1, 2]],
    [ [0, 0], [0, 0],   [1, 1],   [0, -2],   [1, -2]],
    [ [0, 0], [1, 0],  [1, -1],   [0, 2],    [1, 2]],
);
createSRSRotation("l", 
    [ [0, 0], [0, 0],   [-1, 1],  [0, -2],  [-1, -2]],
    [ [0, 0], [-1, 0],  [-1, -1], [0, 2],   [1, 2]],
    [ [0, 0], [1, 0],   [1, 1],   [0, -2],  [1, -2]],
    [ [0, 0], [1, 0],  [1, -1],   [0, 2],   [1, 2]],
);

createSRSRotation("s", 
    [ [0, 0], [-1, 0],   [-1, 1],    [0, -2],   [-1, -2]],
    [ [0, 0], [-1, 0],   [-1, -1],   [0, 2],    [-1, 2]],
    [ [0, 0], [1, 0],    [1, 1],     [0,-2],    [1, -2]],
    [ [0, 0], [1, 0],    [1, -1],    [0, 2],    [1, 2]],
);

createSRSRotation("z", 
    [ [0, 0], [-1, 0],   [-1, 1],    [0, -2],   [-1, -2]],
    [ [0, 0], [-1, 0],   [-1, -1],   [0, 2],    [-1, 2]],
    [ [0, 0], [1, 0],    [1, 1],     [0,-2],    [1, -2]],
    [ [0, 0], [1, 0],    [1, -1],    [0, 2],    [1, 2]],
);

createSRSRotation("t", 
    [ [0, 0], [-1, 0],   [-1, 1],  [0, -2],   [-1, -2]],
    [ [0, 0], [-1, 0],   [-1, -1], [0, 2],    [-1, 2]],
    [ [0, 0], [1, 0],    [1, 1],   [0,-2],    [1, -2]],
    [ [0, 0], [1, 0],    [1, -1],  [0, 2],    [1, 2]],
);

createSRSRotation("o", 
    [ [0, 0] ],
    [ [0, 0] ],
    [ [0, 0] ],
    [ [0, 0] ],
);