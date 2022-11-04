const canvas = document.getElementById('snake');
const ctx = canvas.getContext("2d");
const dimension = 600;
canvas.width = dimension;
canvas.height = dimension;
const tileSize = 20;

const step = {
    count: 0,
    max: 10
}

let score = 0;

let snake = {
    x: 0,
    y: 0,
    dirX: 0,
    dirY: 0,
    color: 'green',
    len: 1,
    segments: [],
    direction: ''
}
let food = {
    x: 0,
    y: 0,
    color: 'red'
}
setRandomPosition(food);
setRandomPosition(snake);


function restart(){
    step.count = 0;
    score = 0;
    snake.segments = [];
    snake.dirX = 0;
    snake.dirY = 0;
    snake.len = 1;
    snake.direction = '';
    renderScore();
    setRandomPosition(food);
    setRandomPosition(snake);
}

restart()

function setRandomPosition(object) {
    object.x = Math.floor(Math.random() * ((canvas.width / tileSize) - 0) + 0) * tileSize;
    object.y = Math.floor(Math.random() * ((canvas.height / tileSize) - 0) + 0) * tileSize;
}

function renderFood() {
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, tileSize, tileSize);
}

function renderSegment(x,y){
    ctx.fillStyle = snake.color;
    ctx.fillRect(x, y, tileSize, tileSize);
}

function renderSnake() {
    
    snake.x += snake.dirX;
	snake.y += snake.dirY;
    
    snake.segments.unshift({x: snake.x, y: snake.y});
	
    if ( snake.segments.length > snake.len ) {
		snake.segments.pop();
	}

	snake.segments.forEach((segment, idx) => {
        renderSegment(segment.x, segment.y);
		checkFoodCollision(segment);
        checkTailCollission(segment, idx);
    });
    
}

function renderScore() {
    let scoreElement = document.getElementById('score');
    scoreElement.innerText = score;
}

function checkFoodCollision(segment) {
    if ( segment.x == food.x && segment.y == food.y ) {
        score++;
        renderScore();
        snake.len++;
        setRandomPosition(food);
        renderFood();        
    }
}

function checkBordersCollision() {

    if ( snake.x < 0 ) {
        snake.x = -tileSize;
        snake.direction = 'right';
        snake.dirX = tileSize;
        snake.dirY = 0;
        if(snake.y < canvas.height / 2) {
            snake.y = snake.y + tileSize;
        } else {
            snake.y = snake.y - tileSize;
        }
    } else if (snake.x >= canvas.width) {
        snake.x = canvas.width;
        snake.direction = 'left';
        snake.dirX = -tileSize;
        snake.dirY = 0;
        if(snake.y < canvas.height / 2) {
            snake.y = snake.y + tileSize;
        } else {
            snake.y = snake.y - tileSize;
        }
    }

    if ( snake.y < 0 ) {
        snake.y = -tileSize;
        snake.direction = 'down';
        snake.dirX = 0;
        snake.dirY = tileSize;
        if(snake.x < canvas.height / 2) {
            snake.x = snake.x + tileSize;
        } else {
            snake.x = snake.x - tileSize;
        }
    } else if (snake.y >= canvas.height) {
        snake.y = canvas.height;
        snake.direction = 'up';
        snake.dirX = 0;
        snake.dirY = -tileSize;
        if(snake.x < canvas.height / 2) {
            snake.x = snake.x + tileSize;
        } else {
            snake.x = snake.x - tileSize;
        }
    }
    
    // if border collision, restart    
    // if ( snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
	// 	restart();
	// }
}

function checkTailCollission(segment, idx) {
    for ( let i = idx + 1; i < snake.segments.length; i++ ) {
        if ( segment.x === snake.segments[i].x && segment.y === snake.segments[i].y ) {
            restart();
        }
    }
}

function readKeyboard() {
    document.addEventListener("keydown", (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if(snake.direction != 'down'){
                    snake.direction = 'up';
                    snake.dirY = -tileSize;
		            snake.dirX = 0;
                }
                break;
            case 'ArrowDown':
                if(snake.direction != 'up'){
                    snake.direction = 'down';
                    snake.dirY = tileSize;
		            snake.dirX = 0;
                }
                break;
            case 'ArrowLeft':
                if(snake.direction != 'right'){
                    snake.direction = 'left';
                    snake.dirX = -tileSize;
                    snake.dirY = 0;
                }                
                break;
            case 'ArrowRight':
                if(snake.direction != 'left'){
                    snake.direction = 'right';
                    snake.dirX = tileSize;
		            snake.dirY = 0;
                }                
                break;
        }
    })
}

function renderBackground() {
    ctx.clearRect(0,0, dimension, dimension);
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, dimension, dimension);
}

window.requestAnimationFrame(loop);
function loop() {
    window.requestAnimationFrame(loop);
    readKeyboard();
    // Control speed
    if ( ++step.count < step.max ) return;
	step.count = 0;

    renderBackground();
    renderFood();    
    renderSnake();
    checkBordersCollision();
}

loop();




