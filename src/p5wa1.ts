import p5 from "p5";
import Controller from "./controller";
import Word from "./words/word";

const p5wa1 = (p: p5) => {
    let controller: Controller;
    let font: p5.Font;

    p.preload = () => {
        font = p.loadFont("/jbm.ttf")
        Word.setFont(font);
    }

    p.setup = () => {
        p.createCanvas(800, 400);
        p.textSize(18);
        p.textFont(font);

        controller = new Controller(p);
    };

    p.draw = () => {
        p.background(255);

        controller.loop();
    };
};

export default p5wa1;
