import p5 from "p5";

class MainInfoDisplay {
    private score: number = 0;
    private highScore: number = 0;
    private lives: number = 3;
    private speed: number = 1;
    private multiplier: number = 1;
    private timeLeft: number = 60;
    private level: number = 1;
    private targetScore: number = 50;

    constructor() {
        this.updateLine1();
        this.updateLine2();
    }

    updateLine1() {
        let line1 = document.getElementById("line1");

        if (line1?.innerText != null)
            line1.innerText = `Score: ${this.score} High score: ${this.highScore} Lives: ${"x".repeat(this.lives)} Speed: ${this.speed} Multiplier: ${this.multiplier}`;
    }

    updateLine2() {
        let line2 = document.getElementById("line2");
        if (line2?.innerText != null)
            line2.innerText = `Time left: ${this.timeLeft} Level: ${this.level} Target score: ${this.targetScore}`;
    }

    setHighScore(highScore: number) {
        this.highScore = highScore;
        this.updateLine1();
    }

    setScore(score: number) {
        this.score = score;
        this.updateLine1();
    }

    setLives(lives: number) {
        this.lives = lives;
        this.updateLine1();
    }

    setSpeed(speed: number) {
        this.speed = speed;
        this.updateLine1();
    }

    setMultiplier(multiplier: number) {
        this.multiplier = multiplier;
        this.updateLine1();
    }

    setTimeLeft(timeLeft: number) {
        this.timeLeft = timeLeft;
        this.updateLine2();
    }

    setLevel(level: number) {
        this.level = level;
        this.updateLine2();
    }

    setTargetScore(targetScore: number) {
        this.targetScore = targetScore;
        this.updateLine2();
    }
}

export default MainInfoDisplay;