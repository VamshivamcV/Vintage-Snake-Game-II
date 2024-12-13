// defining html elements
const board = document.getElementById('game-board');

const instructionText = document.getElementById('instruction-text');

const logo = document.getElementById('logo');

const score = document.getElementById('score');

const highScoreText = document.getElementById('highScore');

//defining game variables
const gridSize = 20;

let gameInterval;

let gameSpeedDelay = 200;

let gameStarted = false;

let direction = 'right';

let snake = [{ x: 10, y: 10 }];

let food = generateFood();

let highScore = 0;

var snd1 = new Audio('Aout.wav');
var snd2 = new Audio('Aeat.wav');

// drawing game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//Draw snake
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// creating a snake or food cube/div
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//setting the psition of snake or food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Testing draw function
// draw();

//draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
}

// generating food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x,y};
}

//Moving the snake
function move() {
    const head = { ...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    // snake.pop();

    if (head.x === food.x && head.y === food.y){
        snd2.play();
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }else{
        snake.pop();
    }
}

//Test moving
// setInterval(() => {
//     move(); // Move first
//     draw(); // Then draw again new postion
// }, 200);

// Start game function
function startGame() {
    // navigator.vibrate(100);
    gameStarted = true; // keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}



// keypress event Listener
function handleKeyPress(event) {

    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) 
        {
            startGame();
        }else{
            switch (event.key){
                case 'ArrowUp':
                    direction = 'up';
                    break;
                case 'ArrowDown':
                    direction = 'down';
                    break;
                case 'ArrowLeft':
                    direction = 'left';
                    break;
                case 'ArrowRight':
                    direction = 'right';
                    break;
            }
    }
}

// touch buttons

let bool = false;

const startButton = () => {
    resetGame();
    startGame();
}

function moveup() {
    navigator.vibrate(100);
    direction = 'up';
}

function movedown() {
    navigator.vibrate(100);
    direction = 'down';
}

function moveleft() {
    navigator.vibrate(200);
    direction = 'left';
}

function moveright() {
    navigator.vibrate(100);
    direction = 'right';
}


document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    // console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}


function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        snd1.play();
        alert("You Lost the Game");
        resetGame();
    }

    for (let i = 1; i< snake.length; i++) {
        if (head.x ===snake[i].x && head.y === snake[i].y){
            snd1.play();
            alert("You Lost the Game");
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block'
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}


