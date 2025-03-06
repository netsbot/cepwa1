import p5 from "p5";

import Word from "./Word";
import WordDisplay from "./WordDisplay";

class BombWord implements Word {
    p: p5;
    word: string;
    wordDisplay: WordDisplay;
    onDestroyCallback: Function;

    constructor(p: p5, word: string, onDestroyCallback: Function) {
        this.p = p;
        this.word = word;
        this.wordDisplay = new WordDisplay(p, word, [0,0,0], [255, 255, 255]);
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

export default BombWord;