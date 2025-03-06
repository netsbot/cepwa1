type WordBlockInfo = {bg: number[], txt: number[]};


class WordBlockType {
    static Normal: WordBlockInfo = {
        bg: [220, 220, 220],
        txt: [0, 0, 0]
    };
    static Bomb: WordBlockInfo = {
        bg: [0, 0, 0],
        txt: [255, 255, 255]
    };
    static Multiplier: WordBlockInfo = {
        bg: [255, 0, 0],
        txt: [255, 255, 255]
    }
    static Slow: WordBlockInfo = {
        bg: [0, 255, 0],
        txt: [255, 255, 255]
    }
}

export { WordBlockType, WordBlockInfo };