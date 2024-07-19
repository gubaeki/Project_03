document.addEventListener('click', function(event) {
    var moving_tiger = document.getElementById('moving_tiger');
    var x = event.clientX;
    var y = event.clientY;

    var centerx = x;
    var centery = y;
    
    moving_tiger.style.left = centerx + 'px';
    moving_tiger.style.top = centery + 'px';

    // 특정 시간 후 위치 검사 (transition 시간이 2.0초이므로 2.1초 후 검사)
    setTimeout(function() {
        var gifRect = moving_tiger.getBoundingClientRect();
        //var gifRect_left_float = gifRect.left, gifRect_right_float = gifRect.right, gifRect_top_float = gifRect.top, gifRect_bottom_float = gifRect.bottom;
        
        // 뷰포트 크기 계산
        var viewportHeight = window.innerHeight;
        var viewportWidth = window.innerWidth;
        
        // 특정 범위 정의 (예: x 100-200, y 100-200)
        var kboat_minX_float = 52 * viewportWidth / 100, kboat_maxX_float = 96 * viewportWidth / 100;
        var kboat_minY_float = 23 * viewportHeight / 100, kboat_maxY_float = 35.5 * viewportHeight / 100;
        var krace_minX_float = 10 * viewportWidth / 100, krace_maxX_float = 37.3 * viewportWidth / 100;
        var krace_minY_float = 45 * viewportHeight / 100, krace_maxY_float = 62.7 * viewportHeight / 100;
        var krun_minX_float = 61.6 * viewportWidth / 100, krun_maxX_float = 96 * viewportWidth / 100;
        var krun_minY_float = 75.9 * viewportHeight / 100, krun_maxY_float = 89 * viewportHeight / 100;

        // 정수화
        var kboat_minX = Math.round(kboat_minX_float), kboat_maxX = Math.round(kboat_maxX_float);
        var kboat_minY = Math.round(kboat_minY_float), kboat_maxY = Math.round(kboat_maxY_float);
        var krace_minX = Math.round(krace_minX_float), krace_maxX = Math.round(krace_maxX_float);
        var krace_minY = Math.round(krace_minY_float), krace_maxY = Math.round(krace_maxY_float);
        var krun_minX = Math.round(krun_minX_float), krun_maxX = Math.round(krun_maxX_float);
        var krun_minY = Math.round(krun_minY_float), krun_maxY = Math.round(krun_maxY_float);

        var message = document.getElementById('event_sub');
        var messageElement = document.getElementById('event_message');
        //messageElement.textContent = `확인! 현재 좌표: (${gifRect.left}, ${gifRect.top}, ${kboat_minX}, ${kboat_minY})`;
        //message.style.display = 'block';
    
        // 범위 안에 있는지 검사
        if (gifRect.left >= kboat_minX && gifRect.left <= kboat_maxX && gifRect.top >= kboat_minY && gifRect.top <= kboat_maxY) {
            messageElement.textContent = `Kboat(경정)에 도전하시겠습니까? 현재 좌표: (${gifRect.left}, ${gifRect.top})`;
            message.style.display = 'block';
        } else if (gifRect.left >= krace_minX && gifRect.left <= krace_maxX && gifRect.top >= krace_minY && gifRect.top <= krace_maxY) {
            messageElement.textContent = `Krace(경륜)에 도전하시겠습니까? 현재 좌표: (${gifRect.left}, ${gifRect.top})`;
            message.style.display = 'block';
        } else if (gifRect.left >= krun_minX && gifRect.left <= krun_maxX && gifRect.top >= krun_minY && gifRect.top <= krun_maxY) {
            messageElement.textContent = `국민체력100(달리기)에 도전하시겠습니까? 현재 좌표: (${gifRect.left}, ${gifRect.top})`;
            message.style.display = 'block';
        } else {
            //message.textContent = `조건불일치! 현재좌표: (${gifRect.left}, ${gifRect.top}, ${kboat_minX}, ${kboat_maxX}, ${kboat_minY} ,${kboat_maxY})`;
            message.style.display = 'none';
        }

         // 예/아니오 버튼 이벤트 핸들러 설정
        document.querySelector('.yes-btn').addEventListener('click', function() {
            alert('예 버튼을 클릭했습니다.');
            message.style.display = 'none';
        });

        document.querySelector('.no-btn').addEventListener('click', function() {
            alert('아니오 버튼을 클릭했습니다.');
            message.style.display = 'none';
        });
        
    }, 2100); // 2100ms 후 검사

    
});
