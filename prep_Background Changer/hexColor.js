
const hexRandomColor = document.querySelector('.js-hexColor');
const randomIndex = hexRandomColor.querySelector('h1');

function hexColor(){
    const hexNumbrers = [
        0,1,2,3,4,5,6,7,8,9,
        'A','B','C','D','E','F'
    ];
    let result = "#";

    for(var i=0; i<6;i++){
        randomIndex = Math.floor(Math.random()*hexNumbrers.length);
        result = result + hexNumbrers[randomIndex];
    }
    return result;
}

hexColor();
