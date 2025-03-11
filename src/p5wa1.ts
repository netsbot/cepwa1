import p5 from "p5";
import { Howl } from "howler";
import Controller from "./controller";
import Word from "./words/word";

const p5wa1 = (p: p5) => {
    let controller: Controller;
    let font: p5.Font;

    p.preload = () => {
        if (process.env.NODE_ENV === 'production') {
            font = p.loadFont("https://netsbot.github.io/cepwa1/assets/jbm.ttf");
            Controller.wrongSound = new Howl({
                src: ["https://netsbot.github.io/cepwa1/assets/wrong.mp3"],
            });
            Controller.clickSound = new Howl({
                src: ["https://netsbot.github.io/cepwa1/assets/click.mp3"],
            });
        } else {
            font = p.loadFont("/assets/jbm.ttf");

            Controller.wrongSound = new Howl({
                src: ["/assets/wrong.mp3"],
            });
            Controller.clickSound = new Howl({
                src: ["/assets/click.mp3"],
            });
        }

        Word.setFont(font);
    };

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
