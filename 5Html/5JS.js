//операторы
const display = document.querySelector('#display');
let experssion = '0';

document.querySelector('.buttons').addEventListener('click', function(e) {
    if (!e.target.tagName === 'BUTTON') return;

    const value = e.target.textContent.trim();

    if (/[0-9.]/.test(value)) {
        if (experssion === '0' && value !== '.') {
            experssion = value;
        }
        else {
            experssion += value;
        }
    }

    else if ('+-*/'.includes(value)) {
        const lastChar = experssion.slice(-1);
        if ('+-*/'.includes(lastChar)) {
            experssion = experssion.slice(0, -1) + value;
        }
        else {
            experssion += value;
        }
    }

    display.value = experssion;
});

//Вывод
const equalsBtn = document.querySelector('#equals');

equalsBtn.addEventListener('click', function() {

    try {
        const result = eval(experssion);

        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Ошибка';
            experssion = '';
        }
        else {
            display.value = result;
            experssion = result.toString();
        }

        console.log(`${experssion} = ${result}`);
    }
    catch (error) {
        display.value = 'Ошибка';
        experssion = '';
        console.error('Ошибка вычисления: ', error);
    }
});

//Удаление
const clearBtn = document.querySelector('.clear');

clearBtn.addEventListener('click', function() {
    experssion = '0';
    display.value = '0';
});

//Обработка ошибок

equalsBtn.addEventListener('click', function() {

    try {
        const result = eval(experssion);

        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Ошибка';
            console.log('Ошибка вычисления: результат не является числом');
        }
        else {
            display.value = result;
            experssion = result.toString();
            console.log(`${experssion} = ${result}`)
        }

    }
    catch (error) {
        display.value = 'Ошибка';
        experssion = '';
        console.error('Ошибка в выражении: ', error);
    }
});

//Поддержка клавиатуры
document.addEventListener('keydown', function(e) {
    if (document.activeElement === display) return;

    const key = e.key;

    if (/[0-9]/.test(key)) {
        this.appendToExpression(key);
    }

    else if (['+', '-', '*', '/'].includes(key)) {
        appendToExpression(key);
    }
    else if (key === '.') {
        appendToExpression('.')
    }

    else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        equalsBtn.click();
    }

    else if (key === 'Backspace') {
        e.preventDefault();
        if (experssion.length > 1) {
            experssion = experssion.slice(0, -1);
        }
        else {
            experssion = '0';
        }
        display.value = experssion;
    }

    else if (ket === 'Escape' || key.toLowerCase() === "c") {
        e.preventDefault();
        experssion = '0';
        display.value = '0';
    }
});