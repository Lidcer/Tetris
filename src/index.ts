import { TetisEngine } from "./engine/engine";
import { attachDebugMethod } from "./utils";


const tetris = new TetisEngine();
tetris.start();

attachDebugMethod("engine", tetris);
