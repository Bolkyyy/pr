// ==================== ПОЛУЧАЕМ ЭЛЕМЕНТЫ ====================
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const filterRadios = document.querySelectorAll('input[name="filter"]');
const taskCounter = document.getElementById('taskCounter');
const sortButton = document.getElementById('sortButton');

// Ключ для сохранения в localStorage
const STORAGE_KEY = 'tasks';


// ==================== ЧАСТЬ 1: ДОБАВЛЕНИЕ ЗАДАЧ (по кнопке или Enter) ====================
/**
 * Что это? Механизм создания новой задачи в списке
 * Как работает: берёт текст из поля, создаёт элемент, добавляет в список, очищает поле
 */

// Функция добавления новой задачи
function addTask() {
    // Получаем текст из поля, убираем лишние пробелы
    const taskText = taskInput.value.trim();
    
    // Если текст пустой - не добавляем задачу
    if (taskText === '') return;

    // Создаём новый элемент задачи (по умолчанию не выполнена)
    createTaskElement(taskText, false);
    
    // Очищаем поле ввода
    taskInput.value = '';
    
    // Возвращаем фокус в поле для быстрого добавления следующих задач
    taskInput.focus();
    
    // Сохраняем обновлённый список в localStorage
    saveTasks();
    
    // Обновляем счётчик задач
    updateCounter();
    
    // Применяем текущий фильтр к новому элементу
    applyFilter();
}

// Обработчик клика по кнопке "Добавить"
addButton.addEventListener('click', addTask);

// Обработчик нажатия клавиш в поле ввода
taskInput.addEventListener('keydown', function(event) {
    // Проверяем, была ли нажата клавиша Enter
    if (event.key === 'Enter') {
        event.preventDefault(); // Предотвращаем возможную отправку формы
        addTask(); // Добавляем задачу
    }
});


// ==================== ЧАСТИ 2 и 3: УДАЛЕНИЕ и ОТМЕТКА ВЫПОЛНЕНИЯ ====================
/**
 * Часть 2 - Удаление задач: при клике на кнопку "Удалить" удаляется вся задача
 * Часть 3 - Отметка выполнения: при клике на чекбокс переключается класс completed
 * 
 * Используется делегирование событий - один обработчик на весь контейнер списка
 */

taskList.addEventListener('click', function(event) {
    const target = event.target;

    // ===== ЧАСТЬ 2: УДАЛЕНИЕ ЗАДАЧ ПО КЛИКУ НА КРЕСТИК =====
    // Проверяем, что кликнули на кнопку с текстом "Удалить"
    if (target.tagName === 'BUTTON' && target.textContent === 'Удалить') {
        // Находим родительский элемент li (задачу)
        const li = target.closest('li');
        if (li) {
            li.remove(); // Удаляем задачу из DOM
            saveTasks(); // Сохраняем изменения
            updateCounter(); // Обновляем счётчик
            applyFilter(); // Переприменяем фильтр
        }
        return; // Завершаем обработку
    }

    // ===== ЧАСТЬ 3: ОТМЕТКА ЗАДАЧИ КАК ЗАВЕРШЁННОЙ (TOGGLE КЛАССА) =====
    // Проверяем, что кликнули на чекбокс
    if (target.type === 'checkbox') {
        // Находим родительский элемент li
        const li = target.closest('li');
        if (li) {
            // Переключаем класс completed в зависимости от состояния чекбокса
            // classList.toggle с условием: добавить класс если checked=true, убрать если false
            li.classList.toggle('completed', target.checked);
            
            saveTasks(); // Сохраняем изменение статуса
            updateCounter(); // Обновляем счётчик активных задач
            applyFilter(); // Применяем фильтр (задача может скрыться)
        }
        return;
    }
});


// ==================== ЧАСТЬ 4: ФИЛЬТРЫ (показ всех / активных / завершённых) ====================
/**
 * Что это? Кнопки фильтрации, которые скрывают/показывают задачи по статусу
 * Как работает: перебирает все задачи и меняет их display в зависимости от наличия класса completed
 */

// Функция применения выбранного фильтра
function applyFilter() {
    // Получаем значение выбранной радио-кнопки (all, active, completed)
    const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
    
    // Получаем все задачи в списке
    const allTasks = document.querySelectorAll('#taskList li');

    // Перебираем каждую задачу
    allTasks.forEach(li => {
        // Проверяем, есть ли у задачи класс completed (завершена ли она)
        const isCompleted = li.classList.contains('completed');
        
        // В зависимости от выбранного фильтра показываем или скрываем задачу
        switch (selectedFilter) {
            case 'all': // Фильтр "Все" - показываем все задачи
                li.style.display = 'flex';
                break;
                
            case 'active': // Фильтр "Активные" - показываем только незавершённые
                li.style.display = isCompleted ? 'none' : 'flex';
                break;
                
            case 'completed': // Фильтр "Завершённые" - показываем только завершённые
                li.style.display = isCompleted ? 'flex' : 'none';
                break;
        }
    });
}

// Добавляем обработчики на все радио-кнопки фильтра
filterRadios.forEach(radio => {
    radio.addEventListener('change', applyFilter); // При изменении применяем фильтр
});


// ==================== ЧАСТЬ 5: СОХРАНЕНИЕ ЗАДАЧ В LOCALSTORAGE ====================
/**
 * Что это? Сохранение списка в браузере, чтобы после перезагрузки задачи остались
 * Как работает: собирает данные всех задач в массив, превращает в JSON и сохраняет
 */

// Функция сохранения задач в localStorage
function saveTasks() {
    const tasks = []; // Создаём пустой массив для хранения задач
    
    // Перебираем все элементы li в списке
    document.querySelectorAll('#taskList li').forEach(li => {
        // Получаем текст задачи из тега label
        const text = li.querySelector('label').textContent;
        
        // Получаем статус выполнения (есть ли класс completed)
        const completed = li.classList.contains('completed');
        
        // Добавляем объект с данными задачи в массив
        tasks.push({ text, completed });
    });
    
    // Превращаем массив в JSON-строку и сохраняем в localStorage по ключу
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Функция загрузки задач из localStorage при старте страницы
function loadTasks() {
    // Пытаемся получить сохранённые данные из localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
        // Если данные есть - парсим JSON обратно в массив объектов
        try {
            const tasks = JSON.parse(saved);
            
            // Для каждого объекта из массива создаём задачу
            tasks.forEach(task => {
                createTaskElement(task.text, task.completed);
            });
        } catch (e) {
            console.error('Ошибка загрузки задач', e);
        }
    } else {
        // Если в localStorage ничего нет - создаём демо-задачи для примера
        createTaskElement('Купить молоко', false);
        createTaskElement('Стать миллионером', false);
        createTaskElement('Купить еще молока', true); // эта задача завершена
        saveTasks(); // Сразу сохраняем демо-задачи
    }
    
    updateCounter(); // Обновляем счётчик после загрузки
    applyFilter(); // Применяем фильтр после загрузки
}


// ==================== ЧАСТЬ 6: СОРТИРОВКА ПО АЛФАВИТУ и СЧЁТЧИК ====================
/**
 * Сортировка: переставляет задачи в алфавитном порядке
 * Счётчик: показывает общее количество задач и количество активных
 */

// ===== СОРТИРОВКА ПО АЛФАВИТУ =====
function sortTasks() {
    // Преобразуем коллекцию детей в массив для сортировки
    const items = Array.from(taskList.children);
    
    // Сортируем массив по тексту задачи (с учётом локали)
    items.sort((a, b) => {
        // Получаем текст задач из label и приводим к нижнему регистру
        const textA = a.querySelector('label').textContent.toLowerCase();
        const textB = b.querySelector('label').textContent.toLowerCase();
        
        // localeCompare для правильной сортировки строк с учётом алфавита
        return textA.localeCompare(textB);
    });

    // Очищаем список
    taskList.innerHTML = '';
    
    // Добавляем отсортированные элементы обратно
    items.forEach(item => taskList.appendChild(item));
    
    // Сохраняем новый порядок в localStorage
    saveTasks();
    
    // Применяем текущий фильтр (чтобы скрытые задачи остались скрытыми)
    applyFilter();
}

// Обработчик клика на кнопку сортировки
sortButton.addEventListener('click', sortTasks);

// ===== СЧЁТЧИК АКТИВНЫХ ЗАДАЧ =====
function updateCounter() {
    // Общее количество задач
    const total = taskList.children.length;
    
    // Количество активных задач (без класса completed)
    const activeCount = document.querySelectorAll('#taskList li:not(.completed)').length;
    
    // Обновляем текст счётчика
    taskCounter.textContent = `Всего задач: ${total} (активных: ${activeCount})`;
}


// ==================== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: СОЗДАНИЕ ЭЛЕМЕНТА ЗАДАЧИ ====================
/**
 * Универсальная функция для создания DOM-элемента задачи
 * Используется при добавлении новой задачи и при загрузке из localStorage
 */
function createTaskElement(text, isCompleted = false) {
    // Создаём элемент li (контейнер задачи)
    const li = document.createElement('li');
    
    // Если задача завершена - добавляем соответствующий класс
    if (isCompleted) {
        li.classList.add('completed');
    }

    // Создаём чекбокс
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted; // Устанавливаем состояние чекбокса

    // Создаём label с текстом задачи
    const label = document.createElement('label');
    label.textContent = text;

    // Создаём кнопку удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';

    // Собираем все элементы в li
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);

    // Добавляем готовую задачу в общий список
    taskList.appendChild(li);
    
    return li; // Возвращаем созданный элемент на случай, если понадобится
}


// ==================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ====================
// Очищаем список от возможных демо-элементов в HTML
taskList.innerHTML = '';

// Загружаем задачи из localStorage (или создаём демо)
loadTasks();


// ==================== ДОПОЛНИТЕЛЬНО: НАБЛЮДЕНИЕ ЗА ИЗМЕНЕНИЯМИ ====================
/**
 * Необязательно, но полезно: можно использовать MutationObserver для авто-сохранения
 * Но в нашем коде мы вызываем saveTasks() вручную после каждого действия
 */