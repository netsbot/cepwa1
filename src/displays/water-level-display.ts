import p5 from "p5";

class WaterLevelDisplay {
    private p: p5;
    private percentage: number;

    constructor(p: p5) {
        this.p = p;
        this.percentage = 0;
    }

    setPercentage(percentage: number) {
        this.percentage = percentage;
    }

    display() {
        this.p.push();
        this.p.fill(0, 0, 200, 150);
        this.p.stroke(0, 0, 0, 0);
        this.p.rect(0, this.p.height - this.percentage * this.p.height, this.p.width, this.percentage * this.p.height);
        this.p.pop();
    }
}

export default WaterLevelDisplay;
