import p5 from "p5";
import WordDisplay from "./WordDisplay";

interface Word {
    p: p5;
    word: string;
    wordDisplay: WordDisplay;
    onDestroyCallback: Function;

    loop();
    onDestroy();
    isOffScreen(): boolean;
}

export default Word;