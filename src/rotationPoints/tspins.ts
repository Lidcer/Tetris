import { PieceTypes } from "../pieces";
import { Scenario, ScenarioObject } from "./pointsInterfaces";

export const tRotationBonusDef: ScenarioObject = {} as any; 
function createBonusPoints(type: PieceTypes, scenarios: Scenario) {
    tRotationBonusDef[type] = scenarios;
}
createBonusPoints("t", [
    [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 0],
    ],
    [
        [0, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
    ],
    [
        [1, 0, 0],
        [0, 0, 0],
        [1, 0, 1],
    ],
    [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 0],
    ]
]);
