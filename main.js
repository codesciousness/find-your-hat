const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
    }

    print() {
        this.field.forEach(el => console.log(el.join('')));
    }

    static generateField(height, width, percentage) {
        let newField = [];
        function randomRow() {
            let row = [];
            const fieldComponents = [hole, fieldCharacter];
            while(row.length < width) {
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
        while(newField.length < height) {
            let rowElement = addRow();
            newField.push(rowElement);
        }
        function addHat() {
            let randFieldIndex = Math.floor(Math.random() * newField.length);
            let randRowIndex = Math.floor(Math.random() * width);
            newField[randFieldIndex][randRowIndex] = hat;
        }
        function addStartPos() {
            newField[0][0] = pathCharacter;
        }
        addHat();
        addStartPos();
        console.log(newField);
        return newField;
    }
}

const practiceGame = new Field(
    [
    [ '*', '░', '░', '░' ],
    [ '░', '░', 'O', '░' ],
    [ '░', '^', '░', 'O' ],
    [ '░', '░', 'O', '░' ]
]);

practiceGame.print();
//Field.generateField(4, 4, .25);