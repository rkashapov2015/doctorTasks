"use strict";

const mainWrapper = document.querySelector('.doctor-tasks-wrapper');
const taskList = document.getElementById('taskList');
const myTasks = document.getElementById('myTasks');
const modalDoctorTask = document.getElementById('modalDoctorTask');

const urlWebsocket = 'ws://medportal:5060';
const typesDoctor = {
    terapevt: 'Терапевт',
    pediatr: 'Педиатр'
};
const prioritys = {
    low: 'Низкий',
    normal: 'Нормальный',
    high: 'Высокий'
}

let connection = null;
let userId = 978;
let hash = 'QZFWnPWSysImhryYAofuW5asHSxXe6ZN';


let taskData = [];

const webSocketObject = {
    connection: null,
    tryConnect: 0,
    _intervalTimeout: 5000,
    connect: () => {
        webSocketObject.connection = new WebSocket(urlWebsocket);
        webSocketObject.connection.addEventListener('open', webSocketObject.onOpen);
        webSocketObject.connection.addEventListener('message', webSocketObject.onMessage);
        webSocketObject.connection.addEventListener('error', webSocketObject.onError);
        webSocketObject.connection.addEventListener('close', webSocketObject.onClose);
    },
    onOpen: (event) => {
        webSocketObject.tryConnect = 0;
        webSocketObject._intervalTimeout = 5000;
        console.log('Соединение установлено...');
        let params = {
            c: 'connect',
            d: '',
            u: {id: hash}
        };
        webSocketObject.send(JSON.stringify(params));
    },
    onMessage: (event) => {
        readInstruction(event.data);
    },
    onError: (event) => {
        console.log(`Произошла ошибка: ${error.data}`);
        webSocketObject.tryConnect++;
        webSocketObject._intervalTimeout = 10000;
        setTimeout(webSocketObject.connect, webSocketObject._intervalTimeout);
    },
    onClose: (event) => {
        if (event.wasClean) {
            console.log('Соединение закрыто корректно');
        } else {
            console.log(event.code);
        }
        webSocketObject.tryConnect++;
        if (webSocketObject.tryConnect > 5) {
            webSocketObject._intervalTimeout = 10000;
        }
        if (webSocketObject.tryConnect > 10) {
            webSocketObject._intervalTimeout = 20000;
        } 
        console.log('Попытка соединения...' + webSocketObject.tryConnect);
        setTimeout(webSocketObject.connect, webSocketObject._intervalTimeout);
    },
    send: (data) => {
        if (!webSocketObject.connection) {
            return false;
        }
        webSocketObject.connection.send(data);
    }
};

///begin
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
    buttonGetTask.dataset.operation = 'catch-task';
    let i = createEl('i', 'fa fa-hand-lizard-o');
    i.setAttribute('aria-hidden', 'true');
    buttonGetTask.appendChild(i);
    buttonsBlock.appendChild(buttonGetTask);
    doctorTaskBlock.appendChild(buttonsBlock);

    return doctorTaskBlock;
}

function changeButtonsForMyList(taskBlock) {
    const buttonBlock = taskBlock.querySelector('.doctor-task-buttons');
    if (buttonBlock) {
        clearNode(buttonBlock);
        const buttonThrow = createEl('button', 'doctor-btn');
        buttonThrow.dataset.operation = 'throw-task';
        const iGarbage  = createEl('i', 'fa fa-trash-o');
        buttonThrow.appendChild(iGarbage);
        buttonBlock.appendChild(buttonThrow);

        const buttonEnd = createEl('button', 'doctor-btn');
        buttonEnd.dataset.operation = 'end-task';
        const iCheck = createEl('i', 'fa fa-check');
        buttonEnd.appendChild(iCheck);
        buttonBlock.appendChild(buttonEnd);
    }
    return taskBlock;
}

function drawTasks() {
    for(let object of taskData) {
        console.log(object.responsible);
        const taskBlock = createTask(object.id, object.typeDoctor, object.userData, object.priority, object.comment);
        if (!object.responsible) {
            taskList.appendChild(taskBlock);
        } 

        if (object.responsible == userId) {
            myTasks.appendChild(changeButtonsForMyList(taskBlock));
        }
        
    }
}

function createField(labelText, inputNode, classWrapper) {
    const div = createEl('div', classWrapper);
    const label = createEl('label');
    label.innerText = labelText;
    div.appendChild(label);
    div.appendChild(inputNode);
    return div;
}
function createSelectAA(object, className, defaultValue) {
    const select = createEl('select', className);
    Object.keys(object).forEach((indexType) => {
        const option = createEl('option');
        option.setAttribute('value', indexType);
        option.innerText = object[indexType];
        if (defaultValue === indexType) {
            option.setAttribute('selected', '');
        }
        select.appendChild(option);
    });
    return select;
}

function showModalNewTask() {
    const fragment = document.createDocumentFragment();

    const selectType = createSelectAA(typesDoctor, 'form-control');
    selectType.setAttribute('id', 'newTask_typeDoctor');
    fragment.appendChild(createField('Направление', selectType, 'form-group'));

    const selectPriority = createSelectAA(prioritys, 'form-control', 'normal');
    selectPriority.setAttribute('id', 'newTask_priority');
    fragment.appendChild(createField('Приоритет', selectPriority, 'form-group'));
    
    const inputPolis = createEl('input', 'form-control');
    inputPolis.setAttribute('id', 'newTask_polis');
    fragment.appendChild(createField('Полис', inputPolis, 'form-group'));
    
    const inputFullname = createEl('input', 'form-control');
    inputFullname.setAttribute('id', 'newTask_fullname');
    fragment.appendChild(createField('Имя Фамилия', inputFullname, 'form-group'));
    
    const inputPhone = createEl('input', 'form-control');
    inputPhone.setAttribute('id', 'newTask_phone');
    inputPhone.setAttribute('type', 'number');
    fragment.appendChild(createField('Телефон', inputPhone, 'form-group'));

    const textComment = createEl('textarea', 'form-control');     
    textComment.setAttribute('id', 'newTask_comment');
    fragment.appendChild(createField('Комментарий', textComment, 'form-group'));
    
    const buttonSubmit = createEl('button', 'btn btn-success btn-block');
    buttonSubmit.dataset.operation = 'new-task';
    buttonSubmit.innerText = 'Создать';
    fragment.appendChild(buttonSubmit);

    drawModal('Новая задача', fragment);
    showModal();
}



function drawModal(headerText, bodyElements) {
    clearNode(modalDoctorTask);
    //<div class="modal-doctor-header">Заголовок</div>
    //<div class="modal-doctor-body">Тело</div>
    const header = createEl('div', 'modal-doctor-header');
    const body = createEl('div', 'modal-doctor-body');
    const h3 = createEl('h3');
    h3.innerText = headerText;
    header.appendChild(h3);
    
    body.appendChild(bodyElements);
    modalDoctorTask.appendChild(header);
    modalDoctorTask.appendChild(body);
}
function showModal() {
    modalDoctorTask.classList.add('show');
}
function hideModal() {
    modalDoctorTask.classList.remove('show');
}

function init() {
    
    clearNode(taskList);
    clearNode(myTasks);
    mainWrapper.addEventListener('click', clickHandler);
    mainWrapper.addEventListener('touchstart', clickHandler);
    webSocketObject.connect();
}

function clearAll() {
    clearNode(taskList);
    clearNode(myTasks);
}

function clearNode(node) {
    if (!node) {
        return false;
    }
    while(node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function sendData(url, data) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
        console.log(xhr.response);
        readInstruction(xhr.response);
    });
    let method = "POST";
    if (!data) {
        method = "GET";
    }
    xhr.open(method, url);
    xhr.send(data);
}

function readInstruction(data) {
    let object = getJsonData(data);
    
    //clearAll();
    if (object.hasOwnProperty('c')) {
        switch(object.c) {
            case 'init':
                initTasks(object);
            break;
            case 'newTask':

            break;
            case 'catchTask':
            case 'throwTask':
                changeTask(object);
            break;
            case 'endTask':

            break;
            case 'userConnected':

            break;
            case 'error':
                readError(object);
            break;
        }
    }
    
}
function initTasks(object) {
    clearAll();
    if (object.hasOwnProperty('tasks')) {
        Array.from(object.tasks).forEach((value)=>{
            let userData = getJsonData(value.userData);
            value.userData = userData;
        });
        if (object.tasks !== taskData) {
            taskData = object.tasks;
            drawTasks();
        }
    }
}
function changeTask(object) {
    if (!object.hasOwnProperty('tasks')) {
        return false;
    }
    Array.from(object.tasks).forEach((value, index)=>{
        let userData = getJsonData(value.userData);
        value.userData = userData;
        taskData.forEach((task, indexTask) => {
            if (value.id == task.id) {
                console.log('task #: ' + value.id)
                taskData[indexTask] = value;
                /*const elementCommon = taskList.querySelector('div[data-id="' + task.id + '"]');
                const elementMy = myTasks.querySelector('div[data-id="' + task.id + '"]');

                if (!elementCommon && !elementMy) {
                    const taskBlock = createTask(value.id, value.typeDoctor, value.userData, value.priority, value.comment);
                    if (parseInt(value.responsible) === userId) {
                        myTasks.appendChild(changeButtonsForMyList(taskBlock));
                    } else {
                        taskList.appendChild(taskBlock);
                    }
                } else {
                    if (elementCommon) {
                        console.log('task in common list');
                        console.log(elementCommon);
                        if (parseInt(value.responsible) === userId) {
                            console.log('getTask');
                            getTask(changeButtonsForMyList(elementCommon));
                        } else if(parseInt(task.responsible)) {
                            console.log('Remove Task' + parseInt(task.responsible));
                            taskList.removeChild(elementCommon);
                        }
                    }
                    if (elementMy) {
                        console.log('in my list');
                        if (parseInt(task.responsible) === userId) {
                            const taskBlock = createTask(value.id, value.typeDoctor, value.userData, value.priority, value.comment);
                            taskList.appendChild(taskBlock);
                            myTasks.removeChild(elementMy);
                        } else {
    
                        }
                    }
                }*/
            }
        });
    });
    clearAll();
    drawTasks();
    
}

function readError(object) {
    if (!object.hasOwnProperty('msg')) {
        return false;
    }
    console.log(object.msg);
    if (object.msg === 'Undefined User') {
        
    }
}

function getJsonData(data) {
    try {
        return JSON.parse(data);
    }
    catch (error) {
        return {};
    }
}

function isLocalStorageNameSupported() 
{
    var testKey = 'test';
    try {
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
	    return true;
    } 
    catch (error) {
        return false;
    }
}

function localSetItem(name, value) {
  if (isLocalStorageNameSupported()) {
    localStorage.setItem(name,value);
    return true;
  }
  return false;
}

function localGetItem(name, defaultValue) {
  if (!defaultValue) {
    defaultValue = false;
  }
  if (isLocalStorageNameSupported()) {
    return localStorage.getItem(name);
  }
  return defaultValue;
}

function getParentByClassName(object, className) {
    if (!object) {
         return false;
    }
    let currentLevel = object;
    console.log(currentLevel.parentNode);
    while (currentLevel.parentNode) {
        try {
            if (currentLevel.parentNode.classList.contains(className)) {
                return currentLevel.parentNode;
            }
            currentLevel = currentLevel.parentNode;
        }
        catch (error) {
            return false;
        }
    }
    return false;
}

function getTask(taskNode) {
    if (!taskNode) {
        console.log('getTask taskNode not found');
        return false;
    }
    console.log(taskNode);
    let cloneTask = taskNode.cloneNode(true);
    taskNode.parentNode.removeChild(taskNode);
    myTasks.appendChild(cloneTask);
    return true;
}

function clickHandler(event) {
    
    //console.log('tagName: '+ event.target.tagName);
    let button = event.target;
    if (button.tagName !== 'BUTTON') {
        if (event.target.parentNode.tagName === 'BUTTON') {
            //console.log('change button node');
            button = event.target.parentNode;
        } else {
            return false;
        }
    }
    if (!button.getAttribute('data-operation')) {
        return false;
    }
    console.log(button.dataset.operation);
    let params = {'c': null, 'd': null};
    
    let parent = getParentByClassName(button, 'doctor-task');
    
    if (!parent && button.dataset.operation !== 'new-task') {
        return false;
    }
    
    switch (button.dataset.operation) {
        case 'catch-task':
            params.c = 'catchTask';
            params.d = parent.dataset.id;
            //webSocketObject.send(JSON.stringify(params));
            
            //let taskNode = getParentByClassName(event.target, 'doctor-task');
            //getTask(taskNode);
        break;
        case 'new-task':
            params.c = 'newTask';
            params.d = readModalFormData();
            //button.setAttribute('disabled','');
            console.log(params.d);
            //return false;
        break;
        case 'throw-task':
            params.c = 'throwTask';
            params.d = parent.dataset.id;
        break;
        case 'end-task':
            params.c = 'endTask';
            params.d = parent.dataset.id;
        break;
    }
    
    webSocketObject.send(JSON.stringify(params));
}

function readModalFormData() {
    const params = ['responsible', 'typeDoctor', 'priority', 'comment'];
    const userDataParams = ['phone', 'polis', 'fullname'];
    let object = {};
    let userData = {};
    const elements = modalDoctorTask.querySelectorAll('input, select, textarea');
    Array.from(elements).forEach((element) => {
        let id = element.id;
        id = id.replace(/newTask_/i, '');
        console.log(id + ' ' + element.value);
        if (params.indexOf(id)) {
            object[id] = element.value;
        }
        if (userDataParams.indexOf(id)) {
            userData[id] = element.value;
        }
        
    });
    
    object['userData'] = JSON.stringify(userData);
    if (!object.hasOwnProperty('responsible')) {
        object['responsible'] = null;
    }
    return object;
}
