import p5 from 'p5';
import { Howl } from 'howler';
import Controller from "./controller";
import Word from "./words/word";

const p5wa1 = (p: p5) => {
    let controller: Controller;
    let font: p5.Font;

    p.preload = () => {
        font = p.loadFont("/jbm.ttf")
        Word.setFont(font);

        Controller.wrongSound = new Howl({
            src: ["/wrong.mp3"]
        });
        Controller.clickSound = new Howl({
            src: ["/click.mp3"]
        });
    }

    p.setup = () => {
        p.createCanvas(800, 400).parent("vignette");
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
