import p5 from "p5";
import Word from "./Word";
import NormalWord from "./NormalWord";
import Input from "./Input";
import WordGenerator from "./WordCreator";
import ScoreDisplay from "./Score";

import english_5k from "../assets/english_5k.json" assert {type: "json"}
import LivesDisplay from "./Lives";
import WordTypeGenerator from "./WordTypeGenerator";
import BombWord from "./BombWord";

class Controller {
    private p: p5;
    private onScreenWords: Map<string, Word>;
    private english5kGenerator: WordGenerator;
    private input: Input;
    private prevAddTime: number;

    private scoreMultiplier: number;
    private score: number = 0;
    private lives: number = 3;

    private scoreDisplay: ScoreDisplay;
    private livesDisplay: LivesDisplay;

    constructor(p: p5) {
        this.p = p;

        this.onScreenWords = new Map<string, Word>(); 4
        this.english5kGenerator = new WordGenerator(english_5k);

        this.input = new Input(p);
        this.scoreDisplay = new ScoreDisplay(p);
        this.livesDisplay = new LivesDisplay(p);

        this.scoreMultiplier = 1;

        this.prevAddTime = 0;

        this.p.keyPressed = this.handleKeyPress.bind(this);
    }

    private handleKeyPress() {
        if (this.p.keyCode !== 13) return;

        console.log(this.input.getValue());

        const value = this.input.getValue();
        if (this.onScreenWords.has(value)) {
            let word = this.onScreenWords.get(value);
            word?.onDestroy();
            this.onScreenWords.delete(value);
            this.input.clear();
        }
    }

    private addNewWord() {
        if (this.p.random() < 0.03 && this.p.frameCount - this.prevAddTime > 60) {
            const word = this.english5kGenerator.getRandomWord();
            if (!this.onScreenWords.has(word)) {
                let wordType = WordTypeGenerator.generateWordType();

                switch (wordType) {
                    case NormalWord:
                        this.onScreenWords.set(word, new NormalWord(this.p, word, this.incrementScore.bind(this)));
                        break;
                    case BombWord:
                        this.onScreenWords.set(word, new BombWord(this.p, word, this.decrementLives.bind(this)));
                        break;
                }

                this.prevAddTime = this.p.frameCount;
            }
        }
    }

    private updateWords() {
        this.onScreenWords.forEach((word, key) => {
            if (word.isOffScreen()) {
                this.onScreenWords.delete(key);
            } else {
                word.loop();
            }
        });
    }

    incrementScore(points: number) {
        this.score += points * this.scoreMultiplier;
        this.scoreDisplay.setScore(this.score);
    }

    decrementLives() {
        this.lives -= 1;
        this.livesDisplay.setLives(this.lives);
    }


    loop() {
        this.addNewWord();
        this.updateWords();
        this.scoreDisplay.display();
        this.livesDisplay.display();
    }
}

export default Controller;