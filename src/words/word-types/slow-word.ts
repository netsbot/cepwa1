import p5 from "p5";
import Word from "../word";

class SlowWord extends Word {
    velocityChange: number;

    constructor(p: p5, word: string, startingVel: p5.Vector, onDestroyCallback: Function) {
        let velocityChange = Math.round(p.random(0.75, 0.99) * 100) / 100;

        super(p, word, startingVel, onDestroyCallback, [255, 255,255], [0, 150, 0]);

        this.velocityChange = velocityChange;
    }

    onDestroy() {
        this.onDestroyCallback(this.velocityChange);
    }
}

export default SlowWord;