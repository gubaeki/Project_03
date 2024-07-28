var banner = document.getElementById('banner');
var bannerRect = banner.getBoundingClientRect();
var bannerWidth = bannerRect.width;
var bannerHeight = bannerRect.height;

let windowwidth = $(window).width();
let windowheight = $(window).height();

console.log(bannerWidth);
console.log(bannerHeight);

var centerinnerbannerX = windowwidth / 2;
var innerbannerWidth = Math.round(bannerHeight / 2.1636);


document.addEventListener('DOMContentLoaded', function() {

    var highlightstart = document.getElementById('highlight_start');

    //선택 구역 나누기
    var start_minX, start_maxX;
    var start_minY, start_maxY;

    // 배너크기가 최소 320px으로 지정되어있음을 확인
    if(bannerWidth <= 320){
        start_minX = 105;
        start_maxX = 240;
    }else{
        start_minX = Math.round(centerinnerbannerX - (innerbannerWidth * 18 /100));
        start_maxX = Math.round(centerinnerbannerX + (innerbannerWidth * 25 /100));
    }
    start_minY = Math.round(61 * bannerHeight / 100);
    start_maxY = Math.round(69 * bannerHeight / 100);


    // 선택구역 하이라이트(평소엔 비활성화)
    /*
    highlightstart.style.left = start_minX + 'px';
    highlightstart.style.top = start_minY + 'px';
    highlightstart.style.width = (start_maxX - start_minX) + 'px';
    highlightstart.style.height = (start_maxY - start_minY) + 'px';
    */
    

    // 예/아니오 버튼 이벤트 핸들러 설정
    document.addEventListener('click', function(event) {
        //var x = event.clientX;
        //var y = event.clientY;
        var x = event.pageX;
        var y = event.pageY;
        if (x >= start_minX && x <= start_maxX && y >= start_minY && y <= start_maxY) {
            location.href='event_menu.html';
        } 

    });
});
