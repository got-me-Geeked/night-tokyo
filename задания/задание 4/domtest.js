"using strict";
class QuizUnit {
    constructor(question, answers, correct_ans, description) {
        if (typeof question !== 'string'){
            throw new Error('Вопрос должен быть строкой');
        }
        if (!Array.isArray(answers)){
            throw new Error('Пул ответов должен быть массивом');
        }
        if (typeof correct_ans !== 'number' || correct_ans < 1 || correct_ans > answers.length) {
            throw new Error('Номер правильного ответа должен быть от 1 до длины пула вопросов');
        }
        if (typeof description !== 'string'){
            throw new Error('Описание правильного ответа должен быть строкой');
        }
        this._question = question;
        this._answers = answers;
        this._correct_ans = correct_ans;
        this._description = description;
    }

    get qst() {
        return this._question;
    }
    get ans() {
        return this._answers;
    }
    get corans(){
        return this._correct_ans;
    }
    get desc(){
        return this._description;
    }
}

function creationQuizUnits(){
const qu1 = new QuizUnit(
    'А когда с человеком может произойти дрожемент?',
    ['Когда он влюбляется', 'Когда он идет шопиться', 
    'Когда он слышит смешную шутку', 'Когда он боится, пугается'],
    4,
    'Лексема «дрожемент» имплицирует состояние крайнего '+ 
    'напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят».'
);
const qu2 = new QuizUnit(
    'Говорят, Антон заовнил всех. Это еще как понимать?',
    ['Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?', 
        'Антон очень надоедливый и въедливый человек, всех задолбал', 
        'Молодец, Антон, всех победил!', 
        'Нет ничего плохого в том, что Антон тщательно выбирает себе друзей'],
    3,
    'Термин «заовнить» заимствован из английского языка, '+
    'он происходит от слова own и переводится как «победить», «завладеть», «получить».'
);
const qu3 = new QuizUnit(
    'А фразу «заскамить мамонта» как понимать?',
    ['Разозлить кого-то из родителей', 
        'Увлекаться археологией', 
        'Развести недотепу на деньги', 
        'Оскорбить пожилого человека'],
    3,
    'Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? '+
    'Потому что мошенники часто выбирают в жертвы пожилых людей'+
    ' (древних, как мамонты), которых легко обвести вокруг пальца.'
);
const qu4 = new QuizUnit(
    'Кто такие бефефе?',
    ['Вши?', 
        'Милые котики, такие милые, что бефефе', 
        'Лучшие друзья', 
        'Люди, которые не держат слово'],
    3,
    'Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever.'
);
return [qu1, qu2, qu3, qu4];

}

function randomNum(limit){ //limit должен быть больше 0, нужно 1-4 и 1-количество вопросов
    return Math.floor(Math.random()*limit)+1;
}


document.addEventListener('DOMContentLoaded', function() {
    const quiz = creationQuizUnits();
    let counterRightAnswers = 0;
    const history = [];
    //первый индекс - селектор вопроса, второй - false/true в зависимости от правильного ответа
    for (let i = 0; i < quiz.length; i++) {
        history[i] = [-1, -1];
    }

    let used_selectors_quiz = new Set();
    let selector = randomNum(quiz.length);
    used_selectors_quiz.add(selector);
    showQuestion(selector, 1);

    function showQuestion(selector, counter){
        
        //заполнение common-block
        let selectedQU = quiz[selector-1];
        history[counter-1][0] = selector-1;
        const tagQuestion = document.getElementById('Question');
        tagQuestion.textContent = `${counter}. ` + selectedQU.qst;
    
        const answerButtons = document.querySelectorAll('.content button');
        
        //Распределение ответов
        let used_selectors = new Set();
        let newSelector;
        for (let i = 0; i < answerButtons.length; i++){
            do {
                newSelector = randomNum(selectedQU.ans.length);
            } while (used_selectors.has(newSelector));
        
            answerButtons[i].textContent = selectedQU.ans[newSelector-1];
            used_selectors.add(newSelector);
        }

        // Добавляем event
        answerButtons.forEach(button => {
            button.onclick = function() {
                // обработка ответа
                const clickedButton = this;
                const clickedAnswer = this.textContent;
                const addIcon = document.querySelector('p');
                const addDesc = document.getElementById('desc');

                //отмена наведения
                answerButtons.forEach(button => {
                    button.style.pointerEvents = 'none';
                });

                //обработка нажатого ответа
                clickedButton.style.setProperty('transition', 'transform 3s ease, opacity 3s ease-in-out');
                clickedButton.style.setProperty('transform', 'scale(1.1)');
                clickedButton.style.opacity = '1';

                
                setTimeout(()=>{
                        clickedButton.style.setProperty('transform', 'scale(1)');
                        clickedButton.style.opacity='0';
                        addDesc.style.opacity = '0';
                }, 12000);

                setTimeout(()=>{
                        answerButtons.forEach(button => {
                            if(button != clickedButton){
                                button.style.setProperty('transition', 'transform 3s ease');
                                button.style.setProperty('transform', 'translateX(150%)');
                            }
                        });
                }, 2000);

                setTimeout(()=>{
                        clickedButton.style.transition = '';
                        clickedButton.style.opacity='1';
                        answerButtons.forEach(button => {
                            if(button != clickedButton){
                                button.style.transition = '';
                                button.style.transform = '';
                            }
                        });
                }, 15000);

                //если ответ совпадает с правильным, появление маркера с задержкой
                if (clickedAnswer == selectedQU.ans[selectedQU.corans-1]){
                    history[counter-1][1] = true;
                    counterRightAnswers += 1;
                    addDesc.textContent = selectedQU.desc;
                    setTimeout(()=>{
                        addDesc.style.opacity = '1';
                    }, 3000);

                    setTimeout(()=>{addIcon.classList.add('correct-marker');}, 7000);
                    
                    setTimeout(()=>{
                        addIcon.classList.remove('correct-marker');
                    }, 15000);
                } else {
                    history[counter-1][1] = false;
                    setTimeout(()=>{
                        addIcon.classList.add('incorrect-marker');
                    }, 5000);

                    setTimeout(()=>{
                        addIcon.classList.remove('incorrect-marker');
                    }, 15000);
                }
                
                
                if (quiz.length != used_selectors_quiz.size){
                     //выбор селектора вопроса
                    do {
                        selector = randomNum(quiz.length); //всегда на 1 больше
                    } while (used_selectors_quiz.has(selector));
                    used_selectors_quiz.add(selector);
                    setTimeout(()=> {
                        answerButtons.forEach(button => {
                            button.style.pointerEvents = 'auto';
                        });
                        showQuestion(selector, counter+1);
                    }, 15000);
                } else {
                    setTimeout(()=> {
                        answerButtons.forEach(button => {
                            button.style.pointerEvents = 'auto';
                        });
                        
                        finishQuiz(counterRightAnswers);
                    }, 15000);
            
                }
               
            };
        });

       
        
    }  
    
    function finishQuiz(counter){
        const QuizResult = document.querySelector('h1');
        QuizResult.textContent = 'Вопросы закончились';

        const tagQuestion = document.getElementById('Question');
        tagQuestion.textContent = `Правильных ответов: ${counter}/${quiz.length}`;
        
        const answerButtons = document.querySelectorAll('.content button');

        for(let i = 0; i < answerButtons.length; i++){
            answerButtons[i].textContent = `${i+1}. ${quiz[history[i][0]].qst}`;
            if (history[i][1]){
                answerButtons[i].classList.add('correct-marker');
            }
            else {
                answerButtons[i].classList.add('incorrect-marker');
            }
        }

        answerButtons.forEach(button => {
            button.onclick = function() {
                // обработка ответа
                const clickedButton = this;
                const addDesc = document.getElementById('desc');
                addDesc.style.opacity = '1';
                qnum = parseInt(this.textContent.substring(0, 1));
                addDesc.textContent = `Правильный ответ: 
                ${quiz[history[qnum-1][0]].ans[quiz[history[qnum-1][0]].corans-1]}`;
            }
        });
    }

});