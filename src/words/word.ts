import p5 from "p5";
import WordDisplay from "../displays/word-display";

abstract class Word {
    p: p5;
    word: string;
    wordDisplay: WordDisplay;
    onDestroyCallback: Function;

    constructor(p: p5, word: string, startingVel: p5.Vector, onDestroyCallback: Function, txt: [number, number, number] = [0, 0, 0], bg: [number, number, number] = [255, 255, 255]) {
        this.p = p;
        this.word = word;
        this.wordDisplay = new WordDisplay(p, word, startingVel, txt, bg);
        this.onDestroyCallback = onDestroyCallback;
    }

    loop() {
        this.wordDisplay.display();
    }

    onDestroy() {
        this.onDestroyCallback();
    }

    isOffScreen() {
        return this.wordDisplay.isOffScreen();
    }
}

export default Word;