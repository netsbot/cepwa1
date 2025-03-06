import p5 from "p5";
import Word from "./WordDisplay";

class Lives {
    private p: p5;
    private lives: number = 3;

    constructor(p: p5) {
        this.p = p;
    }

    display() {
        this.p.text(`Lives: ${"x".repeat(this.lives)}`, 0, this.p.textSize() * 2);
    }

    setLives(lives: number) {
        this.lives = lives;
    }

    getLives() {
        return this.lives;
    }

    
}

export default Lives;