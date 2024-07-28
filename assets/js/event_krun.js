const touchAreaBanner = document.getElementById('banner3');
const difficulty = document.getElementById('difficulty');
const current_distance = document.getElementById('distance');
const high_distance = document.getElementById('high_distance');
var bg_river = document.getElementById('bg_river_id');
var bg_road = document.getElementById('bg_road_id');
const running_tiger = document.getElementById('running_tiger');
const moving_hurdle = document.getElementById('moving_hurdle');
const moving_hurdle2 = document.getElementById('moving_hurdle2');
const highlightrunning = document.getElementById('highlight_running');
const highlighthurdle = document.getElementById('highlight_hurdle');
const blackmssk = document.getElementById('blackmask');
const countdown = document.getElementById('countdown');
const gameover = document.getElementById('gameover');
const waiting_krun = document.getElementById('waiting_krun');



let touchCount = 0;
let target_hurdle = moving_hurdle;
let startTime = 0;
let highDistance = 0;
let currentDistance = 0.0;
let clearcheck;
let jumpcheck = 0;
let game_finish = 0;


const measureDuration = 100; // 체크주기: 0.1초



//var gif = countdown.getElementsByTagName('img')[0]; // 코드에 맞게 수정해야 함
//var src = gif.src;





// 충돌감지 함수
function isCollide(img1, img2) {
            let rect_tiger = img1.getBoundingClientRect();
            let rect_hurdle = img2.getBoundingClientRect();

            let tiger_centerX = rect_tiger.left + (rect_tiger.width / 2);
            let tiger_centerY = rect_tiger.top + (rect_tiger.height / 2);
            let hurdle_centerX = rect_hurdle.left + (rect_hurdle.width / 2);
            let hurdle_centerY = rect_hurdle.top + (rect_hurdle.height / 2);

            let inner_tiger_left = Math.round((tiger_centerX - (rect_tiger.width * 0.12)));
            let inner_tiger_right = Math.round((tiger_centerX + (rect_tiger.width * 0.12)));
            let inner_tiger_top = Math.round((tiger_centerY - (rect_tiger.height * 0.1)));
            let inner_tiger_bottom = Math.round(tiger_centerY + (rect_tiger.height * 0.2));

            let inner_hurdle_left = Math.round((hurdle_centerX - (rect_hurdle.width * 0.12)));
            let inner_hurdle_right = Math.round((hurdle_centerX + (rect_hurdle.width * 0.12)));
            let inner_hurdle_top = Math.round((hurdle_centerY - (rect_tiger.height * 0.1)));
            let inner_hurdle_bottom = Math.round((hurdle_centerY + (rect_tiger.height * 0.1)));

            // 충돌영역 하이라이트
            /*
            highlightrunning.style.left = inner_tiger_left + 'px';
            highlightrunning.style.top = inner_tiger_top + 'px';
            highlightrunning.style.width = (inner_tiger_right - inner_tiger_left) + 'px';
            highlightrunning.style.height = (inner_tiger_bottom - inner_tiger_top) + 'px';

            highlighthurdle.style.left = inner_hurdle_left + 'px';
            highlighthurdle.style.top = inner_hurdle_top + 'px';
            highlighthurdle.style.width = (inner_hurdle_right - inner_hurdle_left) + 'px';
            highlighthurdle.style.height = (inner_hurdle_bottom - inner_hurdle_top) + 'px';
            */
            
            return !(inner_tiger_right < inner_hurdle_left || 
                     inner_tiger_left > inner_hurdle_right || 
                     inner_tiger_bottom < inner_hurdle_top || 
                     inner_tiger_top > inner_hurdle_bottom);
        }

function startJump() {
            running_tiger.classList.add('jump');
            jumpcheck = 1;
        }
function finishJump() {
            running_tiger.classList.remove('jump');
            jumpcheck = 0;
        }

function startHurdle() {
            // 허들 왼쪽으로 이동
            moving_hurdle.style.left = -100 + '%';
            //moving_hurdle2.style.left = 10 + '%';
        }




touchAreaBanner.addEventListener('touchstart', () => {
            
            if(touchCount===0){
                if(game_finish===1){
                    restart();
                }else{
                    // 첫 터치에 마스킹 지우기
                    blackmssk.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    countdown.setAttribute('src', 'images/countdown.gif');
                    countdown.style.display = 'block';
                    waiting_krun.style.display = 'none';
                    gameover.style.display = 'none';
                    current_distance.textContent = `0.0 m`;
                
                    // 4초(카운트다운) 경과 후 아래함수 시작
                    setTimeout(function(){
                    countdown.style.display = 'none';
                    blackmssk.style.display = 'none';

                    //setTimeout(startHurdle(),1000);
                    //setTimeout(function(){moving_hurdle2.style.display = 'none';},1000);

                    // 충돌감지 / 배경 움직이기 / 이동거리 증가 시작
                    clearcheck = setInterval(collisioncheck, measureDuration);
                    bg_river.style.animation = 'slide-left10 10s linear infinite';
                    bg_road.style.animation = 'slide-left2 2s linear infinite';
                    moving_hurdle.style.animation = 'slide-left_hurdle 4s linear infinite';
                    },4000);
                    touchCount++; 
                }
            }
              
});

const collisioncheck = () => {
    // 충돌 감지
    if (isCollide(running_tiger, target_hurdle)) {
        //초기화
        blackmssk.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        blackmssk.style.display = 'block';
        gameover.style.display = 'block';
        game_finish = 1;
        countdown.setAttribute('src', '');
        bg_river.style.animation = 'pause';
        bg_road.style.animation = 'pause';
        moving_hurdle.style.animation = 'pause';
        moving_hurdle2.style.animation = 'pause';

        clearInterval(clearcheck);
        
        touchCount = 0;

        if(highDistance < currentDistance){
            highDistance = currentDistance;
            high_distance.textContent = `${highDistance} m`;
        }
        
        currentDistance = 0.0;
                
        return;
    }

    // 이동거리 증가
            currentDistance = Math.round((currentDistance + 0.1)*10)/10;
            current_distance.textContent = `${currentDistance} m`;

            //난도 상승(1->2단계)
            if(currentDistance >= 20){
                difficulty.textContent = '2단계';
                moving_hurdle.style.display='none';
                moving_hurdle2.style.display='block';
                moving_hurdle2.style.animation = 'slide-left_hurdle 4s linear infinite';
                target_hurdle = moving_hurdle2;
            }

}

function jump() {
                // 점프를 시작합니다
                if(jumpcheck===1){ //점프중이면 실행X
                    
                }else{
                    startJump();
                    setTimeout(finishJump, 600);
                }
}

function restart() {
    //초기화
    blackmssk.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    blackmssk.style.display = 'block';
    waiting_krun.style.display = 'block';
    gameover.style.display = 'none';
    countdown.setAttribute('src', '');
    bg_river.style.animation = 'pause';
    bg_road.style.animation = 'pause';
    moving_hurdle.style.animation = 'pause';
    moving_hurdle2.style.animation = 'pause';
    currentDistance = 0.0;
    game_finish = 0;
    touchCount = 0;
    jumpcheck = 0;
    current_distance.textContent = `0.0 m`;
    difficulty.textContent = '1단계';
    target_hurdle = moving_hurdle;
    moving_hurdle.style.display = 'block';
    moving_hurdle2.style.display = 'none';
    clearInterval(clearcheck);

}
