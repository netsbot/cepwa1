import p5 from "p5";

import InputDisplay from "./displays/input-display";
import MainInfoDisplay from "./displays/main-info-display";

import english_5k from "../dist/assets/english_5k.json" assert { type: "json" };
import Word from "./words/word";
import WordGenerator from "./words/word-creator";

import NormalWord from "./words/word-types/normal-word";
import MultiplierWord from "./words/word-types/multiplier-word";
import SlowWord from "./words/word-types/slow-word";
import PurgeWord from "./words/word-types/purge-word";
import WaterLevelDisplay from "./displays/water-level-display";

class Controller {
    private p: p5;
    private onScreenWords: Map<string, Word>;
    private english5kGenerator: WordGenerator;
    private input: InputDisplay;
    private prevAddTime: number = 0;

    private scoreMultiplier: number = 1;
    private wordVelocity: number = 1;
    private totalScore: number = 0;
    private score: number = 0;
    private highScore: number = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")!) : 0;
    private lives: number = 3;

    private targetScore: number = 50;
    private timeLeft: number = 60;
    private level: number = 1;

    private mainInfoDisplay: MainInfoDisplay;
    private waterLevelDisplay: WaterLevelDisplay;

    private timeCheckIntervalId: NodeJS.Timeout;
    private multiplierTimeoutIds: NodeJS.Timeout[];
    private velocityTimeoutIds: NodeJS.Timeout[];

    static wrongSound: Howl;
    static clickSound: Howl;

    private beatenHighScore: boolean = false;

    constructor(p: p5) {
        this.p = p;

        this.onScreenWords = new Map<string, Word>();
        this.english5kGenerator = new WordGenerator(english_5k);

        this.input = new InputDisplay(p);
        this.mainInfoDisplay = new MainInfoDisplay();
        this.waterLevelDisplay = new WaterLevelDisplay(p);

        this.mainInfoDisplay.setHighScore(this.highScore);

        this.p.keyPressed = this.handleKeyPress.bind(this);

        this.timeCheckIntervalId = this.setTimeCheck();
        this.multiplierTimeoutIds = [];
        this.velocityTimeoutIds = [];
    }

    private handleKeyPress() {
        if (this.p.keyCode !== 13) return;

        const value = this.input.getValue();
        if (this.onScreenWords.has(value)) {
            this.handleCorrectWord(value);
        } else {
            this.handleIncorrectWord();
        }
    }

    private handleCorrectWord(value: string) {
        let word = this.onScreenWords.get(value);
        word?.onDestroyStart();
        this.input.clear();
        Controller.clickSound.play();
    }

    private handleIncorrectWord() {
        this.decrementLives();
        Controller.wrongSound.play();
        this.setVignette(true);
        this.input.clear();
        setTimeout(() => {
            this.setVignette(false);
        }, 500);
    }

    private addNewWord() {
        if (this.p.random() < 0.2 * this.level && this.p.frameCount - this.prevAddTime > 60) {
            const word = this.english5kGenerator.getRandomWord();
            if (!this.onScreenWords.has(word)) {
                this.createWord(word);
                this.prevAddTime = this.p.frameCount;
            }
        }
    }

    private createWord(word: string) {
        let wordType = this.english5kGenerator.getRandomWordType();

        switch (wordType) {
            case NormalWord:
                this.onScreenWords.set(
                    word,
                    new NormalWord(
                        this.p,
                        word,
                        this.p.createVector(0, this.wordVelocity),
                        this.incrementScore.bind(this)
                    )
                );
                break;
            case MultiplierWord:
                this.onScreenWords.set(
                    word,
                    new MultiplierWord(
                        this.p,
                        word,
                        this.p.createVector(0, this.wordVelocity),
                        this.tempChangeScoreMultiplier.bind(this)
                    )
                );
                break;
            case SlowWord:
                this.onScreenWords.set(
                    word,
                    new SlowWord(
                        this.p,
                        word,
                        this.p.createVector(0, this.wordVelocity),
                        this.tempMultiplyWordVelocities.bind(this)
                    )
                );
                break;
            case PurgeWord:
                this.onScreenWords.set(
                    word,
                    new PurgeWord(
                        this.p,
                        word,
                        this.p.createVector(0, this.wordVelocity),
                        this.purgeAllWords.bind(this)
                    )
                );
                break;
        }
    }

    private updateWords() {
        for (let word of this.onScreenWords.values()) {
            if (word.isOffScreen()) {
                this.onScreenWords.delete(word.getWord());
            } else {
                word.loop();
            }

            if (word.shouldDestroyWord()) {
                word.onDestroyEnd();
                this.onScreenWords.delete(word.getWord());
            }
        }
    }

    private tempMultiplyWordVelocities(multiplier: number) {
        this.wordVelocity *= multiplier;
        this.wordVelocity = Math.round(this.wordVelocity * 100) / 100;

        this.updateWordVelocities();

        let timeout = setTimeout(() => {
            this.wordVelocity /= multiplier;
            this.wordVelocity = Math.round(this.wordVelocity * 100) / 100;
            this.updateWordVelocities();
        }, 10000);

        this.velocityTimeoutIds.push(timeout);
    }

    private updateWordVelocities() {
        for (let word of this.onScreenWords.values()) {
            word.setVelocity(this.p.createVector(0, this.wordVelocity));
        }
        this.mainInfoDisplay.setSpeed(this.wordVelocity);
    }

    private incrementScore(points: number) {
        this.score += points * this.scoreMultiplier;
        this.score = Math.round(this.score * 100) / 100;
        this.totalScore += points * this.scoreMultiplier;
        this.totalScore = Math.round(this.score * 100) / 100;
        this.mainInfoDisplay.setScore(this.totalScore);
        this.waterLevelDisplay.setPercentage(this.score / this.targetScore);

        if (this.totalScore > this.highScore) {
            this.beatenHighScore = true;
            this.highScore = this.totalScore;
            this.mainInfoDisplay.setHighScore(this.highScore);
        }
    }

    private decrementLives() {
        this.lives -= 1;
        this.mainInfoDisplay.setLives(this.lives);
    }

    private tempChangeScoreMultiplier(multiplier: number) {
        this.scoreMultiplier *= multiplier;
        this.scoreMultiplier = Math.round(this.scoreMultiplier * 100) / 100;

        this.mainInfoDisplay.setMultiplier(this.scoreMultiplier);

        let timeout = setTimeout(() => {
            this.scoreMultiplier /= multiplier;
            this.scoreMultiplier = Math.round(this.scoreMultiplier * 100) / 100;
            this.mainInfoDisplay.setMultiplier(this.scoreMultiplier);
        }, 10000);

        this.multiplierTimeoutIds.push(timeout);
    }

    private purgeAllWords() {
        for (let word of this.onScreenWords.values()) {
            word.onDestroyStart();
        }
    }

    private endGame() {
        this.p.noLoop();
        clearInterval(this.timeCheckIntervalId);
        this.clearTimeouts(this.multiplierTimeoutIds);
        this.clearTimeouts(this.velocityTimeoutIds);

        this.displayEndGameMessage();
        this.hideCanvas();

        localStorage.setItem("highScore", this.highScore.toString());
    }

    private clearTimeouts(timeoutIds: NodeJS.Timeout[]) {
        for (let timeoutId of timeoutIds) {
            clearTimeout(timeoutId);
        }
    }

    private displayEndGameMessage() {
        let endGame = document.getElementById("end-game");
        if (endGame?.innerHTML != null) {
            if (this.beatenHighScore) {
                endGame.innerHTML = `You beat the high score! Your score was ${this.totalScore}!`;
            } else {
                endGame.innerHTML = `Game over! Your score was ${this.totalScore}!`;
            }
        }
        endGame?.style.setProperty("display", "block");
    }

    private hideCanvas() {
        let canvas = document.getElementById("defaultCanvas0");
        canvas?.style.setProperty("display", "none");
    }

    private setTimeCheck() {
        return setInterval(() => {
            if (this.timeLeft <= 0) return;
            this.timeLeft -= 1;
            this.mainInfoDisplay.setTimeLeft(this.timeLeft);
        }, 1000);
    }

    private newLevel() {
        this.level += 1;

        this.targetScore = Math.floor(50 * 1.5 ** this.level);
        this.timeLeft = Math.floor(60 * 1.2 ** this.level);

        this.scoreMultiplier = 1;
        this.wordVelocity = Math.round(1.2 ** this.level * 100) / 100;
        this.score = 0;
        this.lives = 3;

        this.updateDisplaysForNewLevel();
        this.updateWordVelocities();
        this.clearTimeouts(this.multiplierTimeoutIds);
        this.clearTimeouts(this.velocityTimeoutIds);
    }

    private updateDisplaysForNewLevel() {
        this.mainInfoDisplay.setScore(this.score);
        this.mainInfoDisplay.setLives(this.lives);
        this.mainInfoDisplay.setSpeed(this.wordVelocity);
        this.mainInfoDisplay.setMultiplier(this.scoreMultiplier);
        this.mainInfoDisplay.setTimeLeft(this.timeLeft);
        this.mainInfoDisplay.setLevel(this.level);
        this.mainInfoDisplay.setTargetScore(this.targetScore);
        this.waterLevelDisplay.setPercentage(0);
    }

    private setVignette(display: boolean) {
        const vignette = document.getElementById("vignette");
        vignette?.classList.toggle("show", display);
    }

    loop() {
        this.addNewWord();
        this.waterLevelDisplay.display();
        this.updateWords();
        if (this.lives <= 0 || this.timeLeft <= 0) this.endGame();

        if (this.score >= this.targetScore) this.newLevel();
    }
}

export default Controller;
