const board = document.querySelector('#game-board');
const inst = document.querySelector('#instruction-text');
const logo = document.querySelector('#logo');
const currentScore = document.querySelector('#score');
const bestScore = document.querySelector('#highScores');

let snake = [{x: 12, y:12}];//24 boxes on either side
let gridSize = 24;
let food = generateFood();
let direction = 'up';
let gameInterval ;
let gameSpeedDelay = 200;
let gameStarted = false;
let highestScore = 0;

function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}
//Creating a new Snake every time it resets
function drawSnake(){
    if(gameStarted){
        snake.forEach(segment => {
            const snakeElement = createGameElement('div','snake');
            setPosition(snakeElement, segment);
            board.appendChild(snakeElement);
        })
    }
}
//Create a new Snake or food div.
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}
//setting position of snake or food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

//Moving the snake using event listeners such as keyup, keydown and onkeypress
function move(){
    const head = {...snake[0]};
    switch(direction){
        case 'up':  head.y--; break;
        case 'down':  head.y++; break;
        case 'left':  head.x--; break;
        case 'right':  head.x++; break;
    }
    snake.unshift(head);
    if(head.x==food.x && head.y==food.y){
        food = generateFood();
        decreaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval( () => {
            move(); 
            checkCollision();
            draw();
        },gameSpeedDelay);
    }
    else
        snake.pop();
}

function startgame(){
    console.log("Game started");
    gameStarted = true;
    inst.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval( () => {
        move(); 
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//Keypress listener event
function handleKeyPress(event){
    console.log("Key pressed:", event.key);
    if((!gameStarted && event.code==='Space') || (!gameStarted && event.key ===' ')){
        console.log("Starting game"); startgame();
        
    }
    else{
        switch(event.key){
            case'ArrowUp': if(direction!='down') direction = 'up'; break;
            case'ArrowDown': if(direction!='up') direction = 'down'; break;
            case'ArrowLeft': if(direction!='right') direction = 'left'; break;
            case'ArrowRight': if(direction!='left') direction = 'right'; break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function decreaseSpeed(){
    if(gameSpeedDelay>150) gameSpeedDelay -= 5;
    else if(gameSpeedDelay>100) gameSpeedDelay -= 3;
    else if(gameSpeedDelay>50) gameSpeedDelay -= 2;
}

function checkCollision() {
    const head=snake[0];
    //let sc = parseInt(currentScore.textContent);
    if(head.x<1 || head.x>gridSize || head.y<1 || head.y>gridSize){
         resetGame();
    }
    else{
        for(let i=0;i<snake.length; i++){
            if(i>0 && head.x===snake[i].x && head.y===snake[i].y ){
                console.log(i); resetGame(); 
            }
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [ { x:12, y:12} ];
    food = generateFood();
    direction = 'up';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const current = snake.length -1;
    currentScore.textContent = current.toString().padStart(3,0);
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    inst.style.display = 'block';
    logo.style.display = 'block';
    board.innerHTML = '';
}

function updateHighScore(){
    const current = snake.length - 1;
    if(current > highestScore){
        highestScore = current;
        bestScore.textContent = highestScore.toString().padStart(3,0);
    }
    bestScore.style.display = 'block';
}
