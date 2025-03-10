import NormalWord from "./word-types/normal-word";
import MultiplierWord from "./word-types/multiplier-word";
import SlowWord from "./word-types/slow-word";

class WordCreator {
    private data: string[];

    private wordTypes = [
        {
            wordType: NormalWord,
            probability: 0.8
        },
        {
            wordType: MultiplierWord,
            probability: 0.1
        },
        {
            wordType: SlowWord,
            probability: 0.1
        }
    ]

    constructor(data: { words: string[] }) {
        this.data = data.words;
    }

    getRandomWord() {
        return this.data[Math.floor(Math.random() * this.data.length)];
    }

    getRandomWordType() {
        let rand = Math.random();
        let randomTrack = 0;

        for (let i = 0; i < this.wordTypes.length; i++) {
            randomTrack += this.wordTypes[i].probability;
            if (rand <= randomTrack) {
                return this.wordTypes[i].wordType;
            }
        }
    }
}

export default WordCreator;