import p5 from "p5";

import InputDisplay from "./displays/input-display";
import MainInfoDisplay from "./displays/main-info-display";


import english_5k from "./assets/english_5k.json" assert {type: "json"}
import Word from "./words/word";
import WordGenerator from "./words/word-creator";

import NormalWord from "./words/word-types/normal-word";
import MultiplierWord from "./words/word-types/multiplier-word";
import SlowWord from "./words/word-types/slow-word";


class Controller {
    private p: p5;
    private onScreenWords: Map<string, Word>;
    private english5kGenerator: WordGenerator;
    private input: InputDisplay;
    private prevAddTime: number;

    private scoreMultiplier: number;
    private wordVelocity: number;
    private score: number;
    private lives: number;

    private targetScore: number;
    private timeLeft: number;
    private level: number;


    private mainInfoDisplay: MainInfoDisplay;

    constructor(p: p5) {
        this.p = p;

        this.onScreenWords = new Map<string, Word>(); 4
        this.english5kGenerator = new WordGenerator(english_5k);

        this.input = new InputDisplay(p);
        this.mainInfoDisplay = new MainInfoDisplay(p);

        this.scoreMultiplier = 1;
        this.wordVelocity = 1;
        this.score = 0;
        this.lives = 3;

        this.targetScore = 50;
        this.timeLeft = 60;
        this.level = 1;

        this.prevAddTime = 0;

        this.p.keyPressed = this.handleKeyPress.bind(this);

        this.setTimeCheck();
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
        } else
            this.decrementLives();
    }

    private addNewWord() {
        if (this.p.random() < 0.2 * this.level && this.p.frameCount - this.prevAddTime > 60) {
            const word = this.english5kGenerator.getRandomWord();
            if (!this.onScreenWords.has(word)) {
                let wordType = this.english5kGenerator.getRandomWordType();

                switch (wordType) {
                    case NormalWord:
                        this.onScreenWords.set(word, new NormalWord(this.p, word, this.p.createVector(0, this.wordVelocity), this.incrementScore.bind(this)));
                        break;
                    case MultiplierWord:
                        this.onScreenWords.set(word, new MultiplierWord(this.p, word, this.p.createVector(0, this.wordVelocity), this.tempChangeScoreMultiplier.bind(this)));
                        break;
                    case SlowWord:
                        this.onScreenWords.set(word, new SlowWord(this.p, word, this.p.createVector(0, this.wordVelocity), this.tempMultiplyWordVelocities.bind(this)));
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

    tempMultiplyWordVelocities(multiplier: number) {
        this.wordVelocity *= multiplier;
        this.wordVelocity = Math.round(this.wordVelocity * 100) / 100;

        this.onScreenWords.forEach((word) => {
            word.wordDisplay.setVelocity(this.p.createVector(0, this.wordVelocity));
        });

        this.mainInfoDisplay.setSpeed(this.wordVelocity);

        setTimeout(() => {
            this.wordVelocity /= multiplier;
            this.wordVelocity = Math.round(this.wordVelocity * 100) / 100;


            this.onScreenWords.forEach((word) => {
                word.wordDisplay.setVelocity(this.p.createVector(0, this.wordVelocity));
            });

            this.mainInfoDisplay.setSpeed(this.wordVelocity);

            console.log("Word velocity reset");
        }, 10000);


    }

    incrementScore(points: number) {
        this.score += points * this.scoreMultiplier;
        this.score = Math.floor(this.score);
        this.mainInfoDisplay.setScore(this.score);
    }

    decrementLives() {
        this.lives -= 1;
        this.mainInfoDisplay.setLives(this.lives);
    }

    tempChangeScoreMultiplier(multiplier: number) {
        this.scoreMultiplier *= multiplier;
        this.scoreMultiplier = Math.round(this.scoreMultiplier * 100) / 100;

        this.mainInfoDisplay.setMultiplier(this.scoreMultiplier);

        setTimeout(() => {
            this.scoreMultiplier /= multiplier;
            this.scoreMultiplier = Math.round(this.scoreMultiplier * 100) / 100;

            this.mainInfoDisplay.setMultiplier(this.scoreMultiplier);

            console.log("Score multiplier reset");
        }, 10000);
    }

    private endGame() {
        this.p.noLoop();
    }

    private setTimeCheck() {
        return setInterval(() => {
            this.timeLeft -= 1;
            this.mainInfoDisplay.setTimeLeft(this.timeLeft);
            this.mainInfoDisplay.display();
        }, 1000);
    }


    private newLevel() {
        this.level += 1;

        this.targetScore = 50 * 1.5 ** this.level;
        this.targetScore = Math.floor(this.targetScore);
        this.timeLeft = 60 * 1.2 ** this.level;
        this.timeLeft = Math.floor(this.timeLeft);

        this.scoreMultiplier = 1;
        this.wordVelocity = 1 * 1.2 ** this.level;
        this.score = 0;
        this.lives = 3;

        this.mainInfoDisplay.setScore(this.score);
        this.mainInfoDisplay.setLives(this.lives);
        this.mainInfoDisplay.setSpeed(this.wordVelocity);
        this.mainInfoDisplay.setMultiplier(this.scoreMultiplier);
        this.mainInfoDisplay.setTimeLeft(this.timeLeft);
        this.mainInfoDisplay.setLevel(this.level);
        this.mainInfoDisplay.setTargetScore(this.targetScore);

        this.onScreenWords.forEach((word) => {
            word.wordDisplay.setVelocity(this.p.createVector(0, this.wordVelocity));
        });
    }


    loop() {
        this.addNewWord();
        this.updateWords();
        this.mainInfoDisplay.display();

        if (this.lives <= 0 || this.timeLeft <= 0)
            this.endGame();

        if (this.score >= this.targetScore)
            this.newLevel();
    }
}

export default Controller;