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
