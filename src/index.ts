import { TetisEngine } from "./engine/engine";
import { attachDebugMethod } from "./utils";
import { InitSettings } from "./InitSettings";
import { AI } from "./ai/brain";


const tetris = new TetisEngine(InitSettings.seed);
tetris.start();

if (InitSettings.expose) {
    attachDebugMethod("engine", tetris);
}

if (InitSettings.ai) {
    const ai = new AI(tetris, InitSettings.seed);
    ai.start();
    attachDebugMethod("ai", ai);
} else {
    tetris.start();
}

