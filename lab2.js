const allImages = document.querySelectorAll('.img-container img'); 
let curImageSrc = undefined; 
let initialRearrangement = true;
const gameBoard = document.querySelector('#gameBoard'); 
const gameCells = document.querySelectorAll('.game-cell'); 
const shuffleBtn = document.querySelector('#shuffleBtn'); 
var puzzle = {


  storeCurImageSrc: function() {
  allImages.forEach(eachImage => {
    eachImage.addEventListener('click', () => {
      // Board sichtbar machen wenn nicht
      if(gameBoard.classList.contains('display-none')) {
        gameBoard.classList.remove('display-none');
      }

      this.removeActiveClass(); 
      eachImage.classList.add('active'); //Adding 'active' class
      curImageSrc = eachImage.src; // Updating 
      this.sameRearrangement(); 
    });
  }); 
},

removeActiveClass: function() {
  allImages.forEach(eachImage => {
    eachImage.classList.remove('active'); // 'Active' entfernen'
  }); 
},

shuffleCells: function() {
  let cellNumbers = []; //Array 1-16
  for(let i = 1; i <= 16; i++) {
    cellNumbers.push(i);
  }

  //Zugriff auf alle Teile des Bilds
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      const getRandIdx = Math.floor(Math.random() * cellNumbers.length); 
      const randGameCell = document.querySelector(`.game-cell:nth-child(${cellNumbers[getRandIdx]})`); 
      if((i == 3) && (j == 3)) {
        randGameCell.style.background = '#fff'; // 16 Zelle weiß
        randGameCell.className = "game-cell blank"; // 'Blank' Klasse
      } else {
        randGameCell.style.background = `url('${curImageSrc}')`; // Bild auf Div´s verteilen
        randGameCell.style.backgroundPosition = `calc((100% / 3) * ${j}) calc((100% / 3) * ${i})`; // Setting position 
        randGameCell.className = "game-cell"; // 'BLank' vor shuffle entfernen
      }
      randGameCell.setAttribute('order', (i * 4) + j + 1);
      cellNumbers = cellNumbers.filter(item => item !== cellNumbers[getRandIdx]); // Löschen der used-divs
    }
  }
},

checkWin:function() {
  const gameCellsClone = [...gameCells]; // Zu Array konvertieren
  let isWin = true;

  for(i = 0; i < gameCellsClone.length; i++) {
    if(parseInt(gameCellsClone[i].getAttribute('order')) != (i + 1)) {
      isWin = false;
      break;
    }
  }

  // Win Condition
  if(isWin) {
    setTimeout(() => {	
      alert(`Congratulations! You're a 15 Puzzle Champ!`);	
    }, 500);
  }
},

sameRearrangement :function() {
  if(initialRearrangement) {
    initialRearrangement = false;

    // Zugriff von oben nach unten
    for(let i = 0; i < 4; i++) {
      for(let j = 0; j < 4; j++) {
        const seqCellOrder = (i * 4) + j + 1; 
        const seqCell = document.querySelector(`.game-cell:nth-child(${seqCellOrder})`); 
        if((i == 3) && (j == 3)) {
          seqCell.style.background = '#fff'; //Letze weiß
        } else {
          seqCell.style.background = `url('${curImageSrc}')`; // Teile des Bildes in verschiedene Zellen
          seqCell.style.backgroundPosition = `calc((100% / 3) * ${j}) calc((100% / 3) * ${i})`; // Setting position 
        }
      }
    }   
  } else {
    gameCells.forEach(gameCell => {
      if(!gameCell.classList.contains('blank')) {
        const curBackgrodundPosition = gameCell.style.backgroundPosition; // Initliazing 'curBackgrodundPosition' variable

        gameCell.style.background = `url('${curImageSrc}')`; // Replacing the div's background with current image
        gameCell.style.backgroundPosition = curBackgrodundPosition; // Setting position of each image
      }
    });
  }
},

playGame :function() {
  let shouldExecute = true;

  gameCells.forEach(gameCell => {
    gameCell.addEventListener('click', () => {
      if(!shouldExecute) return;
      shouldExecute = false;      
      // Which child ?
      const childOrder = Math.ceil(Array.from(gameBoard.childNodes).indexOf(gameCell) / 2);
      
      // 0 index für curRow,curCurColumn
      const curRow = Math.floor((childOrder - 1) / 4);
      const curColumn = (childOrder - 1) % 4;

      // Alle 4 Richtungen
      const directions = {
        top: [0, -1],
        left: [-1, 0],
        down: [0, 1],
        right: [1, 0]
      }

      // Wenn Zelle nicht blank
      if(!gameCell.classList.contains('blank')) {
        for(direction in directions) {
          //'0' index für adjacentCellRow' and 'adjacentCellColumn'
          const adjacentCellRow = curRow + directions[direction][0]; 
          const adjacentCellColumn = curColumn + directions[direction][1]; 

          // Checken ob 'adjacentCell' gültig
          if(adjacentCellRow > -1 && adjacentCellRow < 4 && adjacentCellColumn > -1 && adjacentCellColumn < 4) {
            const adjacentCellOrder = (adjacentCellRow * 4) + adjacentCellColumn + 1; // Getting the 'adjacentCellOrder' variable
            const adjacentCell = document.querySelector(`.game-cell:nth-child(${adjacentCellOrder})`); // Getting the 'adjacentCell' variable
            
            // Checken ob adjacentCell blank
            if(adjacentCell.classList.contains('blank')) {
              //  'gameCell' und 'adjacentCell' austauschen
              const tempAdjacentCellOrder = adjacentCell.getAttribute('order');

              adjacentCell.style.background = `url('${curImageSrc}')`;
              adjacentCell.style.backgroundPosition = gameCell.style.backgroundPosition;
              adjacentCell.setAttribute('order', gameCell.getAttribute('order'));	
              adjacentCell.className = "game-cell";

              gameCell.style.background = '#fff';
              gameCell.setAttribute('order', tempAdjacentCellOrder);	
              gameCell.className = "game-cell blank";

              this.checkWin(); 

              break;
            }
          }
        }
      }
      shouldExecute = true;
    });
  });
},

doShuffle: function() {
  shuffleBtn.addEventListener('click', () => {
    if(curImageSrc !== undefined) {
      this.shuffleCells(); 
    }
  });
}}
//Game
puzzle.storeCurImageSrc(); 
puzzle.playGame(); 
puzzle.doShuffle(); 