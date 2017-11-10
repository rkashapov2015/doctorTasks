"use strict";

const taskList = document.getElementById('taskList');


const taskData = [
    {id: 1, typeDoctor: 'terapevt', priority: 'low', comment: 'Мария!!! Доброе утро!!! У  Доктора Садыковой Альфии Назиповны нет учетки. Педиатр на смене, а учетки нет!!!', userData: {fullname: 'Иван Иванов', phone: '89999999999', polis: '9999999999'}},
    {id: 2, typeDoctor: 'terapevt', priority: 'normal', comment: 'Роза Андреевна Лениногорск пробный звонок от агента-для терапевта', userData: {fullname: 'Андрей Сергеев', phone: '89999999999', polis: '9999999999'}},
    {id: 3, typeDoctor: 'pediatr', priority: 'high', comment: 'Роза Андреевна Лениногорск пробный звонок от агента-для терапевта', userData: {fullname: 'Николай Агафонов', phone: '89999999999', polis: '9999999999'}},
    {id: 4, typeDoctor: 'pediatr', priority: 'normal', comment: 'Роза Андреевна Лениногорск пробный звонок от агента-для терапевта', userData: {fullname: 'Константин Макаров', phone: '89999999999', polis: '9999999999'}},
    {id: 5, typeDoctor: 'pediatr', priority: 'normal', comment: 'Роза Андреевна Лениногорск пробный звонок от агента-для терапевта', userData: {fullname: 'Константин Макаров', phone: '89999999999', polis: '9999999999'}}
];

init();


function createEl(type, className, id) {
    if (!type) {
        return false;
    }
    let element = document.createElement(type);
    if (className) {
        element.className = className;
    }

    if (id) {
        element.setAttribute('id',id);
    }
    return element;
}

function createInput(name, type, className, id) {
    let input = createEl('input', className);
    if (type) {
        input.setAttribute('type', type);
    }
    if (id) {
        input.setAttribute('id', id);
    }
    return input;
}

function createTask(task_id, typeDoctor, userData, priority, description) {
    const doctorTaskBlock = createEl('div', 'doctor-task');
    doctorTaskBlock.dataset.id = task_id;
    var className = '';
    var classPriority = 'priority-normal';
    
    switch(priority) {
        case 'low':
        classPriority = 'priority-low';
        break;
        case 'high':
        classPriority = 'priority-high';
        break;
    }
    className += classPriority;
    switch(typeDoctor) {
        case 'terapevt':
        className += ' prof-terapevt';
        break;
        case 'pediatr':
        className += ' prof-pediatr';
        break;
    }
    doctorTaskBlock.className += ' ' + className;
    const container = createEl('div', 'doctor-task-container');
    const polisBlock = createEl('div', 'doctor-task-polis');
    if (userData.hasOwnProperty('polis')) {
        polisBlock.innerText = userData.polis;
    }
    container.appendChild(polisBlock);

    const phoneBlock = createEl('div', 'doctor-task-phone');
    if (userData.hasOwnProperty('phone')) {
        phoneBlock.innerText = userData.phone;
    }
    container.appendChild(phoneBlock);
    const fullnameBlock = createEl('div', 'doctor-task-fullname');
    if (userData.hasOwnProperty('fullname')) {
        fullnameBlock.innerText = userData.fullname;
    }
    container.appendChild(fullnameBlock);
    
    const commentBlock = createEl('div', 'doctor-task-comment');
    commentBlock.innerText = description;
    container.appendChild(commentBlock);
    const wrapper = createEl('div', 'doctor-task-wrapper');
    wrapper.appendChild(container);
    doctorTaskBlock.appendChild(wrapper);

    const buttonsBlock = createEl('div', 'doctor-task-buttons');
    const buttonGetTask = createEl('button', 'doctor-btn');
    let i = createEl('i', 'fa fa-hand-lizard-o');
    i.setAttribute('aria-hidden', 'true');
    buttonGetTask.appendChild(i);
    buttonsBlock.appendChild(buttonGetTask);
    doctorTaskBlock.appendChild(buttonsBlock);

    return doctorTaskBlock;
}

function drawTasks() {
    for(let object of taskData) {
        const taskBlock = createTask(object.id, object.typeDoctor, object.userData, object.priority, object.comment);
        taskList.appendChild(taskBlock);
    }
}

function init() {
    clearNode(taskList);
    drawTasks();
}

function clearNode(node) {
    if (!node) {
        return false;
    }
    while(node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
