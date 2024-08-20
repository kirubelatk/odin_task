
import "./style.css";
class Todo {
    constructor(title, description, dueDate, priority, notes, projectName ,checkbox) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.projectName = projectName;
        this.checkbox = checkbox // Storing the project name in the Todo
    }
}

class Project {
    constructor(name) {
        this.name = name;
        this.todos = []; // Each project has its own list of todos
    }

    addTodo(todo) {
        this.todos.push(todo); // Add todo to the project’s todo list
    }
}

let projects = [];

function addProjectdefault(name) {
    let newProject = new Project(name);
    projects.push(newProject);
}

// Creating default projects
addProjectdefault("Goals");
addProjectdefault("This Month");

console.log(projects[0].name);
console.log(projects[1].name);

/* 
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

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
})

cancel2.addEventListener("click", () => {
    taskDialog.close();
})

function populateProjectDropdown() {
    
    projectDropdown.innerHTML = '<option value="" disabled selected>Select project</option>'; // Reset dropdown
    
    // Loop through the projects array and create an option for each project
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        projectDropdown.appendChild(option);
    });
}

function displayProjects() {
    const projectList = document.querySelector('.dropdown-content');

    // Clear the list before adding new elements
    projectList.innerHTML = '';

    // Loop through all the projects and add them to the project list
    projects.forEach(project => {
        const listItem = document.createElement('li');
        listItem.textContent = project.name;
        listItem.addEventListener('click', () => {
            displayProjectsInfo(project);
        })
        projectList.appendChild(listItem);
    });
}

proadd.addEventListener("click", () => {

    event.preventDefault();
    let name = document.querySelector(".projectName").value; // Assuming there's an input with id="projectName"
    let newProject = new Project(name);
    projects.push(newProject);

    proDialog.close(); 
    // Close dialog
    displayProjects();
    populateProjectDropdown();
});

taskadd.addEventListener("click", () => {
    event.preventDefault();
    let title = document.querySelector(".title").value;
    let description = document.querySelector(".description").value;
    let dueDate = document.querySelector(".dueDate").value;
    let priority = document.querySelector('input[name="priority"]:checked').value;
    let notes = document.querySelector('.notes').value;
    let projectName = document.querySelector('.project').value;
    
    // Create a new todo
    let newTodo = new Todo(title, description, dueDate, priority, notes, projectName);

    // Find the project that matches the project name
    let project = projects.find(proj => proj.name === projectName);
    
    if (project) {
        project.addTodo(newTodo); // Add the todo to the project
    } else {
        console.error(`Project "${projectName}" not found!`);
    }
    taskDialog.close(); // Close dialog
    displayTasks(project);
});

function displayTasks(project) {
    const taskList = document.querySelector('.dropdown2-content');

    // Clear the list before adding new tasks
    taskList.innerHTML = '';

   
    project.todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.textContent = todo.title;  // Display task title
        listItem.addEventListener('click', () => {
            displayTasksInfo(todo);
        })
        taskList.appendChild(listItem);
    });
}

function displayProjectsInfo(project) {
    content.innerHTML = '';

    const projectTitle = document.createElement('h1');
    projectTitle.textContent = project.name;
    content.appendChild(projectTitle);

    const taskList = document.createElement('ul');
    content.appendChild(taskList);

    project.todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.textContent = todo.title;  // Display task title
        listItem.addEventListener('click', () => {
            displayTasksInfo(todo);
        })
        content.appendChild(listItem);
    });

    const addbut = document.createElement('button');
    addbut.textContent = 'Add Task';
    addbut.addEventListener('click', () => {
        taskDialog.showModal();
    })
    content.appendChild(addbut);
    
}
function displayTasksInfo(task) {

    content.innerHTML = '';

    const taskTitle = document.createElement('h1');
    taskTitle.textContent = task.title;
    content.appendChild(taskTitle);

    const taskDescription = document.createElement('p');
    taskDescription.textContent = `Description: ${task.description}`;  
    content.appendChild(taskDescription);

    const taskDueDate = document.createElement('p');
    taskDueDate.textContent = `Due Date: ${task.dueDate}`;  
    content.appendChild(taskDueDate);

    const taskPriority = document.createElement('p');
    taskPriority.textContent = `Priority: ${task.priority}`;  
    content.appendChild(taskPriority);

    const taskNotes = document.createElement('p');
    taskNotes.textContent = `Notes: ${task.notes}`;  
    content.appendChild(taskNotes);

   const edittask = document.createElement('button');
    edittask.textContent = 'Edit Task';

    edittask.addEventListener('click', () => {
        editTask(task);
    })


    content.appendChild(edittask);

    const deletetask = document.createElement('button');
    deletetask.textContent = 'Delete Task';
    deletetask.addEventListener('click', () => {
       deleteTask(task);
    })
    content.appendChild(deletetask);
}

function editTask(todo) {
    taskDialog.showModal();
    document.querySelector(".title").value = todo.title;
    document.querySelector(".description").value = todo.description;
    document.querySelector(".dueDate").value = todo.dueDate;
    
    // Select the correct priority radio button
    document.querySelector('.priority').value = todo.priority;
    
    document.querySelector(".notes").value = todo.notes;

    const taskadd = document.querySelector(".task-add");

    // Ensure the listener only fires once to avoid multiple events
    taskadd.removeEventListener('click', updateTask);
    taskadd.addEventListener('click', updateTask, { once: true });

    function updateTask(event) {
        event.preventDefault();
        todo.title = document.querySelector(".title").value;
        todo.description = document.querySelector(".description").value;
        todo.dueDate = document.querySelector(".dueDate").value;
        todo.priority = document.querySelector('.priority').value;
        todo.notes = document.querySelector('.notes').value;

        taskDialog.close(); // Close the dialog after editing
        displayTasksInfo(todo); // Refresh task display with updated info
    }
}

function deleteTask(todo) {
    let project = projects.find(proj => proj.todos.includes(todo));

    if (project) {
        const taskIndex = project.todos.indexOf(todo);
        if (taskIndex !== -1) {
            project.todos.splice(taskIndex, 1); // Remove task from project
        }
    }

    content.innerHTML = '';
    displayTasks(project);
}


window.onload = function() {
    populateProjectDropdown();
    displayProjects();
};

