const prompt = require('prompt-sync')({sigint: true});
const term = require('terminal-kit').terminal;

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
        do {
            this.outerIndex = Math.floor(Math.random() * this.field.length);
            this.innerIndex = Math.floor(Math.random() * this.field[0].length);
        }
        while (this.field[this.outerIndex][this.innerIndex] === hat)
        this.field[this.outerIndex][this.innerIndex] = pathCharacter;
        this.won = false;
        this.loss = false;
        this.level = 1;
        this.score = 0;
        this.mode = 'Easy';
    }

    print() {
        for (let y = 0; y < this.field.length; y++) {
            for (let x = 0; x < this.field[0].length; x++) {
                if (y === this.outerIndex && x === this.innerIndex) {
                    term.blue.bold(pathCharacter)
                }
                else if (this.field[y][x] === pathCharacter) {
                    term.blue.bold(pathCharacter);
                }
                else if (this.field[y][x] === hole) {
                    term.red.bold(hole);
                }
                else if (this.field[y][x] === hat) {
                    term.noFormat(hat);
                }
                else {
                    term.green.bold(fieldCharacter);
                }
            }
            console.log('');
        }
    }

    playGame() {
        while (!this.won && !this.loss) {
            console.clear();
            this.scoreboard();
            this.print();
            let direction = prompt(term.bold('Which way? ').magenta.bold('(d = down, ').blue.bold('u = up, ').green.bold('l = left, ').yellow.bold('r = right): ')).toLowerCase();
        
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
                term.yellow.bold('Enter d, u, l or r: \n');
            }
            if (this.innerIndex < 0 || this.innerIndex > this.field[0].length - 1 || this.outerIndex < 0 || this.outerIndex > this.field.length - 1) {
                term.red.bold('You went out of bounds! Sorry, you lost the game :(\n');
                this.loss = true;
            }
            else if (this.field[this.outerIndex][this.innerIndex] === hole) {
                term.red.bold('You fell down a hole! Sorry, you lost the game :(\n');
                this.loss = true;
            }
            else if (this.field[this.outerIndex][this.innerIndex] === hat) {
                console.clear();
                term.green.bold('You found your hat! Congrats, you won the game :)\n');
                this.score++;
                this.level++;
                this.scoreboard();
                this.won = true;
                this.switchMode();
                this.nextLevel();
            }
            else {
                this.score++;
                this.field[this.outerIndex][this.innerIndex] = pathCharacter;
                if (this.mode === 'Hard' && this.score % 3 === 0) {
                    let randOuterIdx;
                    let randInnerIdx;
                    do {
                        randOuterIdx = Math.floor(Math.random() * this.field.length);
                        randInnerIdx = Math.floor(Math.random() * this.field[0].length);
                    }
                    while (this.field[randOuterIdx][randInnerIdx] !== fieldCharacter)
                    this.field[randOuterIdx][randInnerIdx] = hole;
                }
            }
        }
    }

    nextLevel() {
        this.won = false;
        this.loss = false;
        do {
            this.outerIndex = Math.floor(Math.random() * this.field.length);
            this.innerIndex = Math.floor(Math.random() * this.field[0].length);
        }
        while (this.field[this.outerIndex][this.innerIndex] === hat)
        do {
            this.field = Field.generateField(this.level, this.level);
        }
        while(!this.solvable(this.field) || this.field[this.outerIndex][this.innerIndex] === hat)
        this.field[this.outerIndex][this.innerIndex] = pathCharacter;
        this.playGame();
    }

    scoreboard() {
        term.bold(`You are on `).magenta.bold(`Level: ${this.level} `).blue.bold(`Score: ${this.score} `).green.bold(`Mode: ${this.mode}\n`);
    }

    switchMode() {
        let response = prompt(term.bold('Switch mode? ').cyan.bold('(Y = Yes or any other key for No) \n')).toLowerCase();

        if (response === 'y') {
            this.mode === 'Hard' ? this.mode = 'Easy' : this.mode = 'Hard';
        }
    }

    solvable(field) {
        const currOuterIdx = this.outerIndex;
        const currInnerIdx = this.innerIndex;
        const currPosition = [currOuterIdx, currInnerIdx];
        const left = [0, -1];
        const right = [0, 1];
        const up = [-1, 0];
        const down = [1, 0];
        const directions = [left, right, up, down];
        let foundHat = false;
        let queue = [currPosition];
        let visited = [currPosition];

        while (queue.length > 0) {
            let node = queue.shift();
            for (let d = 0; d < directions.length; d++){
                let i = node[0];
                let j = node[1];
                if (i + directions[d][0] >= 0 && i + directions[d][0] <= field.length - 1) {
                    i += directions[d][0];
                }
                if (j + directions[d][1] >= 0 && j + directions[d][1] <= field[0].length - 1) {
                    j += directions[d][1];
                }
                if (!visited.some(el => el[0] === i && el[1] === j) && field[i][j] !== hole) {
                    queue.push([i, j]);
                    visited.push([i, j]);
                }
                if (field[i][j] === hat) {
                    foundHat = true;
                    queue.length = 0;
                }
            }
        }
        return foundHat;
    }

    static generateField(height, width, percentage = 0.3) {
        height += 3;
        width += 3;
        let newField = [];

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

        let hatOuterIndex = Math.floor(Math.random() * height);
        let hatInnerIndex = Math.floor(Math.random() * width);
        newField[hatOuterIndex][hatInnerIndex] = hat;
        return newField;
    }
}

const gameField = Field.generateField(0, 0);
const newGame = new Field(gameField);
while(!newGame.solvable(gameField)) {
    newGame.field = gameField;
}
newGame.playGame();