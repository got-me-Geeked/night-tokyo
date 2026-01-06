"using strict";

let ColorsUsage = new Set();

function getRandomPastelColor() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30 + 20); // 20-50%
    const l = Math.floor(Math.random() * 20 + 70); // 70-90%
    
    return {
        background: `hsl(${h}, ${s}%, ${l}%)`,
        text: `hsl(${h}, ${s + 20}%, ${l - 40}%)`
    };
}

function dragStart(e) {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
     
    
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.setData("offsetX", offsetX);
    e.dataTransfer.setData("offsetY", offsetY);
    e.target.style.zIndex = '1000';
}

function dragEnter(e) {
    e.preventDefault();
    return true;
}
function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function dragDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    let element = document.getElementById(data);


    const targetBlock = e.currentTarget.id;
    
    if (targetBlock === 'block2') {
        // Перетаскиваем в block2
        moveToBlock2(element, e);
    } else if (targetBlock === 'block3') {
        // Возвращаем в block3
        moveToBlock3(element, e.currentTarget);
    }

    
}

function moveToBlock3(element, targetBlock) {
    
    element.style.position = 'static';
    element.style.backgroundColor = 'darkgrey';
    element.style.color = 'black';
    element.onclick = function() {};
    targetBlock.appendChild(element);

    const Pull = Array.from(document.querySelectorAll('#block3 > div'));
    Pull.sort((a, b) => {
        let aLet = a.textContent.split(' ')[0][0];
        let aNum = parseInt(a.textContent.split(' ')[0][1]);
        let bLet = b.textContent.split(' ')[0][0];
        let bNum = parseInt(b.textContent.split(' ')[0][1]);

        if (aLet > bLet) {
            return 1;
        }
        if (aLet < bLet) {
            return -1;
        }
        if (aNum < bNum) {
            return -1;
        }
        if (aNum > bNum) {
            return 1;
        }
        return 0;
    });

    const block3 = document.getElementById('block3');
    block3.innerHTML = '';
    Pull.forEach(element => block3.appendChild(element));
}

function moveToBlock2(element, e) {
    const offsetX = parseFloat(e.dataTransfer.getData("offsetX"));
    const offsetY = parseFloat(e.dataTransfer.getData("offsetY"));
    const blockRect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - blockRect.left - offsetX;
    const y = e.clientY - blockRect.top - offsetY;

    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const containerWidth = blockRect.width;
    const containerHeight = blockRect.height;
    const halfWidth = elementWidth / 2;
    const halfHeight = elementHeight / 2

    
    if (x < -halfWidth) {
        x = -halfWidth; 
    } else if (x > containerWidth - halfWidth) {
        x = containerWidth - halfWidth;
    }
    
    if (y < -halfHeight) {
        y = -halfHeight; 
    } else if (y > containerHeight - halfHeight) {
        y = containerHeight - halfHeight; 
    }

    // Устанавливаем абсолютное позиционирование
    element.style.zIndex = '10';
    element.style.position = 'absolute';
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.margin = '0';
    let colors = getRandomPastelColor();

    //установка неиспользуемого цвета
    while (ColorsUsage.has({background: colors.background, 
        text: colors.text})) {
        colors = getRandomPastelColor();
    }
    element.style.backgroundColor = colors.background;
    element.style.color = colors.text;
    ColorsUsage.add({background: colors.background, 
        text: colors.text});

    element.onclick = function() {showWordInRedBlock(this); };

    e.currentTarget.appendChild(element);
}

function showWordInRedBlock(element) {
    const parent = document.getElementById('show');
    const word = element.textContent.split(' ')[1];
    
    // Создаем элемент для слова
    const wordElement = document.createElement('span');

    wordElement.textContent = word + ' ';
    wordElement.style.color = element.style.color;
    wordElement.style.padding = '0px';
    wordElement.style.margin = '0px';
    
    parent.appendChild(wordElement);
}

function TextDivision() {
    const text = document.getElementById('inputData').value;
    //создание массива
    // лес - бочка - 20 - бык - крик - 3 - Бок - бОк

    const textElems = text.split('-');
    for (let i = 0; i < textElems.length; i++) {
        textElems[i] = textElems[i].trim();
    }

    textElems.sort((a, b) => {
        const aIsNumber = !isNaN(a) && !isNaN(parseFloat(a));
        const bIsNumber = !isNaN(b) && !isNaN(parseFloat(b));
        const aIsLowercase = a === a.toLowerCase();
        const bIsLowercase = b === b.toLowerCase();
    
        // Числа всегда в конце
        if (aIsNumber && bIsNumber) return a.localeCompare(b, undefined, {numeric: true});
        if (aIsNumber) return 1;  
        if (bIsNumber) return -1; 
    
        // Буквенные: строчные перед заглавными
        if (aIsLowercase && bIsLowercase) return a.localeCompare(b);
        if (!aIsLowercase && !bIsLowercase) return (-a.localeCompare(b));
        return aIsLowercase ? -1 : 1;
    });

    //создание ассоциативного массива
    const assocArray = {};
    let aCounter =1;
    let bCounter =1;
    let nCounter = 1;
    let flag = false;
    for (let i=0; i < textElems.length; i++){
        const element = textElems[i];
        const isNumber = !isNaN(parseFloat(element)) && isFinite(element);
        const isLowercase = element === element.toLowerCase();

        if (isNumber) {
            assocArray['n' + nCounter.toString()] = element;
            nCounter++;
        } else if (isLowercase) {
            assocArray['a' + aCounter.toString()] = element;
            aCounter++;
        } else {
            assocArray['b' + bCounter.toString()] = element;
            bCounter++;
        }
    }

    /*for (let key in assocArray) {
        alert(`Ключ: ${key}, Значение: ${assocArray[key]}`);
    }*/

    return assocArray;
}

function CreationSet(assoc){
    const parent = document.getElementById('block3');
    let counter = 1;

    for (let key in assoc) {
        const newTag = document.createElement('div');
        const elementId = `dragElement${counter}`;
        newTag.id = elementId;

        newTag.setAttribute('draggable', 'true');
        newTag.setAttribute('ondragstart', 'dragStart(event)');
        
        newTag.style.width = '150px';
        newTag.style.height = '60px';
        newTag.style.padding = '0px';
        newTag.style.border = 'none';
        newTag.style.textAlign = 'center';
        newTag.style.lineHeight = '60px';
        newTag.style.overflowX = 'hidden';
        newTag.style.backgroundColor = 'darkgrey';
        newTag.style.borderRadius = '120px / 55px';
        
        newTag.textContent = `${key} ${assoc[key]}`;

        parent.appendChild(newTag);
        counter++;
    }
}

function Process(){
    const assocArray = TextDivision();
    CreationSet(assocArray);
}