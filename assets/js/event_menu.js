document.addEventListener('click', function(event) {
    var gif = document.getElementById('gif');
    var x = event.clientX;
    var y = event.clientY;
    
    gif.style.left = x + 'px';
    gif.style.top = y + 'px';
});
