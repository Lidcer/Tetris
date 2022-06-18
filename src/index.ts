import { TetisEngine } from "./engine/engine";
import { attachDebugMethod, delay } from "./utils";


const tetris = new TetisEngine();
tetris.start();

(async () => {
    tetris.hold.drop = "t";
    for (let i = 0; i < 10; i++) {
        await delay(100);
        if(i !== 5) {
            tetris.board.set(i, 39, "i");
            tetris.board.set(i, 38, "i");
            if(i !== 4 && i !== 5 && i !== 6) {
                tetris.board.set(i, 37, "i");

            }
            if(i !== 4 && i !== 5) {
                tetris.board.set(i, 36, "i");

            }
        }
        
    }
})();

attachDebugMethod("engine", tetris);
