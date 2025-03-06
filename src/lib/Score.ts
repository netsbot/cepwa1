import p5 from "p5";

class Score {
    private p: p5;
    private score: number = 0;

    constructor(p: p5) {
        this.p = p;
    }

    display() {
        this.p.text(`Score: ${this.score}`, 0, this.p.textSize());
    }

    setScore(score: number) {
        this.score = score;
    }

}

export default Score;