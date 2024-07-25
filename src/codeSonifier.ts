import acorn from 'acorn';

class CodeSonifier {
    notes: string[];
    currentNote: number;
    sequence: { notes: string[]; time: number; duration: number }[];

    constructor() {
        this.notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
        this.currentNote = 0;
        this.sequence = [];
    }

    //parse the given code using acorn
    parseCode(code: string) {
        return acorn.parse(code, { ecmaVersion: 2020 });
    }

    // generate sequence
    sonify(code: string) {
        const ast = this.parseCode(code);
        this.sequence = [];
        this.traverseNode(ast);
        return this.sequence;
    }

//    generate notes accordingly
    traverseNode(node: acorn.Node, time = 0) {
        switch (node.type) {
            case 'Program':
                if ('body' in node) { // Type guard for 'body'
                    node.body.forEach((childNode: acorn.Node, index: number) => { // Explicitly type childNode and index
                        this.traverseNode(childNode, time + index * 0.5);
                    });
                }
                break;
            case 'FunctionDeclaration':
                if ('body' in node) { // Type guard for 'body'
                    const body = node.body as acorn.Node[]; // Type annotation for 'body'
                    body.forEach((childNode: acorn.Node, index) => { // Explicitly type childNode
                        this.traverseNode(childNode, time + index * 0.5);
                    });
                }
                break;
            case 'ForStatement':

                this.addRepeatingNote('A4', time, 0.125, 4);
                if ('body' in node) {
                    this.traverseNode(node.body, time + 1);
                }
                break;
            case 'IfStatement':
                if ('consequent' in node) {
                if ('alternate' in node) {(node.consequent, time + 0.25);
                    if ('alternate' in node) {
                        this.traverseNode(node.alternate, time + 0.5);
                    }
                this.addToSequence(['E5'], time, 0.125);
                this.traverseNode(node.consequent, time + 0.25);
                if (node.alternate) {
                    this.traverseNode(node.alternate, time + 0.5);
                }
                break;
            default:
                // play the next note
                this.addToSequence([this.getNextNote()], time, 0.0625);
        }
    }

    addToSequence(notes: string[], time: number, duration: number) {
        this.sequence.push({ notes, time, duration });
    }

    addRepeatingNote(note: string, time: number, duration: number, repetitions: number) {
        for (let i = 0; i < repetitions; i++) {
            this.addToSequence([note], time + i * duration, duration);
        }
    }

    // get the next note in the sequence
    getNextNote() {
        const note = this.notes[this.currentNote];
        this.currentNote = (this.currentNote + 1) % this.notes.length;
        return note;
    }
}

export { CodeSonifier };