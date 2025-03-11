import p5 from "p5";
import Word from "../word";

class NormalWord extends Word {
    constructor(p: p5, word: string, startingVel: p5.Vector, onDestroyCallback: Function) {
        super(p, word, startingVel, onDestroyCallback, [0, 0, 0], [255, 255, 255]);
    }

    onDestroyEnd(): void {
        this.onDestroyCallback(this.word.length);
    }
}

export default NormalWord;
