import p5 from "p5";
import Word from "../word";

class MultiplierWord extends Word {
    private multiplierChange: number;

    constructor(p: p5, word: string, startingVel: p5.Vector, onDestroyCallback: Function) {
        let multiplierChange = Math.round(p.random(1, 1.25) * 100) / 100;

        super(p, word, startingVel, onDestroyCallback, [255, 255, 255], [0, 0, 150], `${multiplierChange}x`);

        this.multiplierChange = multiplierChange;
    }

    onDestroyEnd() {
        this.onDestroyCallback(this.multiplierChange);
    }
}

export default MultiplierWord;
