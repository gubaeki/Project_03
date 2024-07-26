const touchArea = document.getElementById('bottom_section_id');
const speed_present = document.getElementById('speed_present');
const speed_high = document.getElementById('speed_high');
var bg_river = document.getElementById('bg_river_id');
var bg_road = document.getElementById('bg_road_id');
const speed_head = document.getElementById('speed_head_id');
const running_tiger = document.getElementById('running_tiger');
const moving_hurdle = document.getElementById('moving_hurdle');
const highlightrunning = document.getElementById('highlight_running');
const highlighthurdle = document.getElementById('highlight_hurdle');


let lastTouchTime = 0;
let touchCount = 0;

let startTime = 0;
let currentSpeed = 0;
let previousSpeed = 0;
let highSpeed = 0;

const measureDuration = 100; // 체크주기: 0.1초





// 충돌감지 함수
function isCollide(img1, img2) {
            let rect_tiger = img1.getBoundingClientRect();
            let rect_hurdle = img2.getBoundingClientRect();

            let tiger_centerX = rect_tiger.left + (rect_tiger.width / 2);
            let tiger_centerY = rect_tiger.top + (rect_tiger.height / 2);
            let hurdle_centerX = rect_hurdle.left + (rect_hurdle.width / 2);
            let hurdle_centerY = rect_hurdle.top + (rect_hurdle.height / 2);

            let inner_tiger_left = Math.round((tiger_centerX - 10));
            let inner_tiger_right = Math.round((tiger_centerX + 10));
            let inner_tiger_top = Math.round((tiger_centerY - 10));
            let inner_tiger_bottom = Math.round(tiger_centerY + 10);

            let inner_hurdle_left = Math.round((hurdle_centerX - 10));
            let inner_hurdle_right = Math.round((hurdle_centerX + 10));
            let inner_hurdle_top = Math.round((hurdle_centerY - 10));
            let inner_hurdle_bottom = Math.round((hurdle_centerY + 10));

            
            /*//두번째 방식
            let rect_tiger = img1.getBoundingClientRect();
            let rect_hurdle = img2.getBoundingClientRect();

            let tiger_centerX = rect_tiger.left + (rect_tiger.width / 2);
            let tiger_centerY = rect_tiger.top + (rect_tiger.height / 2);
            let hurdle_centerX = rect_hurdle.left + (rect_hurdle.width / 2);
            let hurdle_centerY = rect_hurdle.top + (rect_hurdle.height / 2);

            let inner_tiger_left = Math.round((tiger_centerX - (rect_tiger.width * 0.4)));
            let inner_tiger_right = Math.round((tiger_centerX + (rect_tiger.width * 0.4)));
            let inner_tiger_top = Math.round((tiger_centerY - (rect_tiger.height * 0.1)));
            let inner_tiger_bottom = Math.round(tiger_centerY + (rect_tiger.height * 0.7));

            let inner_hurdle_left = Math.round((hurdle_centerX - (rect_hurdle.width * 0.4)));
            let inner_hurdle_right = Math.round((hurdle_centerX + (rect_hurdle.width * 0.4)));
            let inner_hurdle_top = Math.round((hurdle_centerY - (rect_hurdle.height * 0.3)));
            let inner_hurdle_bottom = Math.round((hurdle_centerY + (rect_hurdle.height * 1)));
            */
            /*// 기존 방식
            let rect_tiger = img1.getBoundingClientRect();
            let rect_hurdle = img2.getBoundingClientRect();

            let inner_tiger_left = Math.round((rect_tiger.left + (rect_tiger.width * 0.4)));
            let inner_tiger_right = Math.round((rect_tiger.right - (rect_tiger.width * 0.4)));
            let inner_tiger_top = Math.round((rect_tiger.top + (rect_tiger.height * 0.1)));
            let inner_tiger_bottom = Math.round(rect_tiger.bottom - (rect_tiger.height * 0.7));

            let inner_hurdle_left = Math.round((rect_hurdle.left + (rect_hurdle.width * 0.4)));
            let inner_hurdle_right = Math.round((rect_hurdle.right - (rect_hurdle.width * 0.4)));
            let inner_hurdle_top = Math.round((rect_hurdle.top - (rect_hurdle.height * 0.3)));
            let inner_hurdle_bottom = Math.round((rect_hurdle.bottom - (rect_hurdle.height * 1)));
*/
            // 충돌영역 하이라이트
            highlightrunning.style.left = inner_tiger_left + 'px';
            highlightrunning.style.top = inner_tiger_top + 'px';
            highlightrunning.style.width = (inner_tiger_right - inner_tiger_left) + 'px';
            highlightrunning.style.height = (inner_tiger_bottom - inner_tiger_top) + 'px';

            highlighthurdle.style.left = inner_hurdle_left + 'px';
            highlighthurdle.style.top = inner_hurdle_top + 'px';
            highlighthurdle.style.width = (inner_hurdle_right - inner_hurdle_left) + 'px';
            highlighthurdle.style.height = (inner_hurdle_bottom - inner_hurdle_top) + 'px';
            
            return !(inner_tiger_right < inner_hurdle_left || 
                     inner_tiger_left > inner_hurdle_right || 
                     inner_tiger_bottom < inner_hurdle_top || 
                     inner_tiger_top > inner_hurdle_bottom);
        }

function startJump() {
            running_tiger.classList.add('jump');
        }
function finishJump() {
            running_tiger.classList.remove('jump');
        }

function startHurdle() {
            // 허들 왼쪽으로 이동
            moving_hurdle.style.left = -100 + '%';
        }




touchArea.addEventListener('touchstart', () => {
            // 첫 터치에 배경 움직이기 시작
            if(touchCount===0){
                bg_river.style.animation = 'slide-left10 10s linear infinite';
                bg_road.style.animation = 'slide-left2 2s linear infinite';
                // 1초 후 허들 움직이기 시작
                setTimeout(startHurdle,1000);
            }
            touchCount++;
            //speed_head.textContent = `${touchCount}`;
        
            //running_tiger.style.top = 30 + '%';   
            //running_tiger.style.top = 59 + '%'; 
            
});

const collisioncheck = () => {
    // 충돌 감지
    if (isCollide(running_tiger, moving_hurdle)) {
                //moving_hurdle.style.display = 'none';
                touchCount = 0;
                //moving_hurdle.style.left = 100 + '%';
                return;
            }
}
setInterval(collisioncheck, measureDuration);


function test() {
                // 점프를 시작합니다
                startJump();
                setTimeout(finishJump, 600);

}

/*
touchArea.addEventListener('touchstart', () => {
    const currentTime = new Date().getTime();
    lastTouchTime = currentTime;
    if (touchCount === 0) {
        startTime = currentTime;
    }

    touchCount++;

    if (currentTime - startTime >= measureDuration) {
        const speed = Math.round((touchCount / ((currentTime - startTime) / 2000)*100))/100;
        currentSpeed = speed;

        if (currentSpeed <= previousSpeed) {
            currentSpeed = Math.max(currentSpeed - 1, 0.1); // Ensure speed doesn't go below 0.1
        }

        speed_present.textContent = `${currentSpeed} km/h`;
        speed_head.textContent = `${currentSpeed} km/h`;

        // 백호돌이 전진
        running_tiger.style.left = 50 + '%';

         // 충돌 감지
            if (isCollide(running_tiger, moving_hurdle)) {
                moving_hurdle.style.display = 'none';
                return;
            }
        
        // 최고속도 갱신
        if(currentSpeed >= highSpeed){
            highSpeed = currentSpeed;
            speed_high.textContent = `${highSpeed} km/h`;
         }

        // Update previous speed
         previousSpeed = currentSpeed;

        // Reset for the next measurement
        touchCount = 0;
        startTime = currentTime;
    }
});


const clickcheck = () => {
    currentTime = new Date().getTime();
    if(currentTime-lastTouchTime>= measureDuration){
        currentSpeed = Math.max(currentSpeed - 1, 0.1);
        previousSpeed = currentSpeed;
        speed_present.textContent = `${currentSpeed} km/h`;
        speed_head.textContent = `${currentSpeed} km/h`;

        // 클릭하지 않으면 백호돌이 후진
        running_tiger.style.left = 10 + '%';
    }

    
    
}

// Set interval to update speed every second
setInterval(clickcheck, measureDuration);

*/
