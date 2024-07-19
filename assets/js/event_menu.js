document.addEventListener('click', function(event) {
    var moving_tiger = document.getElementById('moving_tiger');
    var x = event.clientX;
    var y = event.clientY;
    
    moving_tiger.style.left = x + 'px';
    moving_tiger.style.top = y + 'px';
});
