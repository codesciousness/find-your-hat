const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
        this.outerIndex = 0;
        this.innerIndex = 0;
        this.field[0][0] = pathCharacter;
        this.won = false;
        this.loss = false;
    }

    print() {
        this.field.forEach(el => console.log(el.join('')));
    }

    playGame() {
        while (!this.won && !this.loss) {
            this.print();
            let direction = prompt('Which way? (d = Down, u = Up, l = left & r = right): ').toLowerCase();
        
            if (direction === 'l') {
                this.innerIndex--;
            }
            else if (direction === 'r') {
                this.innerIndex++;
            }
            else if (direction === 'u') {
                this.outerIndex--;
            }
            else if (direction === 'd') {
                this.outerIndex++;
            }
            else {
                console.log('Please enter d, u, l or r');
            }
            if (this.innerIndex < 0 || this.innerIndex > this.field[0].length - 1 || this.outerIndex < 0 || this.outerIndex > this.field.length - 1) {
                console.log('You went out of bounds!');
                console.log('Sorry, you lost the game :(');
                this.loss = true;
            }
            else if (this.field[this.outerIndex][this.innerIndex] === hole) {
                console.log('You fell down a hole!');
                console.log('Sorry, you lost the game :(');
                this.loss = true;
            }
            else if (this.field[this.outerIndex][this.innerIndex] === hat) {
                console.log('You found your hat!');
                console.log('Congrats, you won the game :)');
                this.won = true;
            }
            else {
                this.field[this.outerIndex][this.innerIndex] = pathCharacter;
            }
        }
    }

    static generateField(height = 3, width = 3, percentage = 0.25) {
        let newField = [];
        let hatOuterIndex;
        let hatInnerIndex;
        function randomRow() {
            let row = [];
            const fieldComponents = [hole, fieldCharacter];
            while (row.length < width) {
                let randomComponent = fieldComponents[Math.floor(Math.random() * fieldComponents.length)];
                row.push(randomComponent);
            }
            return row;
        }
        function addRow() {
            let newRow = randomRow();
            let percentOfHoles = newRow.filter(el => el === hole).length / newRow.length;
            let lowerRange = percentage - 0.1;
            let upperRange = percentage + 0.1;
            while (percentOfHoles < lowerRange || percentOfHoles > upperRange) {
                newRow = randomRow();
                percentOfHoles = newRow.filter(el => el === hole).length / newRow.length;
            }
            return newRow;
        }
        while (newField.length < height) {
            let rowElement = addRow();
            newField.push(rowElement);
        }
        function addHat() {
            hatOuterIndex = Math.floor(Math.random() * height);
            hatInnerIndex = Math.floor(Math.random() * width);
            while (hatOuterIndex === 0 && hatInnerIndex === 0) {
                hatOuterIndex = Math.floor(Math.random() * height);
                hatInnerIndex = Math.floor(Math.random() * width);
            }
            newField[hatOuterIndex][hatInnerIndex] = hat;
        }
        addHat();
        return newField;
    }
}

const newGame = new Field(Field.generateField(6, 6, 0.3));
newGame.playGame();