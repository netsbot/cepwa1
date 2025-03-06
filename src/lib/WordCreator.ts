class WordCreator {
    private data: string[];

    constructor(data: { words: string[] }) {
        this.data = data.words;
    }

    getRandomWord() {
        return this.data[Math.floor(Math.random() * this.data.length)]
    }
}

export default WordCreator;