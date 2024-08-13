//배경
const blackmask = document.getElementById('blackmask');
const waiting_fencing = document.getElementById('waiting_fencing');
const gameover = document.getElementById('gameover');
const win = document.getElementById('win');
const stage = document.getElementById('stage');
const mainRect = stage.getBoundingClientRect();
const retry = document.getElementById('retry');


//캐릭터세팅
const me = document.getElementById('me');
const enemy = document.getElementById('enemy');
let myposX = (me.width)/2; //내 첫위치
me.style.left = myposX + 'px';
let myposY = (mainRect.height * 0.8);
me.style.top = myposY + 'px';
let enemyposX = mainRect.width - (enemy.width/2); //상대 첫위치
enemy.style.left = enemyposX + 'px';
let enemyposY = (mainRect.height * 0.8);
enemy.style.top = enemyposY + 'px';

//하이라이트(캐릭터 중심좌표 확인용)
/*
let me_temp = document.getElementById('me_temp');
let enemy_temp = document.getElementById('enemy_temp');
me_temp.style.left = myposX + 'px';
me_temp.style.top = myposY + 'px';
enemy_temp.style.left = enemyposX + 'px';
enemy_temp.style.top = enemyposY + 'px';

me_temp.style.left = myposX + 'px';
me_temp.style.top = myposY + 'px';
enemy_temp.style.left = enemyposX + 'px';
enemy_temp.style.top = enemyposY + 'px';
*/

//액션 관련 세팅(공격, 이동 및 속도 등)
let isSideMoving = false; // 좌우이동 여부
let movingLeft = false;
let movingRight = false;
let isEnemySideMoving = false; // 상대방 좌우이동 여부
let enemymovingLeft = false;
let enemymovingRight = false;
let movingSpeed = 1.5; // 이동속도
let isPressHitting = false; //스페이스바 누름여부
let attackAttempt = false; // 나&상대방 공격 시도 여부
let isMyAttack = false; // 나의 공격
let isEnemyAttack = false; // 상대방의 공격
let isMyDamaged = false;
let isEnemyDamaged = false;
let isMyDefense = false;
let isEnemyDefense = false;
let ourMaxDistance = enemyposX - myposX;
let enemyAction = null;
let groundStandard = myposY; // 땅에 닿았음을 판단하는 기준
let isJumping = false; // 점프 여부
let isEnemyJumping = false;
let jumpVelocityY = -8; //점프 시 한번에 이동하는 픽셀 크기(점프 속도 결정)
let jumpEnemyVelocityY = -8;
let jumpingGravity = 0.4; // 점프 중력
let isShockwaveDown = false;
let isShockwaveRight = false;
let isShockwaveAction = false;
let isShockwaveEmitting = false;
const shockwave = document.getElementById('shockwave');
let shockwaveSpeed = 2.5;
shockwave.style.left = myposX;
shockwave.style.top = myposY;
let waveX = myposX;
let waveY = myposY;


//체력
const myHealthBar = document.getElementById('myHealthBar');
const enemyHealthBar = document.getElementById('enemyHealthBar');
let myHealth = 100;
let enemyHealth = 100;

//애니메이션 세팅
let requestAni;
let timeID = null;
let remainingTime = document.getElementById('remainingTime');
let second = 59; //남은시간(초)
let game_finish = false;
let touchCount = 0;

//방향키 세팅(조이스틱)
const joystickContainer = document.getElementById('joystick_container');
const joystick = document.getElementById('joystick');
const rect = joystickContainer.getBoundingClientRect();
const maxX = rect.width - joystick.offsetWidth/2;
const maxY = rect.height - joystick.offsetHeight/2;
let centerX = rect.width/2;
let centerY = rect.height/2;
let isDragging = false; 

    


//---------------------------------------------------------------
/*
    // 이미지 Preload
    const images = [
        "../../images/enemy.gif",
        "../../images/enemy_attack_action.png",
        "../../images/enemy_defense_action.png",
        "../../images/enemy_damaged_action.png",
        "../../images/me.gif",
        "../../images/me_attack_action.png",
        "../../images/me_defense_action.png",
        "../../images/me_damaged_action.png"
    ];
    const preload = (images) => {
        images.forEach((image) => {
            const img = new Image();
            img.src = image;
        });
    };
    preload(images);
*/


//이미지 Preload
document.addEventListener("DOMContentLoaded", function() {
    var images = document.images;
    var totalImages = images.length;
    var loadedImages = 0;
    function imageLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
            restart();
        }
    }
    for (var i = 0; i < totalImages; i++) {
        if (images[i].complete) {
            imageLoaded();
        } else {
            images[i].addEventListener('load', imageLoaded);
            images[i].addEventListener('error', imageLoaded);
        }
    }
});

// 페이지가 처음 로드되었을 때만 새로고침을 하기 위한 플래그 설정
if (!localStorage.getItem('firstLoad')) {
    localStorage.setItem('firstLoad', 'true');
    window.location.reload();
    console.log('reload');
} else {
    localStorage.removeItem('firstLoad');
}

//--------------------------------------------------------------

function gameStart() {
    //내 좌우위치
    if(isSideMoving){ // 좌우 방향키 누르고 있는 중이면 이동
        if(movingLeft && !movingRight){ // 왼쪽 
            myposX -= movingSpeed;
            if(myposX < 0 + (me.width/2)){ //왼쪽 벽에 닿으면 멈춤
                myposX += movingSpeed;
            }
        }else if(!movingLeft && movingRight){ 
            myposX += movingSpeed;
            if(myposX > enemyposX){ // 오른쪽 상대에게 닿으면 닿으면 멈춤
                myposX -= movingSpeed;
            }
        }
        me.style.left = `${myposX}px`;
    }

    //내 상하위치
    if(isJumping){
        jumpVelocityY += jumpingGravity;
        myposY += jumpVelocityY

        if(myposY > groundStandard){ //착지하면 초기화
            myposY -= jumpVelocityY;
            isJumping = false;
            jumpVelocityY = -8;
        }
        
        me.style.top = `${myposY}px`;
    }
    //상대방 좌우위치
    if(isEnemySideMoving){ // 좌우 방향키 누르고 있는 중이면 이동
        if(enemymovingLeft){ // 왼쪽 
            enemyposX -= movingSpeed;
            if(myposX > enemyposX){ //왼쪽 나에게 닿으면 멈춤
                enemyposX += movingSpeed;
            }
        }else if(enemymovingRight){ 
            enemyposX += movingSpeed;
            if(enemyposX > mainRect.width - (enemy.width/2)){ // 오른쪽 벽에게 닿으면 닿으면 멈춤
                enemyposX -= movingSpeed;
            }
        }
        enemy.style.left = `${enemyposX}px`;
    }
    //상대방 상하위치
    if(isEnemyJumping){
        jumpEnemyVelocityY += jumpingGravity;
        enemyposY += jumpEnemyVelocityY

        if(enemyposY > groundStandard){ //착지하면 초기화
            enemyposY -= jumpEnemyVelocityY;
            isEnemyJumping = false;
            jumpEnemyVelocityY = -8;
        }
        
        enemy.style.top = `${enemyposY}px`;
    }

    //에너지파 위치
    if(isShockwaveEmitting){
        waveX += shockwaveSpeed; 
        shockwave.style.left = `${waveX}px`;
    }

    
    //공격 성공여부 판단
    if(attackAttempt){ //누군가 공격시도중이면
        if(isCollisionCheck(myposX, myposY, enemyposX, enemyposY)){ //충돌여부 검사
            if(isMyAttack){ //내가 공격중이었으면
                if(Math.random()<=0.45){isEnemyDefense=true;} // 상대는 45%의 확률로 방어
                if(isEnemyDefense){ //상대방의 방어여부 검사
                    isMyAttack = false;
                    isDefense('enemy');
                }else{
                    isMyAttack = false;
                    isDamaged('enemy');
                }
            }else if(isEnemyAttack){ //상대방이 공격중이었으면
                if(isSideMoving && movingLeft){isMyDefense = true;} // 상대가 공격할때 내가 뒤로 이동중이었으면 방어
                if(isMyDefense){ //나의 방어여부 검사
                    isEnemyAttack = false;
                    isDefense('me');
                }else{
                    isEnemyAttack = false;
                    isDamaged('me');
                }

            }
        }
    }
    //에너지파 공격성공여부 판단
    if(isShockwaveEmitting){
        if(isWaveCollisionCheck(waveX, waveY, enemyposX, enemyposY)){
            if(Math.random()<=0.85){isEnemyDefense=true;} // 상대는 85%의 확률로 방어
            if(isEnemyDefense){ //상대방의 방어여부 검사
                isShockwaveEmitting = false;
                isDefense('enemy');
                shockwave.style.display = 'none';
            }else{
                isShockwaveEmitting = false;
                isDamaged('enemy');
                shockwave.style.display = 'none';
            }
        }
    }

    requestAni = requestAnimationFrame(gameStart);
}

// 주기적으로 상대의 행동 결정
function enemyAction_function(){
    let ourDis = (enemyposX - myposX) / ourMaxDistance;
    if((ourDis) >= 0.5){ //둘 사이의 거리가 멀면
        if(Math.random() <= 0.70){ // 70% 확률로 움직이고
            isEnemySideMoving = true;
            if(Math.random() <= 0.70){ //70% 확률로 다가간다.
                enemymovingLeft = true;
            }else{
                enemymovingRight = true; //30% 확률로 멀어진다.
            }
            setTimeout(function(){ //0.3초 후에 멈춤
                isEnemySideMoving = false;
                enemymovingLeft = false;
                enemymovingRight = false;
            },300);
        }
    }else{ //둘 사이의 거리가 가까우면
        if(Math.random() <= 0.70){ // 70% 확률로 움직이고
            isEnemySideMoving = true;
            if(Math.random() <= 0.30){ //30% 확률로 다가간다.
                enemymovingLeft = true;
            }else{
                enemymovingRight = true; //70% 확률로 멀어진다.
            }
            setTimeout(function(){ //0.3초 후에 멈춤
                isEnemySideMoving = false;
                enemymovingLeft = false;
                enemymovingRight = false;
            },300);
        }
    }
    if(ourDis < 0.35){  // 일정거리 이상 가까워지면
        if(Math.random() <= 0.70){// 50% 확률로 공격시도
            attack('enemy');
        }
    }else{
        if(Math.random() <= 0.30){// 30% 확률로 공격시도
            attack('enemy');
        }
    }
    if(Math.random() <= 0.20){// 20% 확률로 점프
        isEnemyJumping = true;
    }
}

//남은시간표시
function timeID_function(){
    remainingTime.textContent = second;
    second -= 1;
    if(second < 0){
        second = 59;
        if(myHealth > enemyHealth){
            gamefinish('me');
        }else{
            gamefinish('enemy');
        }
        clearInterval(timeID);
    }
}


// -----------------좌우이동 관련 함수
function startSideMoving(dir) {
    direction = dir;
    isSideMoving = true;
    switch (direction){
        case 'left':
            movingLeft = true;
            movingRight = false;
            break;
        case 'right':
            isMyDefense = false;
            movingLeft = false;
            movingRight = true;
            break;
        }
        
}
function stopSideMoving() {
    isMyDefense = false;
    isSideMoving = false;
    movingLeft = false;
    movingRight = false; 
}

function startJumpMoving() {
    isJumping = true;
}
function startEnemyJumpMoving() {
    isEnemyJumping = true;
}

function startShockWaveMoving() {
    if(!isShockwaveDown){
        isShockwaveDown = true;
        setTimeout(function(){
            isShockwaveDown = false;
        },300) // 에너지파 동작을 위해 0.3초간 오른쪽 화살표 입력대기
    }
}




//------------------------공격 관련 함수
function attack(who) {
    
    if(who == 'me'){
        if(!isPressHitting && !isMyDamaged && !isMyDefense && !isShockwaveAction){
            if(isShockwaveRight && !isShockwaveEmitting){
                isShockwaveRight = false;
                isShockwaveAction = true;
                isShockwaveEmitting = true;
                me.setAttribute('src', 'images/me_wave_action.png'); //에너지파 액션으로 변경 예정
                shockwave.style.display = 'block';
                waveX = myposX;
                waveY = myposY;
                shockwave.style.left = waveX + 'px';
                shockwave.style.top = waveY + 'px';
                setTimeout(function(){
                    isShockwaveAction = false;
                    me.setAttribute('src', 'images/me.gif'); //0.3초 후에 원래모션으로 돌아오기
                },300);
            }else{
                isPressHitting = true;
                attackAttempt = true;
                isMyAttack = true;
                me.setAttribute('src', 'images/me_attack_action.png'); //공격모션으로 변경
                setTimeout(function(){
                    isPressHitting = false;
                    attackAttempt = false;
                    isMyAttack = false;
                    me.setAttribute('src', 'images/me.gif'); //0.3초 후에 원래모션으로 돌아오기
                    },300);
            }
            
        }
    }else if(who == 'enemy'){
        attackAttempt = true;
        isEnemyAttack = true;
        enemy.setAttribute('src', 'images/enemy_attack_action.png'); //공격모션으로 변경
        setTimeout(function(){
        attackAttempt = false;
        isEnemyAttack = false;
        enemy.setAttribute('src', 'images/enemy.gif'); //0.3초 후에 원래모션으로 돌아오기
        },300);
    }
    
}

function isDamaged(who){
    if(who == 'me'){
        isMyDamaged = true;
        me.setAttribute('src', 'images/me_damaged_action.png');
        setHealth('me', 10);
        setTimeout(function(){
            isMyDamaged = false;
            me.setAttribute('src', 'images/me.gif'); //0.3초 후에 원래모션으로 돌아오기
            },300);
    }else if(who == 'enemy'){
        isEnemyDamaged = true;
        enemy.setAttribute('src', 'images/enemy_damaged_action.png');
        setHealth('enemy', 10);
        setTimeout(function(){
            isMyDamaged = false;
            enemy.setAttribute('src', 'images/enemy.gif'); //0.3초 후에 원래모션으로 돌아오기
            },300);    
    }
}

function isDefense(who){
    if(who == 'me'){
        me.setAttribute('src', 'images/me_defense_action.png');
        setTimeout(function(){
            isMyDefense = false;
            me.setAttribute('src', 'images/me.gif'); //0.3초 후에 원래모션으로 돌아오기
            },300);
    }else if(who == 'enemy'){
        enemy.setAttribute('src', 'images/enemy_defense_action.png');
        setTimeout(function(){
            isEnemyDefense = false;
            enemy.setAttribute('src', 'images/enemy.gif'); //0.3초 후에 원래모션으로 돌아오기
            },300);  
    }
}

//체력바 조절
function setHealth(who, value) {
    if(who == 'me'){
        myHealth -= value;
        myHealthBar.value = myHealth;
        if(myHealth <= 0){
            gamefinish('enemy');
        }
        
    }else if(who == 'enemy'){
        enemyHealth -= value;
        enemyHealthBar.value = enemyHealth;
        if(enemyHealth <= 0){
            gamefinish('me');
        }
    }
}


// 충돌감지
function isCollisionCheck(myposX, myposY, enemyposX, enemyposY) {
    let diffX = Math.abs(enemyposX - myposX);
    if (diffX <= me.width/3) {
      let diffY = Math.abs(enemyposY - myposY);
      if (diffY <= me.height/2) {
        return true;
      }
    }
    return false;
  }
function isWaveCollisionCheck(waveX, waveY, enemyposX, enemyposY) {
    let diffX = Math.abs(enemyposX - waveX);
    if (diffX <= me.width/6) {
      let diffY = Math.abs(enemyposY - waveY);
      if (diffY <= me.height/2) {
        return true;
      }
    }
    return false;
  }


//------------------------조이스틱 관련 함수
joystickContainer.addEventListener('touchstart', (e) => {
    isDragging = true;

    e.preventDefault();
});

joystickContainer.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        // joystickContainer를 벗어나지 않도록
        joystick.style.left = Math.max(joystick.offsetWidth/2, Math.min(x, maxX)) + 'px';
        joystick.style.top = Math.max(joystick.offsetHeight/2, Math.min(y, maxY)) + 'px';

        if(centerY * 0.4 > y && (centerX * 0.6 < x) && (x < centerX * 1.4)){
            startJumpMoving();
        }else if(centerX * 1.15 < x){
            if(isShockwaveDown){
                isShockwaveDown = false;
                isShockwaveRight = true;
                setTimeout(function(){
                    isShockwaveRight = false;
                },300) 
            }
            startSideMoving('right');
        }else if(centerX * 0.85 > x){
            startSideMoving('left');
        }else if(centerY * 1.3 < y && (centerX * 0.7 < x) && (x < centerX * 1.3)){
            startShockWaveMoving();
        }else{
            isSideMoving = false;
        }

        e.preventDefault(); // Prevent default touch actions like scrolling
    }
});

//터치를 멈추면 본래 자리로
joystickContainer.addEventListener('touchend', (e) => {
    isDragging = false;
    joystick.style.left = '50%';
    joystick.style.top = '50%';
    stopSideMoving();
    e.preventDefault();
});

    // Prevent scrolling when touching the joystick
joystickContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
});


bt_spacebar.addEventListener('touchstart', (e) => {
    attack('me');
    e.preventDefault();
});

function gamefinish(who){
    game_finish = true;
    if(who == 'me'){ //내가 이긴 경우
        blackmask.style.display = 'block';
        win.style.display = 'block';
        retry.style.display = 'block'
        
    }else{ // 내가 진 경우
        blackmask.style.display = 'block';
        gameover.style.display = 'block';
        retry.style.display = 'block'
    }
    clearInterval(timeID);
    clearInterval(enemyAction);
    cancelAnimationFrame(requestAni);
}


//마스킹 관련 함수
blackmask.addEventListener('touchstart', () => {
    if(touchCount === 1){
        // 첫 터치에 마스킹 지우기
        blackmask.style.display = 'none';
        waiting_fencing.style.display = 'none';
        gameStart();
        enemyAction = setInterval(enemyAction_function, 1000);
        timeID = setInterval(timeID_function, 1000);
    }
    touchCount++; 
});

retry.addEventListener('touchstart', (e) => {
    if(game_finish){
        cancelAnimationFrame(requestAni);
        restart();
    }
    e.preventDefault();
});


//초기화

function restart() {
    blackmask.style.display = 'block';
    waiting_fencing.style.display = 'block';
    gameover.style.display = 'none';
    win.style.display = 'none';
    retry.style.display = 'none';

    me.src="images/me.gif";
    enemy.src="images/enemy.gif";
    myposX = (me.width)/2; //내 첫위치
    me.style.left = myposX + 'px';
    myposY = (mainRect.height * 0.8);
    me.style.top = myposY + 'px';
    enemyposX = mainRect.width - (enemy.width/2); //상대 첫위치
    enemy.style.left = enemyposX + 'px';
    enemyposY = (mainRect.height * 0.8);
    enemy.style.top = enemyposY + 'px';

    isSideMoving = false; // 좌우이동 여부
    movingLeft = false;
    movingRight = false;
    isEnemySideMoving = false; // 상대방 좌우이동 여부
    enemymovingLeft = false;
    enemymovingRight = false;
    movingSpeed = 1.5; // 이동속도
    isPressHitting = false; //스페이스바 누름여부
    attackAttempt = false; // 나&상대방 공격 시도 여부
    isMyAttack = false; // 나의 공격
    isEnemyAttack = false; // 상대방의 공격
    isMyDamaged = false;
    isEnemyDamaged = false;
    isMyDefense = false;
    isEnemyDefense = false;
    enemyAction = null;
    isJumping = false;
    isEnemyJumping = false;
    jumpVelocityY = -8;
    jumpEnemyVelocityY = -8;
    isShockwaveDown = false;
    isShockwaveRight = false;
    isShockwaveAction = false;
    isShockwaveEmitting = false;
    waveX = myposX;
    waveY = myposY;
    shockwave.style.display = 'none';


    myHealth = 100;
    myHealthBar.value = myHealth;
    enemyHealth = 100;
    enemyHealthBar.value = enemyHealth;

    second = 59; //남은시간(초)
    remainingTime.textContent = 60;

    game_finish = false;
    touchCount = 0;


}