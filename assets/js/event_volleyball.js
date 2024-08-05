
const ball = document.getElementById('ball');
const gameCanvasContainer = document.getElementById('game-canvas-container');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const player1_powerhitting = document.getElementById('player1_powerhitting');
const top_section_volleyball = document.getElementById('top_section_volleyball_id');
let top_section_Rect = top_section_volleyball.getBoundingClientRect('top_section_volleyball');
let beachRect = gameCanvasContainer.getBoundingClientRect('gameCanvasContainer');
let meRect = player1.getBoundingClientRect('player1');
let enemyRect = player2.getBoundingClientRect('player2');
const myscore = document.getElementById('myscore');
const enemyscore = document.getElementById('enemyscore');
const round = document.getElementById('round');

const blackmssk = document.getElementById('blackmask');
const waiting_volleyball = document.getElementById('waiting_volleyball');
const gameover = document.getElementById('gameover');
const win = document.getElementById('win');
const readygo = document.getElementById('readygo');

//버튼
const bt_up = document.getElementById('bt_up')
const bt_down = document.getElementById('bt_down')
const bt_left = document.getElementById('bt_left')
const bt_right = document.getElementById('bt_right')
const bt_spacebar = document.getElementById('bt_spacebar')

//공 세팅
let posX = 50;//첫위치
let posY = beachRect.height * 0.15; 
let previous_posX = 0;
let previous_posY = 0;
let velocityX = 4; //한번에 이동하는 픽셀 크기(공의 속도 결정)
let velocityY = 4;
let ball_radius = ball.clientWidth / 2; //공 반지름
let gravity = 0.2; // 공 중력
let isBoom = false; // 바닥 터지는 효과 활성화 여부

//네트 세팅
const wall = document.getElementById('wall');
let wallRect = wall.getBoundingClientRect('wall');

//내 캐릭터 세팅
let isSideMoving = false; // 좌우이동 여부
let movingLeft = false;
let movingRight = false;
let isJumping = false; // 점프 여부
let jumpVelocityY = -4; //점프 시 한번에 이동하는 픽셀 크기(점프 속도 결정)
let jumpingGravity = 0.07; // 점프 중력
let movingSpeed = 2; // 이동속도
let myposX = (meRect.width/2); //첫위치
player1.style.left = myposX + 'px';
let myposY = beachRect.height - (meRect.height/2);
player1.style.top = myposY + 'px';

//상대 캐릭터 세팅
let isEnemySideMoving = true; // 좌우이동 여부
let EnemySideMovingDir = 0; // 0: 왼쪽방향이동 / 1: 오른쪽 방향이동
let enemyMovingSpeed = 1; // 적 이동속도
let enemyposX = beachRect.width - (enemyRect.width/2); //첫위치
player2.style.left = enemyposX + 'px';
let enemyposY = beachRect.height - (enemyRect.height/2);
player2.style.top = enemyposY + 'px';

//충돌 세팅
let ballWithPlayerCollisionDir = 0; // 공과 플레이어의 충돌 방향(0~4)
let leftBallrightPlayer = false; // 충돌 시 공이 왼쪽에서 맞았는가 

//라운드 및 점수 세팅
let myPresentScore = 0;
let enemyPresentScore = 0;
let PresentRound = 1;
let roundFinish = false;
let gameFinish = false;

//공격 세팅
let isPressHitting = false;


//애니메이션 세팅
let requestAni;




///////////////////////////////////////////////////////////////////////////////////////////////////////
// 이미지 Preload
const images = [
    "../../images/waiting_volleyball.gif",
    "../../images/ball.gif",
    "../../images/beach.gif",
    "../../images/walking_volley.gif",
    "../../images/walking_volley2.gif",
    "../../images/type_down.png",
    "../../images/type_left.png",
    "../../images/type_right.png",
    "../../images/type_spacebar.png",
    "../../images/type_up.png",
    "../../images/win.gif"
];
const preload = (images) => {
    images.forEach((image) => {
        const img = new Image();
        img.src = image;
    });
};
preload(images);




function moveBall() {
    
    velocityY += gravity;
    posX += velocityX;
    posY += velocityY;

    // 양쪽 벽에 닿았을때
    if ((posX <= 0 + ball_radius) || (posX >= (gameCanvasContainer.clientWidth - ball_radius))) {
        velocityX *= -1;
        posX += velocityX;
    }
    // 천장에 닿았을때
    if (posY <= 0 + ball_radius) {
        velocityY *= -1;
        posY += velocityY;
    }
    // 바닥에 닿았을때(라운드 종료)
    if (posY >= (gameCanvasContainer.clientHeight - ball_radius)) {
        velocityY *= -1;
        posY += velocityY;
        isBoomCheck(); // 바닥 터지는 효과
        roundFinish = true;
        roundResultCheck();
        return;
        
    }


    // 네트 옆면에 닿았을때
    if ((posX >= (gameCanvasContainer.clientWidth/2)-2 - ball_radius) && 
        (posX <= (gameCanvasContainer.clientWidth/2)+2 + ball_radius) && 
        (posY >= gameCanvasContainer.clientHeight - wall.clientHeight - ball_radius)){
            if((previous_posY < (gameCanvasContainer.clientHeight - wall.clientHeight - ball_radius)) && (velocityY > 0)){
                velocityY *= -1;
                posY += velocityY;
            }else{
                velocityX *= -1;
                posX += velocityX;
            }
    }
 
    //내 좌우위치
    if(isSideMoving){ // 좌우 방향키 누르고 있는 중이면 이동
        if(movingLeft && !movingRight){ // 왼쪽 
            myposX -= movingSpeed;
            if(myposX < 0 + (meRect.width/2)){ //왼쪽 벽에 닿으면 멈춤
                myposX += movingSpeed;
            }
        }else if(!movingLeft && movingRight){ // 오른쪽 네트에 닿으면 멈춤
            myposX += movingSpeed;
            if(myposX > ((gameCanvasContainer.clientWidth/2) - (meRect.width/2))){
                myposX -= movingSpeed;
            }
        }
        player1.style.left = `${myposX}px`;
    }
    //내 상하위치
    if(isJumping){
        jumpVelocityY += jumpingGravity;
        myposY += jumpVelocityY

        if(myposY > (gameCanvasContainer.clientHeight) - (meRect.height/2)){ //착지하면 초기화
            myposY -= jumpVelocityY;
            isJumping = false;
            jumpVelocityY = -4;
        }
        
        player1.style.top = `${myposY}px`;
    }


    //적 좌우위치(시작하면 좌우로 반복이동)
    if(isEnemySideMoving){
        if(EnemySideMovingDir === 0){ // 왼쪽으로 이동중
            enemyposX -= enemyMovingSpeed;
            if(enemyposX < (gameCanvasContainer.clientWidth/2) + (enemyRect.width/2)){ //왼쪽 네트에 닿으면 반대방향으로 이동
                enemyposX += enemyMovingSpeed;
                EnemySideMovingDir = 1;
            }
        }else if(EnemySideMovingDir === 1){ // 오른쪽으로 이동중
            enemyposX += enemyMovingSpeed;
            if(enemyposX > ((gameCanvasContainer.clientWidth) - (enemyRect.width/2))){ // 오른쪽 벽에 닿으면 반대방향으로 이동
                enemyposX -= enemyMovingSpeed;
                EnemySideMovingDir = 0;
            }
    
        }
        player2.style.left = `${enemyposX}px`;
    }


    //충돌여부감지
    if(isCollisionCheck(posX, posY, myposX, myposY)){ // 내가 충돌했으면
        if(isPressHitting){ // 공격버튼 눌렀으면 
            velocityX = 8;
            velocityY = 8;
        }else{
            switch (ballWithPlayerCollisionDir){
                case 0:
                    velocityY *= -1;
                    posY += velocityY;
                    break;
                case 1:
                    if(velocityX<0){
                        if(leftBallrightPlayer){
                            velocityX = velocityX - 1;
                            velocityY *= -1;
                        }else{
                            velocityX *= -1;
                            velocityY *= -1;
                        }
                    }else{
                        if(leftBallrightPlayer){
                            velocityX *= -1;
                            velocityY *= -1;
                        }else{
                            velocityX = velocityX + 1;
                            velocityY *= -1;
                        }
                    }
                    posX += velocityX;
                    posY += velocityY;
                    break;
                case 2:
                    if(velocityX<0){
                        if(leftBallrightPlayer){
                            velocityX = velocityX - 2;
                            velocityY *= -1;
                        }else{
                            velocityX *= -1;
                            velocityY *= -1;
                        }
                    }else{
                        if(leftBallrightPlayer){
                            velocityX *= -1;
                            velocityY *= -1;
                        }else{
                            velocityX = velocityX + 2;
                            velocityY *= -1;
                        }
                    }
                    posX += velocityX;
                    posY += velocityY;
                    break;
                case 3:
                    if(velocityX<0){
                        if(leftBallrightPlayer){
                            velocityX = velocityX - 1;
                            velocityY *= -1;
                        }else{
                            velocityX *= -1;
                            velocityY *= -1;
                        }
                    }else{
                        if(leftBallrightPlayer){
                            velocityX *= -1;
                            velocityY *= -1;
                        }else{
                            velocityX = velocityX + 1;
                            velocityY *= -1;
                        }
                    }
                    posX += velocityX;
                    posY += velocityY;
                    break;
                case 4:
                    velocityX *= -1;
                    posX += velocityX;
                    break;
            }
        }
        
    }else if(isCollisionCheck(posX, posY, enemyposX, enemyposY)){ // 상대가 충돌했으면
        switch (ballWithPlayerCollisionDir){
            case 0:
                velocityY *= -1;
                posY += velocityY;
                break;
            case 1:
                if(velocityX<0){
                    if(leftBallrightPlayer){
                        velocityX = velocityX - 1;
                        velocityY *= -1;
                    }else{
                        velocityX *= -1;
                        velocityY *= -1;
                    }
                }else{
                    if(leftBallrightPlayer){
                        velocityX *= -1;
                        velocityY *= -1;
                    }else{
                        velocityX = velocityX + 1;
                        velocityY *= -1;
                    }
                }
                posX += velocityX;
                posY += velocityY;
                break;
            case 2:
                if(velocityX<0){
                    if(leftBallrightPlayer){
                        velocityX = velocityX - 2;
                        velocityY *= -1;
                    }else{
                        velocityX *= -1;
                        velocityY *= -1;
                    }
                }else{
                    if(leftBallrightPlayer){
                        velocityX *= -1;
                        velocityY *= -1;
                    }else{
                        velocityX = velocityX + 2;
                        velocityY *= -1;
                    }
                }
                posX += velocityX;
                posY += velocityY;
                break;
            case 3:
                if(velocityX<0){
                    if(leftBallrightPlayer){
                        velocityX = velocityX - 1;
                        velocityY *= -1;
                    }else{
                        velocityX *= -1;
                        velocityY *= -1;
                    }
                }else{
                    if(leftBallrightPlayer){
                        velocityX *= -1;
                        velocityY *= -1;
                    }else{
                        velocityX = velocityX + 1;
                        velocityY *= -1;
                    }
                }
                posX += velocityX;
                posY += velocityY;
                break;
            case 4:
                velocityX *= -1;
                posX += velocityX;
                break;
        }
    }

    ball.style.left = `${posX}px`;
    ball.style.top = `${posY}px`;

    previous_posX = posX;
    previous_posY = posY;

    requestAni = requestAnimationFrame(moveBall);
}

//moveBall();



// -----------------좌우이동 및 점프 관련 함수
function startSideMoving(dir) {
    direction = dir;
    isSideMoving = true;
    switch (direction){
        case 'left':
            movingLeft = true;
            break;
        case 'right':
            movingRight = true;
            break;
        }
        
}
function stopSideMoving() {
    isSideMoving = false;
    movingLeft = false;
    movingRight = false; 
}

function startJumpMoving() {
    isJumping = true;
}


//------------------------공격 관련 함수
function powerHitting() {
    if(!isPressHitting){
        isPressHitting = true;
        player1.setAttribute('src', 'images/powerhitting.png');
        setTimeout(function(){
            isPressHitting = false;
            player1.setAttribute('src', 'images/walking_volley.gif');
            },500);
    }
    
}

function isBoomCheck() {
    if (isBoom){
        ball.setAttribute('src', 'images/ball.gif');
        isBoom = false;
    }else{
        ball.setAttribute('src', 'images/ball_end.png');
        isBoom = true;
    }
    
}


// 공과 player 충돌
function isCollisionCheck(posX, posY, myposX, myposY) {
    let diffX = Math.abs(posX - myposX);
    if (diffX <= meRect.width/2) {
      let diffY = Math.abs(posY - myposY);
      if (diffY <= meRect.height/2) {
        if(myposX - posX > 0){
            leftBallrightPlayer = true; // 충돌 시 공이 왼쪽에서 맞았는가 
        }else{
            leftBallrightPlayer = false;
        }
        if(diffX < diffY){ // 위에서 맞은경우
            ballWithPlayerCollisionDir = 0; // 직각
            if(diffX > meRect.width/6){
                ballWithPlayerCollisionDir = 1; // 60도 방향
                if(diffX > meRect.width/3){
                    ballWithPlayerCollisionDir = 2; // 45도 방향
                }
            } 
        }else{ // 옆에서 맞은경우
            ballWithPlayerCollisionDir = 4; // 0도 방향
            if(diffY > meRect.height/6){
                ballWithPlayerCollisionDir = 3; // 30도 방향
                if(diffY > meRect.height/3){
                    ballWithPlayerCollisionDir = 2; // 45도 방향
                }
            }
        }
        return true;
      }
    }
    return false;
  }

function roundResultCheck(){
    if(posX < (gameCanvasContainer.clientWidth)/2){ // 내 네트에 떨어지면
        enemyPresentScore += 1;
        PresentRound += 1;
        enemyscore.textContent = `${enemyPresentScore}`;
    }else{ // 상대 네트에 떨어지면
        myPresentScore += 1;
        PresentRound += 1;
        myscore.textContent = `${myPresentScore}`; 
    }
    if(myPresentScore >= 15){
        gameFinish = true;
        blackmssk.style.display = 'block';
        win.style.display = 'block';
    }else if(enemyPresentScore >= 15){
        gameFinish = true;
        blackmssk.style.display = 'block';
        gameover.style.display = 'block';
    }
    round.textContent = `Round ${PresentRound}`;
}

function clearPosition(){
    posX = 50;
    posY = beachRect.height * 0.2; 
    myposX = (meRect.width/2);
    myposY = beachRect.height - (meRect.height/2);
    enemyposX = beachRect.width - (enemyRect.width/2);
    enemyposY = beachRect.height - (enemyRect.height/2);
    velocityX = 4;
    velocityY = 4;

    ball.style.left = `${posX}px`;
    ball.style.top = `${posY}px`;
    player1.style.left = `${myposX}px`;
    player1.style.top = myposY + 'px';
    player2.style.left = `${enemyposX}px`;
    player2.style.top = enemyposY + 'px';

    isJumping = false;
    jumpVelocityY = -4;
}

blackmssk.addEventListener('touchstart', () => {
    if(gameFinish){
        restart();
    }else{
        // 첫 터치에 마스킹 지우기
        blackmssk.style.display = 'none';
        waiting_volleyball.style.display = 'none';
        clearPosition();
        readygo.setAttribute('src', 'images/readygo.gif');
        readygo.style.display = 'block';
        setTimeout(function(){
            readygo.style.display = 'none';
            },1300);
        setTimeout(moveBall, 1400);
    }

});

gameCanvasContainer.addEventListener('touchstart', () => {
    if(roundFinish){
        //위치 초기화
        roundFinish = false;
        clearPosition();
        isBoomCheck();
        readygo.setAttribute('src', '');
        readygo.setAttribute('src', 'images/readygo.gif');
        readygo.style.display = 'block';
        setTimeout(function(){
            readygo.style.display = 'none';
            },1300);
        setTimeout(moveBall, 1400);
    }
})


function restart() {
    clearPosition();
    blackmssk.style.display = 'block';
    waiting_volleyball.style.display = 'block';
    gameover.style.display = 'none';
    win.style.display = 'none';
    readygo.setAttribute('src', '');
    readygo.style.display = 'none';
    gameFinish = false;
    myPresentScore = 0;
    enemyPresentScore = 0;
    PresentRound = 1;
    myscore.textContent = `${myPresentScore}`;
    enemyscore.textContent = `${enemyPresentScore}`;
    round.textContent = `Round ${PresentRound}`;
    }

bt_up.addEventListener('mousedown', startJumpMoving);
//bt_down.addEventListener('touchstart', () => {startSideMoving('down')});
bt_down.addEventListener('touchstart', (e) => {
    e.preventDefault();    
});
//bt_down.addEventListener('touchend', stopSideMoving);
bt_left.addEventListener('touchstart', () => {startSideMoving('left')});
bt_left.addEventListener('touchend', stopSideMoving);
bt_right.addEventListener('touchstart', () => {startSideMoving('right')});
bt_right.addEventListener('touchend', stopSideMoving);
bt_spacebar.addEventListener('mousedown',powerHitting);