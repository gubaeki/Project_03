const touchArea = document.getElementById('bottom_section_id');
const speed_present = document.getElementById('speed_present');
const speed_high = document.getElementById('speed_high');
var bg_road = document.getElementById('bg_road_id');
const speed_head = document.getElementById('speed_head_id');

let lastTouchTime = 0;
let touchCount = 0;

let startTime = 0;
let currentSpeed = 0;
let previousSpeed = 0;
let highSpeed = 0;

const measureDuration = 1000; // Measure speed over 1 second

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

        
        //최고속도 갱신
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
    }
}

// Set interval to update speed every second
setInterval(clickcheck, measureDuration);