const ball = document.getElementById('ball');
const beach = document.getElementById('beach');
const player1 = document.getElementById('player1');
let beachRect = beach.getBoundingClientRect('beach');
let meRect = player1.getBoundingClientRect('player1');

//버튼
const bt_up = document.getElementById('bt_up')
const bt_down = document.getElementById('bt_down')
const bt_left = document.getElementById('bt_left')
const bt_right = document.getElementById('bt_right')
const bt_spacebar = document.getElementById('bt_spacebar')

//공 세팅
let posX = 100; //첫위치
let posY = 200; 
let previous_posX = 0;
let previous_posY = 0;
let velocityX = 2; //한번에 이동하는 px 크기
let velocityY = 2;
let ball_radius = ball.clientWidth / 2; //공 qks지름

//네트 세팅
const wall = document.getElementById('wall');
let wallRect = wall.getBoundingClientRect('wall');

//내 캐릭터 세팅
let isTouching = false;
let speed = 3; // 이동속도
let myposX = meRect.left + (meRect.width/2);//첫위치
let myposY = meRect.top + (meRect.height/2);
let jumpcheck = false;

//애니메이션 세팅
let moveInterval; 
let intervalTime = 100; //0.1초



function moveBall() {
    posX += velocityX;
    posY += velocityY;

    // 양쪽 벽에 닿았을때
    if ((posX <= 0 + ball_radius) || (posX >= (beach.clientWidth - ball_radius))) {
        velocityX *= -1;
    }
    // 천장에 닿았을때
    if (posY <= 0 + ball_radius) {
        velocityY *= -1;
    }
    // 바닥에 닿았을때
    if (posY >= (beach.clientHeight - ball_radius)) {
        velocityY *= -1;
    }


    // 네트 옆면에 닿았을때

    if ((posX >= (beach.clientWidth/2)-2 - ball_radius) && 
        (posX <= (beach.clientWidth/2)+2 + ball_radius) && 
        (posY >= beach.clientHeight - wall.clientHeight - ball_radius)){
            if((previous_posY < (beach.clientHeight - wall.clientHeight - ball_radius)) && (velocityY > 0)){
                console.log('윗면');
                velocityY *= -1;
            }else{
                console.log('옆면');
                velocityX *= -1;
            }
        
        
    }
 
    console.log(posY);
    ball.style.left = `${posX}px`;
    ball.style.top = `${posY}px`;

    previous_posX = posX;
    previous_posY = posY;

    requestAnimationFrame(moveBall);
}

// 중앙 벽 없을때
/* 
function moveBall() {
    posX += velocityX;
    posY += velocityY;

    // Ball collision with walls
    if (posX <= 0 + (ball_width/2) || posX >= (beach.clientWidth - (ball_width/2))) {
        velocityX *= -1;
    }
    if (posY <= 0 + (ball_width/2) || posY >= (beach.clientHeight - (ball_width/2))) {
        velocityY *= -1;
    }

    ball.style.left = `${posX}px`;
    ball.style.top = `${posY}px`;

    requestAnimationFrame(moveBall);
}
*/
moveBall();





/* //requestAnimationFrame()를 이용해서 백호돌이 움직이는 방법
let animationFrame;
let direction = null;
let speed = 2;

function moveImage() {
    let beachRect = beach.getBoundingClientRect('beach');
    let meRect = me_temp.getBoundingClientRect('me_temp');

    if (direction) {
        switch (direction) {
            case 'up':
                if (meRect.top > beachRect.top) {
                    me_temp.style.top = `${me_temp.offsetTop - speed}px`;
                    console.log(meRect.top);
                    //console.log(beachRect.top);
                    //console.log('11');
                }
                break;
            case 'down':
                if (meRect.bottom < beachRect.bottom) {
                    me_temp.style.top = `${me_temp.offsetTop + speed}px`;
                }
                break;
            case 'left':
                if (meRect.left > beachRect.left) {
                    me_temp.style.left = `${me_temp.offsetLeft - speed}px`;
                }
                break;
            case 'right':
                if (meRect.right < beachRect.right) {
                    me_temp.style.left = `${me_temp.offsetLeft + speed}px`;
                }
                break;
        }
        animationFrame = requestAnimationFrame(moveImage);
    }
}
moveImage();
*/


/* //requestAnimationFrame()를 이용해서 백호돌이 움직이는 방법
function startMoving(dir) {
    if (!direction) {
        direction = dir;
        
        animationFrame = requestAnimationFrame(moveImage);
    }
}

function stopMoving() {
    direction = null;
    cancelAnimationFrame(animationFrame);
}
*/

//blackmssk.addEventListener('touchstart', () => {});





// -----------------좌우이동관련 함수
function startMoving(dir) {

        moveInterval = setInterval(function(){
            direction = dir;
            switch (direction){
                case 'up':
                    console.log('1');
                   
                    break;
                case 'down':
                    console.log('2');
                    break;
                case 'left':
                    console.log('3');
                    myposX -= speed;
                    if(myposX < 0 + (meRect.width/2)){
                        myposX += speed;
                    }else{
                        player1.style.left = `${myposX}px`;
                    }
                    break;
                case 'right':
                    console.log('4');
                    myposX += speed;
                    if(myposX > ((beach.clientWidth/2) - (meRect.width/2))){
                        myposX -= speed;
                    }else{
                        player1.style.left = `${myposX}px`;
                    }
                    break;
            }
        }, intervalTime);
        
}
function stopMoving() {
    isTouching = false;
    clearInterval(moveInterval);
}

// -----------------점프관련 함수
function startJump() {
    player1.classList.add('jump_volleyball');
    jumpcheck = true;
}
function finishJump() {
    player1.classList.remove('jump_volleyball');
    jumpcheck = false;
}
function jump() {
    if(jumpcheck){ //점프중이면 실행X
    }else{
        startJump();
        setTimeout(finishJump, 800);
    }
}

bt_up.addEventListener('mousedown', jump);
bt_down.addEventListener('touchstart', () => {startMoving('down')});
bt_down.addEventListener('touchend', stopMoving);
bt_left.addEventListener('touchstart', () => {startMoving('left')});
bt_left.addEventListener('touchend', stopMoving);
bt_right.addEventListener('touchstart', () => {startMoving('right')});
bt_right.addEventListener('touchend', stopMoving);
//bt_up.addEventListener('mousedown', () => {startMoving('up')});
//bt_up.addEventListener('mouseup', stopMoving);
//bt_up.addEventListener('mouseleave', stopMoving);

//bt_down.addEventListener('mousedown', () => startMoving('down'));
//bt_down.addEventListener('mouseup', stopMoving);
//bt_down.addEventListener('mouseleave', stopMoving);

//bt_left.addEventListener('mousedown', () => startMoving('left'));
//bt_left.addEventListener('mouseup', stopMoving);
//bt_left.addEventListener('mouseleave', stopMoving);

//bt_right.addEventListener('mousedown', () => startMoving('right'));
//bt_spacebar.addEventListener('mouseup', stopMoving);
//bt_spacebar.addEventListener('mouseleave', stopMoving);