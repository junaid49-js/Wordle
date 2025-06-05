// Import word list & search utility
import { allWords, binarySearch } from './wordList.js';

// Selectors
const letterBoxes = document.querySelectorAll('.input');
const keyboardKeys = document.querySelectorAll('.keys');
const rows = [
    document.querySelectorAll('.firstLetterRow'),
    document.querySelectorAll('.secondLetterRow'),
    document.querySelectorAll('.thirdLetterRow'),
    document.querySelectorAll('.fourthLetterRow'),
    document.querySelectorAll('.fifthLetterRow'),
    document.querySelectorAll('.sixthLetterRow')
];

// Game state
let currentRow = 0;
let currentPosition = 0;
let wordArray = [];
let currentGuessWordForBinarySearch = getRandomWord(allWords);
let currentGuessWord = currentGuessWordForBinarySearch.toUpperCase();
let guessWordArray = Array.from(currentGuessWord);

console.log("Secret Word:", currentGuessWord);

function getRandomWord(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function updateLetterBox(letter) {
    if (currentPosition < 5) {
        rows[currentRow][currentPosition].textContent = letter;
        wordArray.push(letter);
        currentPosition++;
    }
}

function deleteLastLetter() {
    if (currentPosition > 0) {
        currentPosition--;
        rows[currentRow][currentPosition].textContent = '';
        wordArray.pop();
    }
}

function clearCurrentRow() {
    rows[currentRow].forEach(box => box.textContent = '');
    wordArray = [];
    currentPosition = 0;
}

function colorizeRow() {
    const cells = rows[currentRow];
    const matched = Array(5).fill(false);
    const guessCopy = [...guessWordArray];

    // First pass: correct (green)
    for (let i = 0; i < 5; i++) {
        if (wordArray[i] === guessCopy[i]) {
            cells[i].classList.remove('present', 'absent');
            cells[i].classList.add('correct');
            matched[i] = true;
            guessCopy[i] = null;
        }
    }

    // Second pass: present (yellow) / absent (gray)
    for (let i = 0; i < 5; i++) {
        if (cells[i].classList.contains('correct')) continue;
        const index = guessCopy.indexOf(wordArray[i]);
        if (index !== -1) {
            cells[i].classList.remove('correct', 'absent');
            cells[i].classList.add('present');
            guessCopy[index] = null;
        } else {
            cells[i].classList.remove('correct', 'present');
            cells[i].classList.add('absent');
        }
    }
}

function resetGame() {
    letterBoxes.forEach(box => {
        box.textContent = '';
        box.classList.remove('correct', 'present', 'absent');
    });

    wordArray = [];
    currentRow = 0;
    currentPosition = 0;
    currentGuessWordForBinarySearch = getRandomWord(allWords);
    currentGuessWord = currentGuessWordForBinarySearch.toUpperCase();
    guessWordArray = Array.from(currentGuessWord);
    console.log("New Secret Word:", currentGuessWord);
}

function handleEnterKey() {
    if (currentPosition !== 5) return;

    const wordEntered = wordArray.join('');
    const wordExists = binarySearch(allWords, wordEntered) !== -1;

    if (!wordExists) {
        alert("Word doesn't exist!");
        clearCurrentRow();
        return;
    }

    colorizeRow();

    if (wordEntered === currentGuessWord) {
        alert("Congrats, You won!!!");
        setTimeout(resetGame, 1000);
        return;
    }

    currentRow++;
    currentPosition = 0;
    wordArray = [];

    if (currentRow === 6) {
        alert(`You have lost.\nThe word was ${currentGuessWord}`);
        setTimeout(resetGame, 1000);
    }
}

// Keyboard listeners
document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();

    if (/^[A-Z]$/.test(key)) {
        updateLetterBox(key);
    } else if (e.key === 'Backspace') {
        deleteLastLetter();
    } else if (e.key === 'Enter') {
        handleEnterKey();
    }
});

// Virtual keyboard listeners
keyboardKeys.forEach(key => {
    key.addEventListener('click', () => {
        const keyText = key.textContent.trim().toUpperCase();

        if (keyText.length === 1 && /[A-Z]/.test(keyText)) {
            updateLetterBox(keyText);
        } else if (key.id === 'backspace') {
            deleteLastLetter();
        } else if (key.id === 'enterKey') {
            handleEnterKey();
        }
    });
});
