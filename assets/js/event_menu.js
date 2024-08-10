    // banner2 크기 정의
    var banner2 = document.getElementById('banner2');
    var banner2Rect = banner2.getBoundingClientRect();
    var banner2Width = banner2Rect.right - banner2Rect.left;
    var banner2Height = banner2Rect.bottom - banner2Rect.top;
    var innerbanner2Width = Math.round(banner2Height / 2.1636);
    var centerbanner2X = banner2Width / 2;
    var minbanner2X = centerbanner2X - (innerbanner2Width / 2); 
    var maxbanner2X = centerbanner2X + (innerbanner2Width / 2);
    var messageElementKrun = document.getElementById('event_message_krun');
    var messageElementFencing = document.getElementById('event_message_fencing');
    var messageElementVolleyball = document.getElementById('event_message_volleyball');
    var messageElementMatching = document.getElementById('event_message_matching');

    // event 종류 관련 변수
    var select_event = 0;

    // 이미지 Preload
    const images = [
        "../../images/message_matching.png",
        "../../images/message_krun.png",
        "../../images/message_volleyball.png",
        "../../images/message_fencing.png"
    ];
    const preload = (images) => {
        images.forEach((image) => {
            const img = new Image();
            img.src = image;
        });
    };
    preload(images);

document.addEventListener('DOMContentLoaded', function() {
    var message = document.getElementById('event_sub');
    //var moving_click1 = document.getElementById('moving_click1');
    //var moving_click2 = document.getElementById('moving_click2');
    //var moving_click3 = document.getElementById('moving_click3');
    //var moving_tiger = document.getElementById('moving_tiger');
    var highlightKboat = document.getElementById('highlight_kboat');
    var highlightKrace = document.getElementById('highlight_krace');
    var highlightKrun = document.getElementById('highlight_krun');
    var highlightFencing = document.getElementById('highlight_fencing');
    

    // 선택구역 나누기
    var kboat_minX_float = centerbanner2X - (innerbanner2Width * 44 /100), kboat_maxX_float = centerbanner2X - (innerbanner2Width * 5 /100);
    var kboat_minY_float = 35 * banner2Height / 100, kboat_maxY_float = 53 * banner2Height / 100;
    var krace_minX_float = centerbanner2X + (innerbanner2Width * 5 /100), krace_maxX_float = centerbanner2X + (innerbanner2Width * 42 /100);
    var krace_minY_float = 27 * banner2Height / 100, krace_maxY_float = 44 * banner2Height / 100;
    var krun_minX_float = centerbanner2X - (innerbanner2Width * 41 /100), krun_maxX_float = centerbanner2X - (innerbanner2Width * 2 /100);
    var krun_minY_float = 11 * banner2Height / 100, krun_maxY_float = 28 * banner2Height / 100;
    var fencing_minX_float = centerbanner2X + (innerbanner2Width * 6 /100), fencing_maxX_float = centerbanner2X + (innerbanner2Width * 43 /100);
    var fencing_minY_float = 51 * banner2Height / 100, fencing_maxY_float = 68 * banner2Height / 100;


    var kboat_minX = Math.round(kboat_minX_float), kboat_maxX = Math.round(kboat_maxX_float);
    var kboat_minY = Math.round(kboat_minY_float), kboat_maxY = Math.round(kboat_maxY_float);
    var krace_minX = Math.round(krace_minX_float), krace_maxX = Math.round(krace_maxX_float);
    var krace_minY = Math.round(krace_minY_float), krace_maxY = Math.round(krace_maxY_float);
    var krun_minX = Math.round(krun_minX_float), krun_maxX = Math.round(krun_maxX_float);
    var krun_minY = Math.round(krun_minY_float), krun_maxY = Math.round(krun_maxY_float);
    var fencing_minX = Math.round(fencing_minX_float), fencing_maxX = Math.round(fencing_maxX_float);
    var fencing_minY = Math.round(fencing_minY_float), fencing_maxY = Math.round(fencing_maxY_float);


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

    highlightFencing.style.left = fencing_minX + 'px';
    highlightFencing.style.top = fencing_minY + 'px';
    highlightFencing.style.width = (fencing_maxX - fencing_minX) + 'px';
    highlightFencing.style.height = (fencing_maxY - fencing_minY) + 'px';
    */

    // 예/아니오 버튼 이벤트 핸들러 설정
    document.querySelector('#yes-btn').addEventListener('click', function(event) {
        if(select_event===1){
            location.href='matching.html';
        }else if(select_event===2){
            location.href='volleyball.html';
        }else if(select_event===3){
            location.href='krun.html';
        }
        else{
            location.href='fencing.html';
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

        //터치좌표 입력 시 clientX 대신 pageX 사용(clientX는 현재보이는 화면 좌측 상단이 무조건 0, pageX는 문서의 좌측 상단이 0이고 스크롤이 생겨도 화면 좌측상단은 0이 아님)
        //var x = event.clientX;
        //var y = event.clientY;
        var x = event.pageX;
        var y = event.pageY;

        if (x >= kboat_minX && x <= kboat_maxX && y >= kboat_minY && y <= kboat_maxY) {
            
            //messageElement.src ="images/message_matching.png";
            messageElementMatching.style.display = 'block';
            messageElementFencing.style.display = 'none';
            messageElementVolleyball.style.display = 'none';
            messageElementKrun.style.display = 'none';
            message.style.display = 'block';
            select_event = 1;
        } else if (x >= krace_minX && x <= krace_maxX && y >= krace_minY && y <= krace_maxY) {
            //messageElement.src ="images/message_volleyball.png";
            messageElementMatching.style.display = 'none';
            messageElementFencing.style.display = 'none';
            messageElementVolleyball.style.display = 'block';
            messageElementKrun.style.display = 'none';
            message.style.display = 'block';
            select_event = 2;
        } else if (x >= krun_minX && x <= krun_maxX && y >= krun_minY && y <= krun_maxY) {
            messageElementMatching.style.display = 'none';
            messageElementFencing.style.display = 'none';
            messageElementVolleyball.style.display = 'none';
            messageElementKrun.style.display = 'block';
            //messageElement.src ="images/message_krun.png";
            message.style.display = 'block';
            select_event = 3;
        }else if (x >= fencing_minX && x <= fencing_maxX && y >= fencing_minY && y <= fencing_maxY) {
            messageElementMatching.style.display = 'none';
            messageElementFencing.style.display = 'block';
            messageElementVolleyball.style.display = 'none';
            messageElementKrun.style.display = 'none';
            //messageElement.src ="images/message_fencing.png";
            message.style.display = 'block';
            select_event = 4;
        } else {
            message.style.display = 'none';
        }

    });
});
