import "./style.css";
import folder from "./fold.png";
import task from "./task.svg";
import { format, parseISO, differenceInDays } from 'date-fns';

class Todo {
    constructor(title, description, dueDate, priority, notes, projectName) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.projectName = projectName;
    }
}

class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }
}

let projects = [];

// Load projects from localStorage or create default ones
function loadProjects() {
    let storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
        let parsedProjects = JSON.parse(storedProjects);
        projects = parsedProjects.map(proj => {
            let project = new Project(proj.name);
            project.todos = proj.todos.map(todo => new Todo(
                todo.title, todo.description, todo.dueDate, todo.priority, todo.notes, todo.projectName
            ));
            return project;
        });
    } else {
        addProjectdefault("Goals");
        addProjectdefault("This Month");
        saveProjectsToLocalStorage();
    }
}

function saveProjectsToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function addProjectdefault(name) {
    let newProject = new Project(name);
    projects.push(newProject);
}

// Initial load of projects
loadProjects();

const addpro = document.querySelector('.addProjects');
const addtod = document.querySelector('.addTasks');

const proDialog = document.querySelector('.pro-dialog');
const taskDialog = document.querySelector('.task-dialog');

const cancel1 = document.querySelector('.close1');
const cancel2 = document.querySelector('.close2');

const proadd = document.querySelector(".pro-add");
const taskadd = document.querySelector(".task-add");

const content = document.querySelector('.content');

const projectDropdown = document.querySelector('.project');

addpro.addEventListener("click", () => {
    proDialog.showModal();
});

addtod.addEventListener("click", () => {
    taskDialog.showModal();
});

cancel1.addEventListener("click", () => {
    proDialog.close();
});

cancel2.addEventListener("click", () => {
    taskDialog.close();
});

function populateProjectDropdown() {
    projectDropdown.innerHTML = '<option value="" disabled selected>Select project</option>';
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        projectDropdown.appendChild(option);
    });
}

function displayProjects() {
    const projectList = document.querySelector('.dropdown-content');
    projectList.innerHTML = '';
    projects.forEach(project => {
        const listItem = document.createElement('li');
        listItem.style.cursor = 'pointer';
        listItem.textContent = project.name;
        listItem.addEventListener('click', () => {
            displayProjectsInfo(project);
        });
        projectList.appendChild(listItem);
    });
}

proadd.addEventListener("click", (event) => {
    event.preventDefault();
    let name = document.querySelector(".projectName").value;
    let newProject = new Project(name);
    projects.push(newProject);
    saveProjectsToLocalStorage();
    proDialog.close();
    displayProjects();
    populateProjectDropdown();
});

taskadd.addEventListener("click", (event) => {
    event.preventDefault();
    let title = document.querySelector(".title").value;
    let description = document.querySelector(".description").value;
    let dueDate = document.querySelector(".dueDate").value;
    let priority = document.querySelector('input[name="priority"]:checked').value;
    let notes = document.querySelector('.notes').value;
    let projectName = document.querySelector('.project').value;
    
    let newTodo = new Todo(title, description, dueDate, priority, notes, projectName);
    let project = projects.find(proj => proj.name === projectName);
    
    if (project) {
        project.addTodo(newTodo);
        saveProjectsToLocalStorage();
    } else {
        console.error(`Project "${projectName}" not found!`);
    }
    taskDialog.close();
    displayTasks(project);
});

function displayTasks(project) {
    const taskList = document.querySelector('.dropdown2-content');
    taskList.innerHTML = '';
    project.todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.style.cursor = 'pointer';
        listItem.textContent = todo.title;  
        listItem.addEventListener('click', () => {
            displayTasksInfo(todo);
        });
        taskList.appendChild(listItem);
    });
}

function displayProjectsInfo(project) {
    content.innerHTML = '';
    const box = document.createElement('div');
    box.style.border = '1px solid #13293d';
    box.style.borderRadius = '10px';
    box.style.padding = '20px';
    box.style.margin = '50px';
    box.style.position = 'relative';

    const projectTitle = document.createElement('h1');
    projectTitle.textContent = project.name;
    projectTitle.style.marginBottom = '20px';
    projectTitle.style.textAlign = 'center';
    box.appendChild(projectTitle);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const headerRow = document.createElement('tr');
    const taskHeader = document.createElement('th');
    const dueDateHeader = document.createElement('th');

    taskHeader.textContent = 'Task';
    taskHeader.style.textAlign = 'left';
    taskHeader.style.borderBottom = '1px solid #13293d';
    taskHeader.style.padding = '10px';

    dueDateHeader.textContent = 'Due Date';
    dueDateHeader.style.textAlign = 'left';
    dueDateHeader.style.borderBottom = '1px solid #13293d';
    dueDateHeader.style.padding = '10px';

    headerRow.appendChild(taskHeader);
    headerRow.appendChild(dueDateHeader);
    table.appendChild(headerRow);

    project.todos.forEach(todo => {
        const row = document.createElement('tr');

        const taskCell = document.createElement('td');
        taskCell.textContent = todo.title;
        taskCell.style.padding = '10px';
        taskCell.style.borderBottom = '1px solid #13293d';
        taskCell.style.cursor = 'pointer';

        taskCell.addEventListener('click', () => {
            displayTasksInfo(todo);
        });

        const dueDateCell = document.createElement('td');
        dueDateCell.textContent = todo.dueDate;
        dueDateCell.style.padding = '10px';
        dueDateCell.style.borderBottom = '1px solid #13293d';

        row.appendChild(taskCell);
        row.appendChild(dueDateCell);
        table.appendChild(row);
    });

    box.appendChild(table);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '20px';

    const addbut = document.createElement('button');
    addbut.textContent = 'Add Task';
    addbut.style.backgroundColor = '#13293d';
    addbut.style.color = 'white';
    addbut.style.border = 'none';
    addbut.style.height = '40px';
    addbut.style.width = '160px';
    addbut.style.borderRadius = '8px';
    addbut.style.fontSize = '20px';
    addbut.style.cursor = 'pointer';

    addbut.addEventListener('click', () => {
        taskDialog.showModal();
    });

    const delProjectBut = document.createElement('button');
    delProjectBut.textContent = 'Delete Project';
    delProjectBut.style.backgroundColor = '#d9534f';
    delProjectBut.style.color = 'white';
    delProjectBut.style.border = 'none';
    delProjectBut.style.height = '40px';
    delProjectBut.style.width = '160px';
    delProjectBut.style.borderRadius = '8px';
    delProjectBut.style.fontSize = '20px';
    delProjectBut.style.cursor = 'pointer';

    delProjectBut.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
            deleteProject(project.name);
        }
    });

    buttonContainer.appendChild(addbut);
    buttonContainer.appendChild(delProjectBut);
    box.appendChild(buttonContainer);

    content.appendChild(box);
}

function displayTasksInfo(task) {
    content.innerHTML = '';

    const box = document.createElement('div');
    box.style.border = '1px solid #13293d';
    box.style.borderRadius = '10px';
    box.style.padding = '20px';
    box.style.margin = '50px';
    box.style.position = 'relative';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const row1 = document.createElement('tr');
    const row2 = document.createElement('tr');
    const row3 = document.createElement('tr');
    const row4 = document.createElement('tr');
    const row5 = document.createElement('tr');
    const row6 = document.createElement('tr');

    const titleHeader = document.createElement('th');
    titleHeader.textContent = 'Task Title';
    titleHeader.style.textAlign = 'left';
    titleHeader.style.borderBottom = '1px solid #13293d';

    const titleCell = document.createElement('td');
    titleCell.textContent = task.title;
    titleCell.style.padding = '10px';
    titleCell.style.borderBottom = '1px solid #13293d';

    row1.appendChild(titleHeader);
    row1.appendChild(titleCell);

    const descHeader = document.createElement('th');
    descHeader.textContent = 'Description';
    descHeader.style.textAlign = 'left';
    descHeader.style.borderBottom = '1px solid #13293d';

    const descCell = document.createElement('td');
    descCell.textContent = task.description;
    descCell.style.padding = '10px';
    descCell.style.borderBottom = '1px solid #13293d';

    row2.appendChild(descHeader);
    row2.appendChild(descCell);

    const dateHeader = document.createElement('th');
    dateHeader.textContent = 'Due Date';
    dateHeader.style.textAlign = 'left';
    dateHeader.style.borderBottom = '1px solid #13293d';

    const dateCell = document.createElement('td');
    const formattedDate = format(parseISO(task.dueDate), 'MMMM do, yyyy');
    dateCell.textContent = formattedDate;
    dateCell.style.padding = '10px';
    dateCell.style.borderBottom = '1px solid #13293d';

    row3.appendChild(dateHeader);
    row3.appendChild(dateCell);

    const priorityHeader = document.createElement('th');
    priorityHeader.textContent = 'Priority';
    priorityHeader.style.textAlign = 'left';
    priorityHeader.style.borderBottom = '1px solid #13293d';

    const priorityCell = document.createElement('td');
    priorityCell.textContent = task.priority;
    priorityCell.style.padding = '10px';
    priorityCell.style.borderBottom = '1px solid #13293d';

    row4.appendChild(priorityHeader);
    row4.appendChild(priorityCell);

    const notesHeader = document.createElement('th');
    notesHeader.textContent = 'Notes';
    notesHeader.style.textAlign = 'left';
    notesHeader.style.borderBottom = '1px solid #13293d';

    const notesCell = document.createElement('td');
    notesCell.textContent = task.notes;
    notesCell.style.padding = '10px';
    notesCell.style.borderBottom = '1px solid #13293d';

    row5.appendChild(notesHeader);
    row5.appendChild(notesCell);

    const today = new Date();
    const dueDate = parseISO(task.dueDate);
    const daysRemaining = differenceInDays(dueDate, today);

    const daysRemainingHeader = document.createElement('th');
    daysRemainingHeader.textContent = 'Days Remaining';
    daysRemainingHeader.style.textAlign = 'left';
    daysRemainingHeader.style.borderBottom = '1px solid #13293d';

    const daysRemainingCell = document.createElement('td');
    daysRemainingCell.textContent = `${daysRemaining} days left`;
    daysRemainingCell.style.padding = '10px';
    daysRemainingCell.style.borderBottom = '1px solid #13293d';

    row6.appendChild(daysRemainingHeader);
    row6.appendChild(daysRemainingCell);

    table.appendChild(row1);
    table.appendChild(row2);
    table.appendChild(row3);
    table.appendChild(row4);
    table.appendChild(row5);
    table.appendChild(row6);

    box.appendChild(table);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginTop = '20px';

    const edittask = document.createElement('button');
    edittask.textContent = 'Edit Task';
    edittask.style.backgroundColor = '#13293d';
    edittask.style.color = 'white';
    edittask.style.border = 'none';
    edittask.style.height = '40px';
    edittask.style.width = '160px';
    edittask.style.borderRadius = '8px';
    edittask.style.fontSize = '20px';
    edittask.style.cursor = 'pointer';
    edittask.style.marginRight = '10px';

    edittask.addEventListener('click', () => {
        editTask(task);
    });

    const deletetask = document.createElement('button');
    deletetask.textContent = 'Delete Task';
    deletetask.style.backgroundColor = '#13293d';
    deletetask.style.color = 'white';
    deletetask.style.border = 'none';
    deletetask.style.height = '40px';
    deletetask.style.width = '160px';
    deletetask.style.borderRadius = '8px';
    deletetask.style.fontSize = '20px';
    deletetask.style.cursor = 'pointer';

    deletetask.addEventListener('click', () => {
        deleteTask(task);
    });

    buttonContainer.appendChild(edittask);
    buttonContainer.appendChild(deletetask);

    box.appendChild(buttonContainer);

    content.appendChild(box);
}

function editTask(todo) {
    taskDialog.showModal();
    document.querySelector(".title").value = todo.title;
    document.querySelector(".description").value = todo.description;
    document.querySelector(".dueDate").value = todo.dueDate;
    document.querySelector('.priority').value = todo.priority;
    document.querySelector(".notes").value = todo.notes;

    const taskadd = document.querySelector(".task-add");
    taskadd.removeEventListener('click', updateTask);
    taskadd.addEventListener('click', updateTask, { once: true });

    function updateTask(event) {
        event.preventDefault();
        todo.title = document.querySelector(".title").value;
        todo.description = document.querySelector(".description").value;
        todo.dueDate = document.querySelector(".dueDate").value;
        todo.priority = document.querySelector('.priority').value;
        todo.notes = document.querySelector('.notes').value;

        saveProjectsToLocalStorage();
        taskDialog.close();
        displayTasksInfo(todo);
    }
}

function deleteTask(todo) {
    let project = projects.find(proj => proj.todos.includes(todo));

    if (project) {
        const taskIndex = project.todos.indexOf(todo);
        if (taskIndex !== -1) {
            project.todos.splice(taskIndex, 1);
            saveProjectsToLocalStorage();
        }
    }

    content.innerHTML = '';
    displayTasks(project);
}

function deleteProject(projectName) {
    const projectIndex = projects.findIndex(proj => proj.name === projectName);

    if (projectIndex !== -1) {
        projects.splice(projectIndex, 1);
        saveProjectsToLocalStorage();
    }

    content.innerHTML = '';
    displayProjects();
}
window.onload = function() {
    populateProjectDropdown();
    displayProjects();
    displayTasks(projects)
};