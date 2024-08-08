

//마스킹
const blackmssk = document.getElementById('blackmask');
const countdown = document.getElementById('countdown');
const gameover = document.getElementById('gameover');
const waiting_krun = document.getElementById('waiting_krun');

//배경
const touchAreaBanner = document.getElementById('banner3');
const mainContainer = document.getElementById('main_container');
const mainRect = mainContainer.getBoundingClientRect();
var bg_river = document.getElementById('bg_river_id');
const riverRect = bg_river.getBoundingClientRect();
var bg_road = document.getElementById('bg_road_id');
const roadRect = bg_road.getBoundingClientRect();
const difficulty = document.getElementById('difficulty');
const current_distance = document.getElementById('distance');
const high_distance = document.getElementById('high_distance');

//오브젝트
const running_tiger = document.getElementById('running_tiger');
const tigerRect = running_tiger.getBoundingClientRect();
const moving_hurdle1 = document.getElementById('moving_hurdle1'); // 허들
const moving_hurdle2 = document.getElementById('moving_hurdle2'); // 허들
const moving_hurdle3 = document.getElementById('moving_hurdle3'); // 돌
const moving_hurdle4 = document.getElementById('moving_hurdle4'); // 자전거
const moving_hurdle5 = document.getElementById('moving_hurdle5'); // 새(랜덤발생)
let isBird = false; // 랜덤으로 새가 발생하는 주기 결정
let min = 0.2 * mainRect.width;
let max = 0.8 * mainRect.width;
let randomBirdDistance = Math.random() * (max - min) + min;


//버튼
const restart_bt = document.getElementById('restart_bt');

//애니메이션
let requestAni;
let riverCount = 0;
let riverSpeed = 1; // 강 흐르는 속도
let roadCount = 0;
let hurdle1IntervalCount = 0; // 난도 설정을 위해 장애물이 반복된 횟수 체크
let hurdle2IntervalCount = 0;
let hurdle3IntervalCount = 0;
let hurdle4IntervalCount = 0;
let hurdle5IntervalCount = 0;

let roadSpeed = 3; // 도로 움직이는 속도


let hurdlePositionX = mainRect.width + (moving_hurdle1.width)/2;
moving_hurdle1.style.left = hurdlePositionX + 'px';
let hurdlePositionY = mainRect.height - (mainRect.height*0.05) - (moving_hurdle1.height)/2;
moving_hurdle1.style.top = hurdlePositionY + 'px';
let hurdlePosition2X = (mainRect.width * 1.5)  + (moving_hurdle1.width)/2;
moving_hurdle2.style.left = hurdlePosition2X + 'px';
let hurdlePosition2Y = mainRect.height - (mainRect.height*0.05) - (moving_hurdle2.height)/2;
moving_hurdle2.style.top = hurdlePosition2Y + 'px';
let hurdlePosition3X = (mainRect.width * 1.5)  + (moving_hurdle3.width)/2;
moving_hurdle3.style.left = hurdlePosition3X + 'px';
let hurdlePosition3Y = mainRect.height - (mainRect.height*0.06) - (moving_hurdle3.height)/2;
moving_hurdle3.style.top = hurdlePosition3Y + 'px';
let hurdlePosition4X = (mainRect.width * 1.5) + (moving_hurdle4.width)/2;
moving_hurdle4.style.left = hurdlePosition4X + 'px';
let hurdlePosition4Y = mainRect.height - (mainRect.height*0.10) - (moving_hurdle4.height)/2;
moving_hurdle4.style.top = hurdlePosition4Y + 'px';
let hurdlePosition5X = mainRect.width + (moving_hurdle5.width)/2 + randomBirdDistance;
moving_hurdle5.style.left = hurdlePosition5X + 'px';
let hurdlePosition5Y = mainRect.height - (mainRect.height*0.5) - (moving_hurdle4.height)/2;
moving_hurdle5.style.top = hurdlePosition5Y + 'px';


//백호돌이 세팅
let myposX = (running_tiger.width)/2 + 50; //첫위치
running_tiger.style.left = myposX + 'px';
let myposY = mainRect.height - (mainRect.height*0.11) - (running_tiger.height)/2;
running_tiger.style.top = myposY + 'px';
let groundStandard = myposY; // 땅에 닿았음을 판단하는 기준
let isJumping = false; // 점프 여부
let isDoubleJumping = false; // 더블점프 여부
let jumpVelocityY = -8; //점프 시 한번에 이동하는 픽셀 크기(점프 속도 결정)
let jumpingGravity = 0.4; // 점프 중력

// 거리 세팅
let highDistance = 0;
let distanceStandard = 0;
let currentDistance = 0.0;
let gameDifficulty = 1;

let touchCount = 0;
let game_finish = 0;



//-------------------------------------------------------------


function gameStart() {

    // 배경 움직이기
    bg_river.style.left = `-${riverCount}px`;
    bg_road.style.left = `-${roadCount}px`;
    if(riverCount >= bg_river.offsetWidth/2 - riverSpeed){
        riverCount = riverCount - (bg_river.offsetWidth/2 - riverSpeed);
    }else{
        riverCount += riverSpeed;
    }
    if(roadCount >= bg_road.offsetWidth/2 - roadSpeed){
        roadCount = roadCount - (bg_road.offsetWidth/2 - roadSpeed);
    }else{
        roadCount += roadSpeed;
    }

    // 장애물 움직이기 & 충돌 감지

    if(gameDifficulty === 1){
        moving_hurdle1.style.left = `${hurdlePositionX}px`;
        if(hurdlePositionX <= 0 - (moving_hurdle1.width/2)){
            hurdle1IntervalCount += 1 ;
            hurdlePositionX = mainRect.width + (moving_hurdle1.width)/2;
        }else{
            hurdlePositionX -= roadSpeed;
        }
        if(isCollisionCheck(hurdlePositionX, hurdlePositionY, myposX, myposY)){return};
    }else if(gameDifficulty === 2){
        moving_hurdle1.style.left = `${hurdlePositionX}px`;
        if(hurdlePositionX <= 0 - (moving_hurdle1.width/2)){
            hurdle1IntervalCount += 1 ;
            hurdlePositionX = mainRect.width + (moving_hurdle1.width)/2;
        }else{
            hurdlePositionX -= roadSpeed;
        }
        moving_hurdle2.style.left = `${hurdlePosition2X}px`;
        if(hurdlePosition2X <= 0 - (moving_hurdle2.width/2)){
            hurdle2IntervalCount += 1 ;
            hurdlePosition2X = mainRect.width + (moving_hurdle2.width)/2;
        }else{
            hurdlePosition2X -= roadSpeed;
        }
        if(isCollisionCheck(hurdlePositionX, hurdlePositionY, myposX, myposY)){return};
        if(isCollisionCheck(hurdlePosition2X, hurdlePosition2Y, myposX, myposY)){return};
    }else if(gameDifficulty === 3){
        roadSpeed = 4;
        if(hurdlePositionX <= 0 - (moving_hurdle1.width/2)){
            hurdle1IntervalCount += 1 ;
            moving_hurdle1.style.display = 'none';   
            hurdlePositionX = (mainRect.width * 1.5) + (moving_hurdle1.width)/2;
        }else if($(moving_hurdle1).css('display') != 'none'){
            moving_hurdle1.style.left = `${hurdlePositionX}px`;
            hurdlePositionX -= roadSpeed;
        }
        if(hurdlePosition2X <= 0 - (moving_hurdle2.width/2)){
            moving_hurdle2.style.display = 'none'
        }else{
            moving_hurdle2.style.left = `${hurdlePosition2X}px`;
            hurdlePosition2X -= roadSpeed;
        }
        moving_hurdle3.style.left = `${hurdlePosition3X}px`;
        if(hurdlePosition3X <= 0 - (moving_hurdle3.width/2)){
            hurdle3IntervalCount += 1 ;
            hurdlePosition3X = mainRect.width + (moving_hurdle3.width)/2;
        }else{
            hurdlePosition3X -= roadSpeed;
        }
        if(isCollisionCheck(hurdlePosition3X, hurdlePosition3Y, myposX, myposY)){return};
    }else if(gameDifficulty === 4){
        moving_hurdle1.style.left = `${hurdlePositionX}px`;
        moving_hurdle1.style.display = 'block'; 
        if(hurdlePositionX <= 0 - (moving_hurdle1.width/2)){
            hurdle1IntervalCount += 1 ;
            hurdlePositionX = mainRect.width + (moving_hurdle1.width)/2;
        }else{
            hurdlePositionX -= roadSpeed;
        }
        if(isCollisionCheck(hurdlePositionX, hurdlePositionY, myposX, myposY)){return};
        moving_hurdle3.style.left = `${hurdlePosition3X}px`;
        if(hurdlePosition3X <= 0 - (moving_hurdle3.width/2)){
            hurdle3IntervalCount += 1 ;
            hurdlePosition3X = mainRect.width + (moving_hurdle3.width)/2;
        }else{
            hurdlePosition3X -= roadSpeed;
        }
        if(isCollisionCheck(hurdlePosition3X, hurdlePosition3Y, myposX, myposY)){return};
    }else if(gameDifficulty === 5){
        if(hurdlePositionX <= 0 - (moving_hurdle1.width/2)){
            hurdle1IntervalCount += 1 ;
            moving_hurdle1.style.display = 'none';   
            hurdlePositionX = mainRect.width + (moving_hurdle1.width)/2;
        }else{
            moving_hurdle1.style.left = `${hurdlePositionX}px`;
            hurdlePositionX -= roadSpeed;
        }
        if(hurdlePosition3X <= 0 - (moving_hurdle3.width/2)){
            hurdle3IntervalCount += 1 ;
            moving_hurdle3.style.display = 'none'
        }else if(($(moving_hurdle3).css('display') != 'none')){
            moving_hurdle3.style.left = `${hurdlePosition3X}px`;
            hurdlePosition3X -= roadSpeed;
        }
        moving_hurdle4.style.left = `${hurdlePosition4X}px`;
        if(hurdlePosition4X <= 0 - (moving_hurdle4.width/2)){
            hurdle4IntervalCount += 1 ;
            hurdlePosition4X = mainRect.width + (moving_hurdle4.width)/2;
        }else{
            hurdlePosition4X -= roadSpeed;
        }
        if(isCollisionCheck(hurdlePosition4X, hurdlePosition4Y, myposX, myposY)){return};
    }else if(gameDifficulty === 6){
        if(isBird){
            if(hurdlePosition5X <= 0 - (moving_hurdle5.width/2)){
                hurdlePosition5X = mainRect.width + (moving_hurdle5.width)/2;
            }else{
                hurdlePosition5X -= (roadSpeed+1);
            }
            moving_hurdle5.style.left = `${hurdlePosition5X}px`;
            if(isCollisionCheck(hurdlePosition5X, hurdlePosition5Y, myposX, myposY)){return};
        }else{
            randomBirdDistance = Math.random() * (max - min) + min;
            hurdlePosition5X = mainRect.width + (moving_hurdle5.width)/2 + randomBirdDistance;
            isBird = true;
        }
       moving_hurdle4.style.left = `${hurdlePosition4X}px`;
        if(hurdlePosition4X <= 0 - (moving_hurdle4.width/2)){
            hurdlePosition4X = mainRect.width + (moving_hurdle4.width)/2;
        }else{
            hurdlePosition4X -= roadSpeed;
        }
        if(isCollisionCheck(hurdlePosition4X, hurdlePosition4Y, myposX, myposY)){return};
    }
    else if(gameDifficulty === 7){
        roadSpeed = 5;
        if(isBird){
            if(hurdlePosition5X <= 0 - (moving_hurdle5.width/2)){
                hurdlePosition5X = mainRect.width + (moving_hurdle5.width)/2;
            }else{
                hurdlePosition5X -= (roadSpeed+1);
            }
            moving_hurdle5.style.left = `${hurdlePosition5X}px`;
            if(isCollisionCheck(hurdlePosition5X, hurdlePosition5Y, myposX, myposY)){return};
        }else{
            randomBirdDistance = Math.random() * (max - min) + min;
            hurdlePosition5X = mainRect.width + (moving_hurdle5.width)/2 + randomBirdDistance;
            isBird = true;
        }
       moving_hurdle4.style.left = `${hurdlePosition4X}px`;
        if(hurdlePosition4X <= 0 - (moving_hurdle4.width/2)){
            hurdlePosition4X = mainRect.width + (moving_hurdle4.width)/2;
        }else{
            hurdlePosition4X -= roadSpeed;
        }
        if(isCollisionCheck(hurdlePosition4X, hurdlePosition4Y, myposX, myposY)){return};
    }

    // 점프 & 더블점프
    if(isJumping){
        jumpVelocityY += jumpingGravity;
        myposY += jumpVelocityY
        if(myposY > groundStandard){ //착지하면 초기화
            myposY -= jumpVelocityY;
            isJumping = false;
            isDoubleJumping = false;
            jumpVelocityY = -8;
        }
        running_tiger.style.top = `${myposY}px`;
    }

    // 이동거리 증가
    distanceStandard += 1;
    currentDistance = Math.round((distanceStandard/100)*10)/10;
    current_distance.textContent = `${currentDistance} m`;

    // 거리별 난도 설정
    if(3 <= hurdle1IntervalCount && hurdle1IntervalCount < 6){
        gameDifficulty = 2;
        difficulty.textContent = `${gameDifficulty}단계`;
    }else if(6 <= hurdle1IntervalCount && hurdle3IntervalCount < 3){
        gameDifficulty = 3;
        difficulty.textContent = `${gameDifficulty}단계`;
    }else if(3 <= hurdle3IntervalCount && hurdle3IntervalCount < 7){
        gameDifficulty = 4;
        difficulty.textContent = `${gameDifficulty}단계`;
    }else if(7 <= hurdle3IntervalCount && hurdle4IntervalCount < 3){
        gameDifficulty = 5;
        difficulty.textContent = `${gameDifficulty}단계`;
    }else if(3 <= hurdle4IntervalCount && hurdle4IntervalCount < 6){
        gameDifficulty = 6;
        difficulty.textContent = `${gameDifficulty}단계`;
    }else if(6 <= hurdle4IntervalCount){
        gameDifficulty = 7;
        difficulty.textContent = `${gameDifficulty}단계`;
    }


    requestAni = requestAnimationFrame(gameStart);
}

//점프관련 함수
function startJumpMoving() {
    if(isJumping){
        if(!isDoubleJumping){
            isDoubleJumping = true;
            jumpVelocityY = -8;
            jumpVelocityY += jumpingGravity;
            myposY += jumpVelocityY
        }
    }else{
        isJumping = true;
        isDoubleJumping = false;
    }
}


// 충돌감지 함수
function isCollisionCheck(hurdlePositionX, hurdlePositionY, myposX, myposY) {
    let diffX = Math.abs(hurdlePositionX - myposX);
    if (diffX <= tigerRect.width/4) {
      let diffY = Math.abs(hurdlePositionY - myposY);
      if (diffY <= tigerRect.height/2) {
        //초기화
        blackmssk.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        blackmssk.style.display = 'block';
        gameover.style.display = 'block';
        countdown.setAttribute('src', '');
        game_finish = 1;
        touchCount = 0;
        if(highDistance < currentDistance){
            highDistance = currentDistance;
            high_distance.textContent = `${highDistance} m`;
        }
        currentDistance = 0.0;
        return true;
      }
    }
    return false;
  }


blackmssk.addEventListener('touchstart', (e) => {
    if(touchCount === 0){
        if(game_finish === 1){
            restart();
        }else{
            // 첫 터치에 마스킹 지우기
            blackmssk.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            countdown.setAttribute('src', 'images/countdown.gif');
            countdown.style.display = 'block';
            waiting_krun.style.display = 'none';
            gameover.style.display = 'none';
            current_distance.textContent = `0 m`;
                
            // 4초(카운트다운) 경과 후 아래함수 시작
            setTimeout(function(){
            countdown.style.display = 'none';
            blackmssk.style.display = 'none';
            gameStart()
            },4000);
            touchCount++; 
        }
    }
    e.preventDefault();
});

restart_bt.addEventListener('touchstart', (e) => {
    cancelAnimationFrame(requestAni);
    restart();
    e.preventDefault();
});

function restart() {
    //초기화
    blackmssk.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    blackmssk.style.display = 'block';
    waiting_krun.style.display = 'block';
    gameover.style.display = 'none';
    countdown.setAttribute('src', '');
    currentDistance = 0.0;
    gameDifficulty = 1;
    game_finish = 0;
    touchCount = 0;
    isJumping = false;
    isDoubleJumping = false;
    jumpVelocityY = -8;
    current_distance.textContent = `0 m`;
    difficulty.textContent = '1단계';
    moving_hurdle1.style.display = 'block';
    moving_hurdle2.style.display = 'block';
    moving_hurdle3.style.display = 'block';
    isBird = false;
    roadSpeed = 3; // 도로 움직이는 속도
    riverCount = 0;
    roadCount = 0;
    distanceStandard = 0;
    hurdle1IntervalCount = 0; // 난도 설정을 위해 장애물이 반복된 횟수 체크
    hurdle2IntervalCount = 0;
    hurdle3IntervalCount = 0;
    hurdle4IntervalCount = 0;
    hurdle5IntervalCount = 0;

    hurdlePositionX = mainRect.width + (moving_hurdle1.width)/2;
    moving_hurdle1.style.left = hurdlePositionX + 'px';
    hurdlePositionY = mainRect.height - (mainRect.height*0.05) - (moving_hurdle1.height)/2;
    moving_hurdle1.style.top = hurdlePositionY + 'px';
    hurdlePosition2X = (mainRect.width * 1.5)  + (moving_hurdle1.width)/2;
    moving_hurdle2.style.left = hurdlePosition2X + 'px';
    hurdlePosition2Y = mainRect.height - (mainRect.height*0.05) - (moving_hurdle2.height)/2;
    moving_hurdle2.style.top = hurdlePosition2Y + 'px';
    hurdlePosition3X = (mainRect.width * 1.5)  + (moving_hurdle3.width)/2;
    moving_hurdle3.style.left = hurdlePosition3X + 'px';
    hurdlePosition3Y = mainRect.height - (mainRect.height*0.06) - (moving_hurdle3.height)/2;
    moving_hurdle3.style.top = hurdlePosition3Y + 'px';
    hurdlePosition4X = (mainRect.width * 1.5) + (moving_hurdle4.width)/2;
    moving_hurdle4.style.left = hurdlePosition4X + 'px';
    hurdlePosition4Y = mainRect.height - (mainRect.height*0.10) - (moving_hurdle4.height)/2;
    moving_hurdle4.style.top = hurdlePosition4Y + 'px';
    hurdlePosition5X = mainRect.width + (moving_hurdle5.width)/2 + randomBirdDistance;
    moving_hurdle5.style.left = hurdlePosition5X + 'px';
    hurdlePosition5Y = mainRect.height - (mainRect.height*0.4) - (moving_hurdle4.height)/2;
    moving_hurdle5.style.top = hurdlePosition5Y + 'px';

    myposX = (running_tiger.width)/2 + 50; //첫위치
    running_tiger.style.left = myposX + 'px';
    myposY = mainRect.height - (mainRect.height*0.11) - (running_tiger.height)/2;
    running_tiger.style.top = myposY + 'px';
    running_tiger.style.left = `${myposX}px`
    running_tiger.style.top = `${myposY}px`

    bg_river.style.left = `-${riverCount}px`;
    bg_road.style.left = `-${roadCount}px`;
    
    moving_hurdle1.style.left = `${hurdlePositionX}px`;
    moving_hurdle2.style.left = `${hurdlePosition2X}px`;
    moving_hurdle3.style.left = `${hurdlePosition3X}px`;
    moving_hurdle4.style.left = `${hurdlePosition4X}px`;
    moving_hurdle5.style.left = `${hurdlePosition5X}px`;
}



