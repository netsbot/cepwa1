import p5 from "p5";

class MainInfoDisplay {
    private p: p5;
    private score: number = 0;
    private lives: number = 3;
    private speed: number = 1;
    private multiplier: number = 1;
    private timeLeft: number = 60;
    private level: number = 1;
    private targetScore: number = 50;

    constructor(p: p5) {
        this.p = p;
    }

    display() {
        this.p.push();
        this.p.fill(255, 0, 0);
        this.p.rect(this.p.width - 10, 0, 10, this.p.height);
        this.p.fill(0, 255, 0);
        this.p.rect(this.p.width - 10, this.p.height - this.score / this.targetScore * this.p.height, 10, this.score / this.targetScore * this.p.height);
        this.p.pop();


        this.p.text(`Score: ${this.score} Lives: ${"x".repeat(this.lives)} Speed: ${this.speed} Multiplier: ${this.multiplier}`, 0, this.p.textSize());
        this.p.text(`Time left: ${this.timeLeft} Level: ${this.level} Target score: ${this.targetScore}`, 0, this.p.textSize() * 2);
    }

    setScore(score: number) {
        this.score = score;
    }

    setLives(lives: number) {
        this.lives = lives;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    setMultiplier(multiplier: number) {
        this.multiplier = multiplier;
    }

    setTimeLeft(timeLeft: number) {
        this.timeLeft = timeLeft;
    }

    setLevel(level: number) {
        this.level = level;
    }

    setTargetScore(targetScore: number) {
        this.targetScore = targetScore;
    }
}

export default MainInfoDisplay;