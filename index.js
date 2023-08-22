import * as readline from 'readline';
import colors from 'colors';

const width = 80;
const height = 20;

const board = Array.from({ length: height }, () => Array.from({ length: width }, () => ' '));

let snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
];

let food = generateFood();

function generateFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };
        if (!snake.some(part => part.x === newFood.x && part.y === newFood.y)) {
            break;
        }
    }
    return newFood;
}

let dx = 1;
let dy = 0;

function drawBoard() {
    console.clear();

    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (snake.some(part => part.x === x && part.y === y)) {
                process.stdout.write(colors.green('■'));
            } else if (food.x === x && food.y === y) {
                process.stdout.write(colors.yellow('★'));
            } else {
                process.stdout.write('·');
            }
        });
        process.stdout.write('\n');
    });
}

function updateSnake() {
    const head = { ...snake[0] };

    head.x += dx;
    head.y += dy;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        gameOver();
    }
}

function gameOver() {
    console.clear();
    console.log(colors.red('Game over!'));

    const linkText = 'Meu Github: ';
    const url = 'https://github.com/FaelN1';
    console.log(colors.blue(linkText) + url);

    process.exit();
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.name === 'right' && dx === 0) {
        dx = 1;
        dy = 0;
    } else if (key.name === 'left' && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (key.name === 'up' && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (key.name === 'down' && dy === 0) {
        dx = 0;
        dy = 1;
    } else if (key.name === 'c' && key.ctrl) {
        process.exit();
    }
});

function gameLoop() {
    updateSnake();
    drawBoard();
    setTimeout(gameLoop, 100);
}

gameLoop();
