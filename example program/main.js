const colorInput = document.querySelector("#color");
const formInput = document.querySelector("#click");


function randomColor(event){
    event.preventDefault();
    const hexNum = [
        0,1,2,3,4,5,6,7,8,9,
        'A','B','C','D','E','F'
    ];

    let result = '#';
    for(let i=0; i<6; i++){
        const randomIndex = Math.floor(Math.random()* hexNum.length);
        result = result + hexNum[randomIndex];
    }   
    colorChange(result);
    
}

function colorChange(result){
    colorInput.innerText = `Hex Color : ${result}`;
    document.body.style.background = `${result}`;
}

formInput.addEventListener("click",randomColor);