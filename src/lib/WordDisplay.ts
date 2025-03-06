import p5 from "p5";

class WordDisplay {
    private p: p5;

    private word: string;

    private pos: p5.Vector;
    private vel: p5.Vector;

    static font: p5.Font;
    private static padding = 20;
    private bg: number[];
    private txt: number[];

    constructor(p: p5, word: string, bg: number[], txt: number[]) {
        this.p = p;

        this.word = word;
        this.pos = this.initializePosition();
        this.vel = this.initializeVelocity();

        this.bg = bg;
        this.txt = txt;
    }

    static setFont(font: p5.Font) {
        WordDisplay.font = font;
    }

    private initializePosition(): p5.Vector {
        let pos: p5.Vector;
        let bbox: { x: number, y: number, w: number, h: number };

        do {
            pos = this.p.createVector(this.p.random(20, this.p.width - 20), 0);
            bbox = WordDisplay.font.textBounds(this.word, pos.x, pos.y) as { x: number, y: number, w: number, h: number };
        } while (bbox.x < 0 || bbox.x + bbox.w > this.p.width);

        return pos;
    }

    private initializeVelocity(): p5.Vector {
        return this.p.createVector(0, 1);
    }

    display() {
        this.pos.add(this.vel);

        this.drawBackgroundBox();

        this.p.push();

        this.p.fill(this.txt);
        this.p.text(this.word, this.pos.x, this.pos.y);

        this.p.pop();
    }

    private drawBackgroundBox() {
        const bbox = this.calculateBoundingBox();

        this.p.push();

        this.p.fill(this.bg);
        this.p.rect(bbox.x - WordDisplay.padding / 2, bbox.y - WordDisplay.padding / 2, bbox.w + WordDisplay.padding, bbox.h + WordDisplay.padding, 5);

        this.p.pop();
    }

    calculateBoundingBox(): { x: number, y: number, w: number, h: number } {
        return WordDisplay.font.textBounds(this.word, this.pos.x, this.pos.y) as { x: number, y: number, w: number, h: number };
    }

    isOffScreen(): boolean {
        return this.pos.y > this.p.height;
    }
}

export default WordDisplay;