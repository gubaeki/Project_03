    // banner2 크기 정의
    var banner2 = document.getElementById('banner2');
    var banner2Rect = banner2.getBoundingClientRect();
    var banner2Width = banner2Rect.right - banner2Rect.left;
    var banner2Height = banner2Rect.bottom - banner2Rect.top;
    var innerbanner2Width = Math.round(banner2Height / 2.1636);
    var centerbanner2X = banner2Width / 2;
    var minbanner2X = centerbanner2X - (innerbanner2Width / 2); 
    var maxbanner2X = centerbanner2X + (innerbanner2Width / 2);


    // event 종류 관련 변수
    var select_event = 0;


document.addEventListener('DOMContentLoaded', function() {
    var message = document.getElementById('event_sub');
    var moving_click1 = document.getElementById('moving_click1');
    var moving_click2 = document.getElementById('moving_click2');
    var moving_click3 = document.getElementById('moving_click3');
    var moving_tiger = document.getElementById('moving_tiger');
    var highlightKboat = document.getElementById('highlight_kboat');
    var highlightKrace = document.getElementById('highlight_krace');
    var highlightKrun = document.getElementById('highlight_krun');

    // 선택구역 나누기
    var kboat_minX_float = centerbanner2X + (innerbanner2Width * 10 /100), kboat_maxX_float = centerbanner2X + (innerbanner2Width * 47 /100);
    var kboat_minY_float = 30 * banner2Height / 100, kboat_maxY_float = 47 * banner2Height / 100;
    var krace_minX_float = centerbanner2X - (innerbanner2Width * 47 /100), krace_maxX_float = centerbanner2X - (innerbanner2Width * 5 /100);
    var krace_minY_float = 55 * banner2Height / 100, krace_maxY_float = 72 * banner2Height / 100;
    var krun_minX_float = centerbanner2X + (innerbanner2Width * 11 /100), krun_maxX_float = centerbanner2X + (innerbanner2Width * 47 /100);
    var krun_minY_float = 75 * banner2Height / 100, krun_maxY_float = 92 * banner2Height / 100;

    var kboat_minX = Math.round(kboat_minX_float), kboat_maxX = Math.round(kboat_maxX_float);
    var kboat_minY = Math.round(kboat_minY_float), kboat_maxY = Math.round(kboat_maxY_float);
    var krace_minX = Math.round(krace_minX_float), krace_maxX = Math.round(krace_maxX_float);
    var krace_minY = Math.round(krace_minY_float), krace_maxY = Math.round(krace_maxY_float);
    var krun_minX = Math.round(krun_minX_float), krun_maxX = Math.round(krun_maxX_float);
    var krun_minY = Math.round(krun_minY_float), krun_maxY = Math.round(krun_maxY_float);

    // 선택구역 하이라이트(평소엔 비활성화)
    /*
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
    */

    // Click.gif 위치 정의
    moving_click1.style.left = kboat_minX + (innerbanner2Width * 5 /100) + 'px';
    moving_click1.style.top = kboat_maxY - (banner2Height * 4 /100) + 'px';
    moving_click2.style.left = krace_minX + (innerbanner2Width * 5 /100)+ 'px';
    moving_click2.style.top = krace_maxY - (banner2Height * 4 /100)+ 'px';
    moving_click3.style.left = krun_minX + (innerbanner2Width * 5 /100)+ 'px';
    moving_click3.style.top = krun_maxY - (banner2Height * 4 /100)+ 'px';

    // 예/아니오 버튼 이벤트 핸들러 설정
    document.querySelector('#yes-btn').addEventListener('click', function(event) {
        if(select_event===1){
            console.log('경정선택');
            location.href='kboat.html';
        }else if(select_event===2){
            console.log('경륜선택');
            location.href='krace.html';
        }
        else{
            console.log('달리기선택');
            location.href='krun.html';
        }
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

        moving_tiger.style.left = x + 'px';
        moving_tiger.style.top = y + 'px';

        setTimeout(function() {
            var gifRect = moving_tiger.getBoundingClientRect();
            var gifRectCenterX = (gifRect.left + gifRect.right) / 2;
            var gifRectCenterY = (gifRect.top + gifRect.bottom) / 2;
            var messageElement = document.getElementById('event_message');

            if (gifRectCenterX >= kboat_minX && gifRectCenterX <= kboat_maxX && gifRectCenterY >= kboat_minY && gifRectCenterY <= kboat_maxY) {
                messageElement.textContent = `Kboat(경정)에 도전하시겠습니까?`;
                message.style.display = 'block';
                select_event = 1;
            } else if (gifRectCenterX >= krace_minX && gifRectCenterX <= krace_maxX && gifRectCenterY >= krace_minY && gifRectCenterY <= krace_maxY) {
                messageElement.textContent = `Krace(경륜)에 도전하시겠습니까?`;
                message.style.display = 'block';
                select_event = 2;
            } else if (gifRectCenterX >= krun_minX && gifRectCenterX <= krun_maxX && gifRectCenterY >= krun_minY && gifRectCenterY <= krun_maxY) {
                messageElement.textContent = `국민체력100(달리기)에 도전하시겠습니까?`;
                message.style.display = 'block';
                select_event = 3;
            } else {
                message.style.display = 'none';
            }

        }, 2100); // 2100ms 후 검사
    });
});
