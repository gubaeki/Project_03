document.addEventListener('click', function(event) {
    var moving_tiger = document.getElementById('moving_tiger');
    var x = event.clientX;
    var y = event.clientY;

    var centerx = x - 29;
    var centery = y - 32;
    
    moving_tiger.style.left = centerx + 'px';
    moving_tiger.style.top = centery + 'px';
});
