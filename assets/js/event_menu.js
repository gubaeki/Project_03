document.addEventListener('DOMContentLoaded', function() {
    var message = document.getElementById('event_sub');
    var moving_tiger = document.getElementById('moving_tiger');
    var highlightKboat = document.getElementById('highlight_kboat');
    var highlightKrace = document.getElementById('highlight_krace');
    var highlightKrun = document.getElementById('highlight_krun');

    // 경정, 경륜, 달리기 범위 표시
    var viewportHeight = window.innerHeight;
    var viewportWidth = window.innerWidth;

    var kboat_minX_float = 52 * viewportWidth / 100, kboat_maxX_float = 96 * viewportWidth / 100;
    var kboat_minY_float = 23 * viewportHeight / 100, kboat_maxY_float = 35.5 * viewportHeight / 100;
    var krace_minX_float = 10 * viewportWidth / 100, krace_maxX_float = 37.3 * viewportWidth / 100;
    var krace_minY_float = 45 * viewportHeight / 100, krace_maxY_float = 62.7 * viewportHeight / 100;
    var krun_minX_float = 61.6 * viewportWidth / 100, krun_maxX_float = 96 * viewportWidth / 100;
    var krun_minY_float = 75.9 * viewportHeight / 100, krun_maxY_float = 89 * viewportHeight / 100;

    var kboat_minX = Math.round(kboat_minX_float), kboat_maxX = Math.round(kboat_maxX_float);
    var kboat_minY = Math.round(kboat_minY_float), kboat_maxY = Math.round(kboat_maxY_float);
    var krace_minX = Math.round(krace_minX_float), krace_maxX = Math.round(krace_maxX_float);
    var krace_minY = Math.round(krace_minY_float), krace_maxY = Math.round(krace_maxY_float);
    var krun_minX = Math.round(krun_minX_float), krun_maxX = Math.round(krun_maxX_float);
    var krun_minY = Math.round(krun_minY_float), krun_maxY = Math.round(krun_maxY_float);

    highlightKboat.style.left = kboat_minX + 'px';
    highlightKboat.style.top = kboat_minY + 'px';
    highlightKboat.style.width = (kboat_maxX - kboat_minX) + 'px';
    highlightKboat.style.height = (kboat_maxY - kboat_minY) + 'px';

    highlightKrace.style.left = krace_minX + 'px';
    highlightKrace.style.top = krace_minY + 'px';
    highlightKrace.style.width = (krace_maxX - krace_minX) + 'px';
    highlightKrace.style.height = (krace_maxY - krace_minY) + 'px';

    highlightKrun.style.left = krun_minX + 'px';
    highlightKrun.style.top = krun_minY + 'px';
    highlightKrun.style.width = (krun_maxX - krun_minX) + 'px';
    highlightKrun.style.height = (krun_maxY - krun_minY) + 'px';

    
    // 예/아니오 버튼 이벤트 핸들러 설정
    document.querySelector('#yes-btn').addEventListener('click', function(event) {
        message.style.display = 'none';
        event.stopPropagation(); // 이벤트 버블링을 막아 click 이벤트가 상위로 전달되지 않도록 함
    });

    document.querySelector('#no-btn').addEventListener('click', function(event) {
        message.style.display = 'none';
        event.stopPropagation(); // 이벤트 버블링을 막아 click 이벤트가 상위로 전달되지 않도록 함
    });

    document.addEventListener('click', function(event) {
        if (message.style.display === 'block') {
            return; // 메시지가 이미 표시되고 있을 때는 클릭 이벤트를 무시
        }

        var x = event.clientX;
        var y = event.clientY;

        var centerx = x;
        var centery = y;

        moving_tiger.style.left = centerx + 'px';
        moving_tiger.style.top = centery + 'px';

        setTimeout(function() {
            var gifRect = moving_tiger.getBoundingClientRect();
            var messageElement = document.getElementById('event_message');

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
                message.style.display = 'none';
            }
        }, 2100); // 2100ms 후 검사
    });
});
