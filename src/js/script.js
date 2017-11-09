"use strict";

const taskList = document.getElementById('taskList');



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
    const wrapper = createEl('div', 'doctor-task');
    wrapper.dataset.id = task_id;
    var classPriority = 'normal';
    
    switch(priority) {
        case 'low':
        classPriority = 'priority-low';
        break;
        case 'high':
        classPriority = 'priority-high';
        break;
    }

    const doctorPolis = createEl('span', 'doctor-task-polis');
    wrapper.appendChild(doctorPolis);

    wrapper.classList.add(classPriority);

    return wrapper;
}