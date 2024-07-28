const touchAreaBanner = document.getElementById('banner3');
const attack_icon = document.getElementById('attack_icon');
const my_choice_text = document.getElementById('my_choice_text');
const enemy_choice_text = document.getElementById('enemy_choice_text');

const healthbar_enemy1 = document.getElementById('healthbar_enemy1')
const healthbar_enemy2 = document.getElementById('healthbar_enemy2')
const healthbar_enemy3 = document.getElementById('healthbar_enemy3')
const healthbar_me1 = document.getElementById('healthbar_me1')
const healthbar_me2 = document.getElementById('healthbar_me2')
const healthbar_me3 = document.getElementById('healthbar_me3')

const blackmssk = document.getElementById('blackmask');
const waiting_fencing = document.getElementById('waiting_fencing');
const gameover = document.getElementById('gameover');
const win = document.getElementById('win');

const me = document.getElementById('me');
const enemy = document.getElementById('enemy');



//blackmssk.style.display = 'none';

let touchCount = 0;

let mychoice = 3; // 3 상단, 2 중단, 1 하단으로 정의
let enemychoice = 3;

let mydamage = 0; // damage 3이상 누적되면 게임오버
let enemydamage = 0;

let priority = 'enemy'; // 공격우선권
let game_finish = 0;


function attack_high() {
    mychoice = 3;
    if(priority=='me'){
        my_choice_text.src ="images/attack_high.png";
        me.style.left = 10 + '%';
    }else{
        my_choice_text.src ="images/defense_high.png";
        enemy.style.left = 31 + '%';
    }
    setTimeout(function(){
        attack_result();
    }, 1500);
}
function attack_middle() {
    mychoice = 2;
    if(priority=='me'){
        my_choice_text.src ="images/attack_middle.png";
        me.style.left = 10 + '%';
    }else{
        my_choice_text.src ="images/defense_middle.png";
        enemy.style.left = 31 + '%';
    }
    setTimeout(function(){
        attack_result();
    }, 1500);
}
function attack_low() {
    mychoice = 1;
    if(priority=='me'){
        my_choice_text.src ="images/attack_low.png";
        me.style.left = 10 + '%';
    }else{
        my_choice_text.src ="images/defense_low.png";
        enemy.style.left = 31 + '%';
    }
    setTimeout(function(){
        attack_result();
    }, 1500);
}

function set_position(){
    me.src="images/me.gif";
    enemy.src="images/enemy.gif";
    me.style.left = 0 + '%';
    enemy.style.left = 41 + '%';
    my_choice_text.style.display = 'none';
    enemy_choice_text.style.display = 'none';
}



//공격/방어 결과확인 함수
function attack_result() {

    // 상대방 공격 랜덤선택(1~3)
    enemychoice = Math.floor(Math.random()*3) + 1;
    if(enemychoice === 3){
        if(priority=='enemy'){
            enemy_choice_text.src ="images/attack_high.png";
        }else{
            enemy_choice_text.src ="images/defense_high.png";
        }
    }else if(enemychoice === 2){
        if(priority=='enemy'){
            enemy_choice_text.src ="images/attack_middle.png";
        }else{
            enemy_choice_text.src ="images/defense_middle.png";
        }
    }else{
        if(priority=='enemy'){
            enemy_choice_text.src ="images/attack_low.png";
        }else{
            enemy_choice_text.src ="images/defense_low.png";
        }
    }

    my_choice_text.style.display = 'block';
    enemy_choice_text.style.display = 'block';

    //양쪽 선택이 같을 경우(공격실패, 방어성공)
    if(mychoice === enemychoice){
        //공격우선권이 나에게 있으면
        if(priority == 'me'){
            //나:공격 이미지, 상대방:방어성공 이미지 표출
            me.src="images/me_attack_action.png";
            enemy.src="images/enemy_defense_action.png";

            priority = 'enemy'; // 우선권 넘김
            setTimeout(function(){
                set_position();
                attack_icon.style.left = 75 + '%';
            },1500);
            
        } else{ //공격우선권이 상대방에게 있으면
            //나:방어성공 이미지, 상대방:공격 이미지 표출
            me.src="images/me_defense_action.png";
            enemy.src="images/enemy_attack_action.png";        

            priority = 'me'; // 우선권 가져오기
            setTimeout(function(){
                set_position();
                attack_icon.style.left = 13 + '%';
            },1500);
            
        }
    }else{ //양쪽 선택이 다를경우(공격성공, 방어실패)
            //공격우선권이 나에게 있으면
            if(priority == 'me'){
                //나:공격 이미지, 상대방:데미지 이미지 표출
                me.src="images/me_attack_action.png";
                enemy.src="images/enemy_damaged_action.png";
                //상대방 게이지 깎기
                switch(enemydamage){
                    case 0:
                        healthbar_enemy3.style.backgroundColor = 'rgb(0, 0, 0)';
                        break;
                    case 1:
                        healthbar_enemy2.style.backgroundColor = 'rgb(0, 0, 0)';
                        break;
                    case 2:
                        healthbar_enemy1.style.backgroundColor = 'rgb(0, 0, 0)';
                        //승리 이미지 표출
                        blackmssk.style.display = 'block';
                        win.style.display = 'block';
                        gameover.style.display = 'none';
                        touchCount = 0;
                        game_finish = 1;
                        break;
                }
                enemydamage++;
                priority = 'enemy'; // 우선권 넘김
                setTimeout(function(){
                    set_position();
                    attack_icon.style.left = 75 + '%';
                },1500);
                
            } else{ //공격우선권이 상대방에게 있으면
                //나:데미지 이미지, 상대방:공격 이미지 표출
                me.src="images/me_damaged_action.png";
                enemy.src="images/enemy_attack_action.png";
                //내 게이지 깎기
                switch(mydamage){
                    case 0:
                        healthbar_me3.style.backgroundColor = 'rgb(0, 0, 0)';
                        break;
                    case 1:
                        healthbar_me2.style.backgroundColor = 'rgb(0, 0, 0)';
                        break;
                    case 2:
                        healthbar_me1.style.backgroundColor = 'rgb(0, 0, 0)';
                        //패배이미지 표출
                        blackmssk.style.display = 'block';
                        gameover.style.display = 'block';
                        win.style.display = 'none';
                        touchCount = 0;
                        game_finish = 1;
                        break;
                }
                mydamage++;
                priority = 'me'; // 우선권 가져오기
                setTimeout(function(){
                    set_position();
                    attack_icon.style.left = 13 + '%';
                },1500);
                
            }
    }
}


blackmssk.addEventListener('touchstart', () => {
            
    if(touchCount===0){
        if(game_finish === 1){
            restart();
        }else{
            // 첫 터치에 마스킹 지우기
            blackmssk.style.display = 'none';
            waiting_fencing.style.display = 'none';
            //gameover.style.display = 'none';
        }
    }
});

//초기화
function restart() {

blackmssk.style.display = 'block';
waiting_fencing.style.display = 'block';
gameover.style.display = 'none';
win.style.display = 'none';
my_choice_text.style.display = 'none';
enemy_choice_text.style.display = 'none';

mychoice = 3; // 3 상단, 2 중단, 1 하단으로 정의
enemychoice = 3;
mydamage = 0; 
enemydamage = 0;
priority = 'enemy'; // 공격우선권
healthbar_enemy1.style.backgroundColor = 'rgb(255, 0, 0)';
healthbar_enemy2.style.backgroundColor = 'rgb(255, 0, 0)';
healthbar_enemy3.style.backgroundColor = 'rgb(255, 0, 0)';
healthbar_me1.style.backgroundColor = 'rgb(255, 0, 0)';
healthbar_me2.style.backgroundColor = 'rgb(255, 0, 0)';
healthbar_me3.style.backgroundColor = 'rgb(255, 0, 0)';
me.src="images/me.gif";
enemy.src="images/enemy.gif";
me.style.left = 0 + '%';
enemy.style.left = 41 + '%';
touchCount = 0;
game_finish = 0;


}