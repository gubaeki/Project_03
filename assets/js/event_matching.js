
//배경 세팅
const blackmask = document.getElementById('blackmask'); blackmask.style.display ='none';
const win = document.getElementById('win');
const warning = document.getElementById('warning');
const gameBoard = document.getElementById('game-board')
const boardRect = gameBoard.getBoundingClientRect();
const cardClass = document.querySelectorAll('.card');
let newmargins = (boardRect.width - 350) / 12; // game-board 내에 위치한 카드가 한 행에 6개씩 나오도록 margin을 계산(단일카드 넓이 50px 기준)
let isSmallWindow = false;
if(boardRect.width <= 350){
    blackmask.style.display ='block';
    warning.style.display = 'block';
    isSmallWindow = true;
}

// 점수 세팅
const scoreRect = document.getElementById('score');
const highscoreRect = document.getElementById('highscore')
let score = 0;
let highscore = 0;
let roundFinish = false;

// 버튼 관련 세팅
const start_bt = document.getElementById('start_bt');
const hint_bt = document.getElementById('hint_bt');
let remainingTime = 9;
let timer = null;
let isStart = false; // 게임이 진행중인지 확인
let isHintCheck = false;
hint_bt.disabled = true; // 힌트 한번 사용시 잠김여부 설정

// 애니메이션 세팅
const startTimer = document.getElementById('startTimer');
const face = document.getElementById('face');


//////////////////////////////////////////////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', () => {
    //카드 그룹 정의
    const cardImages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const gameBoard = document.getElementById('game-board');

    // 카드 랜덤 섞기
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 각 카드 마진값 자동 변경
    function updateCardElementMargin(){
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.margin = newmargins + 'px';
        });
    }

    // 카드를 섞고 게임 보드에 추가
    function initializeGame() {
        const shuffledCards = shuffle([...cardImages]);
        shuffledCards.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card', 'flipped'); // 처음 시작 시 뒷면
            card.dataset.image = image;
            gameBoard.appendChild(card);
        });

        updateCardElementMargin(); // 마진 결정


    }


    // 카드 클릭 리스너 추가 함수
    function addCardClickListeners() {
        const cards = document.querySelectorAll('.card');
        let flippedCards = [];
        let matchedCards = [];

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if(!isHintCheck){ // 힌트보기가 아닐때
                    if (flippedCards.length < 2 && !card.classList.contains('front') && !matchedCards.includes(card)) {
                        card.classList.remove('flipped');
                        card.classList.add('front');
                        flippedCards.push(card);
                        if (flippedCards.length === 2) {
                            //카드 두개 오픈 즉시 확인하는 버전
                            checkMatch(flippedCards, matchedCards);
                            //카드 두개 오픈 후 1초 뒤에 확인하는 버전
                            //setTimeout(() => checkMatch(flippedCards, matchedCards), 1000);
                        }
                    }
                }else{ // 힌트보기일때
                    if (!card.classList.contains('front') && !matchedCards.includes(card) && (card.classList.contains('glass'))){
                        card.classList.remove('flipped');
                        card.classList.remove('glass');
                        card.classList.add('front');
                        setTimeout(() => {
                            card.classList.remove('front');
                            card.classList.add('flipped');
                            cards.forEach(card => {
                                if(card.classList.contains('glass')){
                                    card.classList.remove('glass');
                                }
                            });
                        }, 1000);
                        isHintCheck = false;

                    }
                }

            });
                          
        });
    }
    
    
    

    // 카드 매칭 검사 함수
    function checkMatch(flippedCards, matchedCards) {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.image === card2.dataset.image;

        if (isMatch) { //매칭되었을 경우
            score += 30;
            scoreRect.textContent = '현재점수: ' + score + '점';

            startTimer.style.color = 'blue';
            startTimer.textContent = '+30점';
            face.setAttribute('src', 'images/good.gif'); //good 액션으로 변경

            matchedCards.push(card1, card2);

            //24개 카드르 모두 맞추면 게임종료
            if(matchedCards.length===24){ 
                setTimeout(function(){
                    roundFinish = true;
                    if(score >= highscore){
                        highscore = score;
                        highscoreRect.textContent = '최고점수: ' + highscore + '점';
                    }
                    //블랙마스크 띄우기
                    blackmask.style.display = 'block';
                    win.style.display = 'block';
                    
                },1000)
                

            }

        } else {
            score -= 5;
            scoreRect.textContent = '현재점수: ' + score + '점';

            startTimer.style.color = 'red';
            startTimer.textContent = '-5점';
            face.setAttribute('src', 'images/sad.gif'); //sad 액션으로 변경

            setTimeout(() => {
                card1.classList.remove('front');
                card1.classList.add('flipped');
                card2.classList.remove('front');
                card2.classList.add('flipped');
            }, 1000);
            
        }

        flippedCards.length = 0; // 배열 초기화
    }

    // 게임 초기화
    initializeGame();
    
    //'시작하기' 버튼 클릭 시
    
    start_bt.addEventListener('touchstart', (e) => {
        if(isStart){
        }else{
            isStart = true;
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => { // 모든 카드 오픈
                card.classList.remove('flipped');
                card.classList.add('front');
            });
            
            timer = setInterval(function(){ // 카운트다운 시작
                if(remainingTime < 0){
                    startTimer.textContent = '시작!';
                    remainingTime = 9;
                    clearInterval(timer);
                }else{
                    startTimer.textContent = remainingTime + '초';
                    remainingTime -= 1;
                }
                
            }, 1000); //10초
                
            setTimeout(() => { // 시간 종료 시 모든 카드 뒷면으로
                cards.forEach(card => {
                    card.classList.remove('front');
                    card.classList.add('flipped');
                    hint_bt.disabled = false;
                });
                    
            addCardClickListeners(); // 카드 매칭 이벤트 받기 시작
            
            }, 11000);
            
            e.preventDefault();

        }
                
        
    });
    
    

    //'힌트보기' 버튼 클릭 시
    hint_bt.addEventListener('touchstart', (e) => {
        isHintCheck = true;
        hint_bt.disabled = true;

        score -= 15;
        scoreRect.textContent = '현재점수: ' + score + '점';

        startTimer.style.color = 'red';
        startTimer.textContent = '-15점';

        const cards = document.querySelectorAll('.card'); // 돋보기 그림으로 변경
        cards.forEach(card => {
            if(!card.classList.contains('front')){
                //card.classList.remove('flipped');
                card.classList.add('glass');
            }   
            
        });




        e.preventDefault();

        });


    //마스킹 관련 함수
    blackmask.addEventListener('touchstart', () => {
        if(isSmallWindow){
            blackmask.style.display = 'none';
            warning.style.display = 'none';
            isSmallWindow = false;
        }else{
            // 첫 터치에 마스킹 지우기
            blackmask.style.display = 'none';
            win.style.display = 'none';
            restart();
        }
        
           
    });



    function restart(){
        //게임보드 비우기(자식노득 전부 지우기)
        while(gameBoard.firstChild){
            gameBoard.removeChild(gameBoard.firstChild);
        }

        initializeGame();

        score = 0;
        scoreRect.textContent = '현재점수: ' + score + '점';
        roundFinish = false;

        remainingTime = 9;
        timer = null;
        isStart = false;
        isHintCheck = false;
        hint_bt.disabled = true; // 힌트 한번 사용시 잠김여부 설정
        startTimer.style.color = 'black';
        startTimer.textContent = '10초';
        face.setAttribute('src', 'images/hello.gif');

    }


});