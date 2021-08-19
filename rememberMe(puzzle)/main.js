const $boardContainer = document.querySelector('.board-container');
const $tableBox = document.querySelector('.table-container');

const $head = document.querySelector('head');
const $headContainer = document.querySelector('.head-container');
const $countTime = document.querySelector('.head-container span:nth-child(1)');
const $countTimeText = document.querySelector('.head-container span:nth-child(2)');
const $remainBaeks = document.querySelector('.head-container span:nth-child(3)');
const $remainBaeksText = document.querySelector('.head-container span:nth-child(4)');

const $buttonStart = document.querySelector('.start-button');
const $mainPageImage = document.querySelector('.mainPage-image');
const $buttonRestart = document.createElement('button');
const $successedImage = document.createElement('img');
const $failedImage = document.createElement('img');
const $mainCoverImage = document.createElement('img');
const $noticeTagP = document.createElement('p');

const TOTALCELLCOUNT = 16;
const clickCount = 2;
const numberArray = [];
const clickedOrderArray = [];
const coverImageArray = [];
const changeImageArray = [];

let row = '';
let cell = '';
let randomNumber = 0;
let count = 0;
let correctAnswer = 0;
let timer = null;
let clicked = false;
let isPlay = true;

$buttonStart.classList.remove('hidden');
$mainPageImage.classList.remove('hidden');

$buttonStart.addEventListener('click', handlegameStart);

const GAME_AUDIO = {
  backgroundAudio: new Audio('./music/배경bgm.mp3'),
  correctAudio: new Audio('./music/correctbgm.mp3'),
  wrongAudio: new Audio('./music/wrongbgm.mp3'),
  successSound: new Audio('./music/successSound.mp3'),
  failSound: new Audio('./music/failSound.mp3'),
};

const currentAudioPlay = {
  play: function (audioFile) {
    isPlay ? audioFile.play() : audioFile.pause();
    audioFile === GAME_AUDIO.backgroundAudio ? audioFile.volume = 0.7 : audioFile.volume = 0.1;
    audioFile === GAME_AUDIO.correctAudio ? audioFile.volume = 1.5 : audioFile.volume = 0.1;
    audioFile === GAME_AUDIO.wrongAudio ? audioFile.volume = 0.5 : audioFile.volume = 0.1;
    audioFile === GAME_AUDIO.successSound ? audioFile.volume = 1.5 : audioFile.volume = 0.1;
    audioFile === GAME_AUDIO.failSound ? audioFile.volume = 1.0 : audioFile.volume = 0.1;
    audioFile.currentTime = 0;
  },
  result: function (audioFile) {
    isPlay ? audioFile.pause() : audioFile.play();
    audioFile.currentTime = 0;
  }
};

function handlegameStart (e) {
  $buttonStart.classList.add('hidden');
  $mainPageImage.classList.add('hidden');
  
  if(e.target.nodeName === 'BUTTON') {
    $countTime.classList.remove('hidden');
    $remainBaeks.classList.remove('hidden');
  }

  currentAudioPlay.play(GAME_AUDIO.backgroundAudio);

  for (let i = 0; i < TOTALCELLCOUNT; i++) {
    randomNumber = Math.floor(Math.random() * 16 + 1);
    if (numberArray.indexOf(randomNumber) === -1) {
      numberArray.push(randomNumber);
    } else {
      i--;
    }
  }

  makeTable();
  remainTimer();
  $tableBox.addEventListener('click', handleImageChange);
}

function handlegameReStart (e) {
  count = 0;
  correctAnswer = 0;
  isPlay = true;
  randomNumber = 0;
  clicked = false;

  $tableBox.classList.remove('hidden');
  $buttonStart.classList.remove('hidden');
  $mainPageImage.classList.remove('hidden');

  $failedImage.classList.add('hidden');
  $successedImage.classList.add('hidden');
  $noticeTagP.classList.add('hidden');
  $buttonRestart.classList.add('hidden');
  
  clickedOrderArray.splice(0);
  coverImageArray.splice(0);
  changeImageArray.splice(0);
  numberArray.splice(0);

  const $tBody = $tableBox.querySelector('tbody');  
  $tBody.innerHTML = '';

  currentAudioPlay.result(GAME_AUDIO.successSound);
  currentAudioPlay.result(GAME_AUDIO.failSound);
  
  $buttonStart.addEventListener('click', handlegameStart);
}

function restartNotice () {
  $countTime.classList.add('hidden');
  $countTimeText.classList.add('hidden');
  $remainBaeks.classList.add('hidden');
  $remainBaeksText.classList.add('hidden');
  $tableBox.classList.add('hidden');
  
  $failedImage.src = './images/failImage.PNG';
  $failedImage.classList.add('fail-image');
  currentAudioPlay.play(GAME_AUDIO.failSound);
  currentAudioPlay.result(GAME_AUDIO.backgroundAudio);

  $noticeTagP.textContent =  `${(TOTALCELLCOUNT / 2) - correctAnswer}명의 백쌤을 찾지 못했다🤔`;
  $noticeTagP.classList.add('fail-text');

  $buttonRestart.textContent = '재시작';
  $buttonRestart.classList.add('restart-button');
  $headContainer.appendChild($buttonRestart);
  $buttonRestart.addEventListener('click', handlegameReStart);

  $boardContainer.appendChild($noticeTagP);
  $boardContainer.appendChild($failedImage);
}

function makeTable () {
  for (let i = 0; i < TOTALCELLCOUNT; i++) {
    if (i % 4 !== 0) {
      cell = row.insertCell();
      cell.setAttribute('data-class', i);
      cell.classList.add('hidden');

      makeSetCoverImage(i);
      shuffleImage(i);
    } else {
      row = $tableBox.insertRow();
      row.setAttribute('data-class', i);

      cell = row.insertCell();
      cell.setAttribute('data-class', i);
      cell.classList.add('hidden');
      
      makeSetCoverImage(i);
      shuffleImage(i);
    }
  }
}

function makeSetCoverImage (number) {
  cell.classList.remove('hidden');

  const $img = document.createElement('img');
  $img.src = './images/coverImage.PNG';
  $img.classList.add(`coverImage${number}`);
  cell.appendChild($img);
}

function shuffleImage (number) {
  const $imgChange = document.createElement('img');

  $imgChange.src = `./images/${numberArray[number] % 8 + 1}.PNG`;
  $imgChange.classList.add(`changeImage${numberArray[number] % 8 + 1}`);
  $imgChange.classList.add('hidden');
  cell.appendChild($imgChange);
}

function handleImageChange(e) {
  const clickedTarget = e.target;
  const $tableTd = $tableBox.querySelectorAll('td');
  const targetParentId = Number(clickedTarget.parentNode.dataset.class);
  const $coverImage = $tableTd[targetParentId].querySelector('img:nth-child(1)');
  const $changeImage = $tableTd[targetParentId].querySelector('img:nth-child(2)');

  $coverImage.classList.add('hidden');
  $changeImage.classList.remove('hidden');

  gameLogic(clickedTarget, $coverImage, $changeImage);
}


function gameLogic (clickedTarget, $coverImage, $changeImage) {
  let clickedFirst = '';
  let clickedSecond = '';

  $remainBaeks.textContent = '/ 남은 백쌤들 : ';
  $remainBaeks.classList.add('remain-Baeks');
  $remainBaeksText.textContent = `${(TOTALCELLCOUNT / 2) - correctAnswer} 명`;
  $remainBaeksText.classList.add('remain-Baeks-text');

  if (clicked) {
    clickedSecond = clickedTarget.nextSibling.className;
    clickedOrderArray.push(clickedSecond);
  } else {
    clickedFirst = clickedTarget.nextSibling.className;
    clickedOrderArray.push(clickedFirst);
  }
  changeImageArray.push($changeImage);
  coverImageArray.push($coverImage);
  
  if (clickedOrderArray.length % 2 === 0) {
    
    if (clickedOrderArray[0] === clickedOrderArray[1]) {
      clickedOrderArray.splice(0);
      currentAudioPlay.play(GAME_AUDIO.correctAudio);

      correctAnswer += 1;
    } else {
      clickedOrderArray.splice(0);      
      currentAudioPlay.play(GAME_AUDIO.wrongAudio);

      for(let i = count; i <= count + 1; i++) {
        resetCoverImage(i);
      }
    }
    count += 2;
  }

  if (correctAnswer === (TOTALCELLCOUNT / 2)) successedNotice();
  clicked = !clicked; 
}

function successedNotice () {
  clearInterval(timer);

  $countTime.classList.add('hidden');
  $remainBaeks.classList.add('hidden');
  $tableBox.classList.add('hidden');
  
  $successedImage.src = './images/successImage.PNG';
  $successedImage.classList.add('seccess-image');
  
  $noticeTagP.textContent =  `참 잘했어유우~☺`;
  $noticeTagP.classList.add('success-text');
  
  currentAudioPlay.play(GAME_AUDIO.successSound);
  currentAudioPlay.result(GAME_AUDIO.backgroundAudio);

  $buttonRestart.textContent = '재시작';
  $buttonRestart.classList.add('restart-button');
  $headContainer.appendChild($buttonRestart);
  $buttonRestart.addEventListener('click', handlegameReStart);


  $boardContainer.appendChild($noticeTagP);
  $boardContainer.appendChild($successedImage);
}

function resetCoverImage (i) {
    setTimeout(() => {
      changeImageArray[i].classList.add('hidden'); 
      coverImageArray[i].classList.remove('hidden');
    }, 1000);
}

function remainTimer () {
  let timeLeft = 25;
  timer = setInterval(() => {
   if (timeLeft < 0) {
     clearInterval(timer);
     restartNotice();

     $buttonRestart.classList.remove('hidden');
     $failedImage.classList.remove('hidden');
     $successedImage.classList.remove('hidden');
     $noticeTagP.classList.remove('hidden');
   } else {
     $countTime.textContent = '남은 시간 : ';
     $countTime.classList.add('remain-time');
     $countTimeText.textContent = `${timeLeft}초 `;
     $countTimeText.classList.add('remain-time-text');
     timeLeft--;
   }
  },1000);
 }

// function makeRandomNumberArray () {
//   for (let i = 0; i < TOTALCELLCOUNT; i++) {
//     randomNumber = Math.floor(Math.random() * 16 + 1);
//     if (numberArray.indexOf(randomNumber) === -1) {
//       numberArray.push(randomNumber);
//     } else {
//       i--;
//     }
//   }
//   return numberArray;
// }

//makeRandomNumberArray();
