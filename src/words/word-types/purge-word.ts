import p5 from "p5";
import Word from "../word";

class PurgeWord extends Word {
    constructor(p: p5, word: string, startingVel: p5.Vector, onDestroyCallback: Function) {
        super(p, word, startingVel, onDestroyCallback, [255, 255, 255], [150, 0, 0]);
    }
}

export default PurgeWord;
