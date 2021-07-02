const toDoForm = document.getElementById("todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todo-list");

const ToDOS_KEY = "todos";
let toDos = [];

function saveToDos(){
    localStorage.setItem(ToDOS_KEY, JSON.stringify(toDos));
    
}

function deleteToDo(event){
    const li = event.target.parentElement;
    li.remove();
    
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    saveToDos();
}

function paintToDo(newTodo){
    const li = document.createElement("li");
    li.id = newTodo.id;
    const span = document.createElement("span");
    span.innerText = newTodo.text;
    const button = document.createElement("button");
    button.innerText = "❌";
    button.addEventListener("click", deleteToDo);
    li.appendChild(span);
    li.appendChild(button);  
    toDoList.appendChild(li);
}


function handleToDoSubmit(event){
    event.preventDefault();
    const newTodo = toDoInput.value;
    toDoInput.value = "";
    const newTOdoObj = {
        text:newTodo,
        id:Date.now()
    }
    toDos.push(newTOdoObj);
    paintToDo(newTOdoObj);
    saveToDos();
}

toDoForm.addEventListener("submit", handleToDoSubmit);

function sayHello(item){
    console.log("This is turn of ", item);
}

const savedToDos = localStorage.getItem(ToDOS_KEY);


if(savedToDos !== null){
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}

