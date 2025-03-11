import p5 from "p5";

class InputDisplay {
    private p: p5;
    private input: p5.Element;

    constructor(p: p5) {
        this.p = p;
        this.input = p.createInput();
        this.input.position(0, p.height);
        this.input.size(p.width);
        this.input.style("position: static;");
    }

    getValue(): string {
        return this.input.value().toString();
    }

    clear() {
        this.input.value("");
    }
}

export default InputDisplay;
