//Проверка паролей 

 const passwordInput = document.querySelector('#password');
 const confirmInput = document.querySelector('#confirm-password');
 const errorElement = document.querySelector('#password-error');

 confirmInput.addEventListener('input', function() {
    const pass = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();

    if (confirm === '' ) {
        errorElement.textContent = '';
    }
    else if (pass != confirm) {
        errorElement.textContent = 'Пароли не сопадают';
    }
    else {
        errorElement.textContent = 'Пароли совпадают';

    }
 });

 passwordInput.addEventListener('input', function() {
    confirmInput.dispatchEvent(new Event('input'));
 });

 // Предотвращение отправки формы на submit при наличии ошибок

const form = document.querySelector('#registration-form');
const passwordError = document.querySelector('#password-error');

form.addEventListener('sumbit', function(event) {

    const hasError = passwordError.textContent.trim() !== '' && 
    !passwordError.textContent.includes('cовпадают');

    if (hasError) {
        event.preventDefault();
        
        alert('Исправьте ошибки перед отправкой!');
        return;
    }

    const formData = new FormData(form);

    const dataObject = Object.fromEntries(formData);

    console.log('Данные формы готовы к отправке:', dataObject);

}) ;


// Добавление маски для даты
const dateInput = document.querySelector('#birthdate');

dateInput.addEventListener('input', function() {

    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 8) {
        value = value.slice(0, 8);
    }

    let formatted = '';
    if (value.length > 0) {
        formatted = value.slice(0, 2);
    }
    if (value.length > 2) {
        formatted += '.' + value.slice(2, 4);
    }
    if (value.length > 4) {
        formatted += '.' + value.slice(4);
    }

    e.target.value = formatted;
});

//Автозаполнение email из localStorage 

const emailInput = document.querySelector('#email');

const savedEmail = localStorage.getItem('savedEmail');

if(savedEmail) {
    emailInput.value = savedEmail;
}

emailInput.addEventListener('blur', function(){
    const currentValue = emailInput.value.trim();

    if (currentValue) {
        localStorage.setItem('savedEmail', currentValue);
    }
    else {
        localStorage.removeItem('savedEmail');
    }
});

//Логирование данных в console

const formData = new FormData(form);

console.log('Данные формы:', Object.fromEntries(formData));

console.log('Данные формы (FormData):', formData);