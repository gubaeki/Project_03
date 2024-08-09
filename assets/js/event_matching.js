
//배경 세팅
const gameBoard = document.getElementById('game-board')
const boardRect = gameBoard.getBoundingClientRect();
const cardClass = document.querySelectorAll('.card');
let newmargins = (boardRect.width - 350) / 12; // game-board 내에 위치한 카드가 한 행에 6개씩 나오도록 margin을 계산(단일카드 넓이 50px 기준)
if(boardRect.width <= 350){
    console.log('최소화면넓이 불충족');
}

// 점수 세팅
const scoreRect = document.getElementById('score');
const highscoreRect = document.getElementById('highscore')
let score = 0;
let highscore = 0;

// 버튼 관련 세팅
const start_bt = document.getElementById('start_bt');
const hint_bt = document.getElementById('hint_bt');
let remainingTime = 9;
let timer = null;
let isStart = false; // 게임이 진행중인지 확인

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
                if (flippedCards.length < 2 && !card.classList.contains('front') && !matchedCards.includes(card)) {
                    card.classList.remove('flipped');
                    card.classList.add('front');
                    flippedCards.push(card);
                    if (flippedCards.length === 2) {
                        setTimeout(() => checkMatch(flippedCards, matchedCards), 1000);
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

            startTimer.textContent = '정답!';
            face.setAttribute('src', 'images/good.gif'); //good 액션으로 변경

            /* // 라운드 끝일때로 이동시켜야함
            if(score >= highscore){
                highscore = score;
                highscoreRect.textContent = '최고점수: ' + highscore + '점';
            } */
            matchedCards.push(card1, card2);
        } else {
            score -= 5;
            scoreRect.textContent = '현재점수: ' + score + '점';

            startTimer.textContent = '오답!';
            face.setAttribute('src', 'images/sad.gif'); //sad 액션으로 변경

            card1.classList.remove('front');
            card1.classList.add('flipped');
            card2.classList.remove('front');
            card2.classList.add('flipped');
        }

        flippedCards.length = 0; // 배열 초기화
    }

    // 게임 초기화
    initializeGame();


    //'시작하기' 버튼 클릭 시
    if(isStart){
        console.log('동작중');
    }else{
        isStart = true;
        start_bt.addEventListener('touchstart', (e) => {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => { // 모든 카드 오픈
                card.classList.remove('flipped');
                card.classList.add('front');
            });
        
            timer = setInterval(function(){ // 카운트다운 시작
                startTimer.textContent = remainingTime + '초';
                remainingTime -= 1;
                if(remainingTime < 0){
                    remainingTime = 9;
                    clearInterval(timer);
                    }
                }, 1000); //10초
            
            setTimeout(() => { // 시간 종료 시 모든 카드 뒷면으로
                cards.forEach(card => {
                    card.classList.remove('front');
                    card.classList.add('flipped');
                });
                
                addCardClickListeners(); // 카드 매칭 이벤트 받기 시작
        
            }, 10000);
        
            e.preventDefault();
            });
    }
    

    //'힌트보기' 버튼 클릭 시
    hint_bt.addEventListener('touchstart', (e) => {
        console.log('힌트보기');
       
        e.preventDefault();

        });


    function restart(){
        console.log('재시작');

        initializeGame();
        remainingTime = 9;
        isStart = false;
    }


});