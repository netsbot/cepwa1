import p5 from "p5";

abstract class Word {
    private p: p5;

    protected readonly word: string;
    private readonly displayWord: string;

    private pos: p5.Vector;
    private vel: p5.Vector;

    static font: p5.Font;
    private static padding = 20;
    private readonly bg: number[];
    private readonly txt: number[];

    private alpha = 255;
    private fadeOut = false;
    private shouldDestroy = false;

    protected onDestroyCallback: Function;

    protected constructor(p: p5, word: string, startingVel: p5.Vector, onDestroyCallback: Function, txt: [number, number, number] = [0, 0, 0], bg: [number, number, number] = [255, 255, 255], suffix: string | null = null,) {
        this.p = p;

        this.word = word;

        if (suffix) {
            this.displayWord = `${word} ${suffix}`;
        } else {
            this.displayWord = word;
        }

        this.pos = this.initializePosition();
        this.vel = startingVel;

        this.bg = bg;
        this.txt = txt;


        this.onDestroyCallback = onDestroyCallback;
    }

    static setFont(font: p5.Font) {
        Word.font = font;
    }

    private initializePosition(): p5.Vector {
        let pos: p5.Vector;
        let bbox: { x: number, y: number, w: number, h: number };

        do {
            pos = this.p.createVector(this.p.random(40, this.p.width - 40), 0);
            bbox = Word.font.textBounds(this.word, pos.x, pos.y) as { x: number, y: number, w: number, h: number };
        } while (bbox.x < 0 || bbox.x + bbox.w > this.p.width);

        return pos;
    }

    setVelocity(vel: p5.Vector) {
        this.vel = vel;
    }

    loop() {
        if (this.fadeOut) {
            this.alpha -= 10;
            if (this.alpha <= 0) {
                this.shouldDestroy = true;
            }
        } else {
            this.pos.add(this.vel);
        }

        this.drawBackgroundBox();

        this.p.push();

        this.p.fill(this.txt[0], this.txt[1], this.txt[2], this.alpha);
        
        this.p.text(this.displayWord, this.pos.x, this.pos.y);

        this.p.pop();
    }

    private drawBackgroundBox() {
        const bbox = this.calculateBoundingBox();

        this.p.push();

        this.p.fill(this.bg[0], this.bg[1], this.bg[2], this.alpha);
        this.p.stroke(0, 0, 0, this.alpha);
        this.p.rect(bbox.x, bbox.y, bbox.w, bbox.h, 5);

        this.p.pop();
    }

    calculateBoundingBox(): { x: number, y: number, w: number, h: number } {
        let bounds = Word.font.textBounds(this.displayWord, this.pos.x, this.pos.y) as { x: number, y: number, w: number, h: number };

        bounds = { x: bounds.x - Word.padding / 2, y: bounds.y - Word.padding / 2, w: bounds.w + Word.padding, h: bounds.h + Word.padding };

        return bounds as { x: number, y: number, w: number, h: number };
    }

    isOffScreen(): boolean {
        return this.pos.y > this.p.height;
    }

    getWord() {
        return this.word;
    }

    shouldDestroyWord() {
        return this.shouldDestroy;
    }

    onDestroyStart() {
        this.fadeOut = true;
    }

    onDestroyEnd() {
        this.onDestroyCallback();
    }
}

export default Word;