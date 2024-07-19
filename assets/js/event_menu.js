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

        // 뷰포트 크기 계산
        var viewportHeight = window.innerHeight;
        var viewportWidth = window.innerWidth;

        // 특정 범위 정의 (예: x 100-200, y 100-200)
        var kboat_minX = 56.3 * viewportWidth / 100, kboat_maxX = 97.6 * viewportWidth / 100;
        var kboat_minY = 18.4 * viewportHeight / 100, kboat_maxY = 35.5 * viewportHeight / 100;
        var krace_minX = 10 * viewportWidth / 100, krace_maxX = 37.3 * viewportWidth / 100;
        var krace_minY = 45 * viewportHeight / 100, krace_maxY = 62.7 * viewportHeight / 100;
        var krun_minX = 61.6 * viewportWidth / 100, krun_maxX = 96 * viewportWidth / 100;
        var krun_minY = 75.9 * viewportHeight / 100, krun_maxY = 89 * viewportHeight / 100;

        var message = document.getElementById('event_sub');
        
        // 범위 안에 있는지 검사
        if (gifRect.left >= kboat_minX && gifRect.right <= kboat_maxX && gifRect.top >= kboat_minY && gifRect.bottom <= kboat_maxY) {
            message.textContent = `경정! 현재 좌표: (${gifRect.left.toFixed(2)}, ${gifRect.top.toFixed(2)})`;
            message.style.display = 'block';
        } else if (gifRect.left >= krace_minX && gifRect.right <= krace_maxX && gifRect.top >= krace_minY && gifRect.bottom <= krace_maxY) {
            message.textContent = `경륜! 현재 좌표: (${gifRect.left.toFixed(2)}, ${gifRect.top.toFixed(2)})`;
            message.style.display = 'block';
        } else if (gifRect.left >= krun_minX && gifRect.right <= krun_maxX && gifRect.top >= krun_minY && gifRect.bottom <= krun_maxY) {
            message.textContent = `달리기! 현재 좌표: (${gifRect.left.toFixed(2)}, ${gifRect.top.toFixed(2)})`;
            message.style.display = 'block';
        } else {
            message.style.display = 'none';
            return;
        }
        
    }, 2100); // 600ms 후 검사

    
});
