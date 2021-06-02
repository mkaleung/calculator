// Math Operations
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) { 
    return a * b;
}

function divide(a, b) { 
    return a / b;
}

function operate(operator, a, b) {
    return operator(a, b);
}


let displayedNumber = '0';
let lastOperation = ''

function updateDisplay() {
    document.querySelector('#display').textContent = displayedNumber;
}

// Set up numbers to click
let numberButtons = document.querySelectorAll('button.input');
numberButtons.forEach((button) => button.addEventListener('click', (e) => {
        if (displayedNumber === '0') {
            displayedNumber = '';
        }
        displayedNumber += button.id
        updateDisplay();
    })
);

// Set up decimal
let decimalButton = document.querySelector('#\\.');
decimalButton.addEventListener('click', (e) => {
    if (displayedNumber.includes('.')) {
        return;
    }

    if (displayedNumber === 0) {
        displayedNumber = '0.';
    } else {
        displayedNumber += '.';
    }
    updateDisplay();
});

// Set up +-
let plusMinusButton = document.querySelector('#\\+\\-');
plusMinusButton.addEventListener('click', (e) => {
    if (displayedNumber.includes('-')) {
        displayedNumber = displayedNumber.slice(1);
    } else {
        displayedNumber = '-' + displayedNumber;
    }
    updateDisplay();
})

// Setup delete and clear button
let deleteButton = document.querySelector('#delete');
deleteButton.addEventListener('click', (e) => {
    if (displayedNumber != '0') {
        if (displayedNumber.length > 2
                || (displayedNumber.length > 1 && displayedNumber[0] != '-')) {
            displayedNumber = displayedNumber.slice(0, -1);
            updateDisplay();
        } else if (displayedNumber.length == 1 
                || (displayedNumber.length == 2 && displayedNumber[0] === '-')) {
            displayedNumber = '0';
            updateDisplay();
        } 
    }
})

let clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', (e) => {
    displayedNumber = '0';
    updateDisplay();
})

// Think about how to save history? or how to implement operations