import { PieceTypes } from "../pieces";

export type Scenario = number[][][];
export type ScenarioObject = {[key in PieceTypes]: Scenario }; 