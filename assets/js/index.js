    // banner2 크기 정의
    var banner = document.getElementById('banner');
    var bannerRect = banner.getBoundingClientRect();
    var bannerWidth = bannerRect.right - bannerRect.left;
    var bannerHeight = bannerRect.bottom - bannerRect.top;
    var innerbannerWidth = Math.round(bannerHeight / 2.1636);
    var centerbannerX = bannerWidth / 2;
    var minbannerX = centerbannerX - (innerbannerWidth / 2); 
    var maxbannerX = centerbannerX + (innerbannerWidth / 2);


document.addEventListener('DOMContentLoaded', function() {

    var highlightstart = document.getElementById('highlight_start');


    // 선택구역 나누기
    var start_minX_float = centerbannerX - (innerbannerWidth * 18 /100), start_maxX_float = centerbannerX + (innerbannerWidth * 25 /100);
    var start_minY_float = 61 * bannerHeight / 100, start_maxY_float = 69 * bannerHeight / 100;

    var start_minX = Math.round(start_minX_float), start_maxX = Math.round(start_maxX_float);
    var start_minY = Math.round(start_minY_float), start_maxY = Math.round(start_maxY_float);

    // 선택구역 하이라이트(평소엔 비활성화)
    highlightstart.style.left = start_minX + 'px';
    highlightstart.style.top = start_minY + 'px';
    highlightstart.style.width = (start_maxX - start_minX) + 'px';
    highlightstart.style.height = (start_maxY - start_minY) + 'px';

    

    // 예/아니오 버튼 이벤트 핸들러 설정

    document.addEventListener('click', function(event) {
        var x = event.clientX;
        var y = event.clientY;
        
        var messageElement = document.getElementById('event_message');

        if (x >= start_minX && x <= start_maxX && y >= start_minY && y <= start_maxY) {
            location.href='event_menu.html';
        } 

    });
});
