const form = document.querySelector(".js-form"),
    input = form.querySelector("input"),
    greeting = document.querySelector(".js-greetings");

const USER_LS = "currnetUser",
    SHOWING_CN = "showing";

function saveName(text){
    localStorage.setItem(USER_LS, text);
}

function handleSubmit(event){
    event.preventDefault();
    const currnetValue = input.value;
    paintGreeting(currnetValue);
    saveName(currnetValue);
}

function askForName(){
    form.classList.add(SHOWING_CN);
    form.addEventListener("submit", handleSubmit);
}

function paintGreeting(text){
    form.classList.remove(SHOWING_CN);
    greeting.classList.add(SHOWING_CN);
    greeting.innerText = `Hello ${text}`
}

function loadName(){
    const currnetUser = localStorage.getItem(USER_LS);
    if(currnetUser === null){
        askForName();
    }else{
        paintGreeting(currnetUser);
    }
}

function init(){
    loadName();
}

init();