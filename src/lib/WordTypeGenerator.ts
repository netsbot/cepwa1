import BombWord from "./BombWord";
import NormalWord from "./NormalWord";

class WordTypeGenerator {
    static wordTypes = [
        {
            wordType: NormalWord,
            probability: 0.51
        },
        {
            wordType: BombWord,
            probability: 0.49
        }
    ]

    static generateWordType() {
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

export default WordTypeGenerator;