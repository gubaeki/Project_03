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
        
        // 특정 범위 정의 (예: x 100-200, y 100-200)
        var minX = 100, maxX = 2000, minY = 100, maxY = 2000;

        // 범위 안에 있는지 검사
        if (gifRect.left >= minX && gifRect.right <= maxX && gifRect.top >= minY && gifRect.bottom <= maxY) {
            alert(`GIF가 특정 범위 안에 있습니다!\n현재 좌표: (${gifRect.left.toFixed(2)}, ${gifRect.top.toFixed(2)})`);
        }
    }, 2100); // 600ms 후 검사

    
});
