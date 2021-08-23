// Variables
let cf = 10; // correction factor for floating point arithmetic
let operatorMap = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide
};
let displayedNumber = '0';
let truncatedNumber = '0';
let storedNumber = '';
let operation = '';
let equalFlag = false;
let buttons = document.querySelectorAll('button');
const screenOutput = document.querySelector('#display');
const screenLength = 11;

// Math Operations
function add(a, b) {
    return String(Number(a) + Number(b));
}

function subtract(a, b) {
    return String(Number(a) - Number(b));
}

function multiply(a, b) { 
    return String(
        (Number(a) * cf) * (Number(b) * cf) / (cf * cf)
    );
}

function divide(a, b) { 
    return String(
        (Number(a) * cf) / (Number(b) * cf)
    );
}

function operate(operator, a, b) {
    return operator(a, b);
}

function updateDisplay(value) {
    if (value === 'Infinity') {
        screenOutput.textContent = "ERROR";
    } else if (value.length <= screenLength) {
        screenOutput.textContent = value;
    } else if (value.length > screenLength) {
        let result = '';
        
        // TI-84 Calculators use Scientific Notation if number are > 10**9 or < 10**-3
        if (Number(value) > 10**9 || Number(value) < 10**-3) {
            if (value.includes('e')) { // If Javascript already stored number as scientific notation
                let [number, exp] = value.split('e');
                exp = Number(exp);
                number = number.slice(0, screenLength - String(exp).length - 1)
                    result = number + 'E' + exp;
                    
            } else { // If number is greater than screenLength, convert to scientific notation
                let valueExp = value.length - 1;
                result = String(value / (10 ** (valueExp)));
                result = result.substr(0,(screenLength - String(valueExp).length - 1));
                result += `E${valueExp}`;
            }
        } else { // Else, truncate numbers with decimals to 11 characters long
            if (Number(value[screenLength - 2]) >= 5) {
                result = value.slice(0, screenLength - 1) + String(Number(value[screenLength - 1]) + 1);
            } else {
                result = value.slice(0, screenLength);
            }
        }
        screenOutput.textContent = result;
    }

    // CE clears last entry, C clears all input
    if (displayedNumber === '0' || equalFlag) {
        document.querySelector('#clear').textContent = 'C'
    } else {
        document.querySelector('#clear').textContent = 'CE'
    }

}

function appendNumber(number)  {
    if (equalFlag) {
        resetAll();
    }
    // Do not allow inputs > screenLength (Design Choice)
    if (displayedNumber.length >= screenLength) {return}

    if (displayedNumber === '0') {  
            displayedNumber = '';
        }
    displayedNumber += number;
    updateDisplay(displayedNumber);
}

function appendDecimal() {
    if (equalFlag) {
        resetAll();
    }

    // Prevents duplicate decimal or screen overflow.
    if (displayedNumber.includes('.') || displayedNumber.length > screenLength - 2) {
        return;
    }
    if (displayedNumber === '0' || !displayedNumber) {
        displayedNumber = '0.';
    } else {
        displayedNumber += '.';
    }
    updateDisplay(displayedNumber);
}

function plusMinus() {
    if (equalFlag) {
        if (storedNumber === '0' || !storedNumber) {return}
        if (storedNumber.includes('-')) {
            storedNumber = storedNumber.slice(1);
        } else {
            storedNumber = '-' + storedNumber;
        }
        updateDisplay(storedNumber);
    } else {
        if (displayedNumber === '0' || !displayedNumber) {return}
        if (displayedNumber.includes('-')) {
            displayedNumber = displayedNumber.slice(1);
        } else {
            displayedNumber = '-' + displayedNumber;
        }
        updateDisplay(displayedNumber);
    }
}

function clearFunction() {
        // CE to clear last entry. C to clear all.
        if (!displayedNumber || displayedNumber === '0' || equalFlag) {
            resetAll();
        } else {
            displayedNumber = '0';
            updateDisplay(displayedNumber);
        }
}

function resetAll() {
    displayedNumber = '0';
    truncatedNumber = '0';
    storedNumber = '';
    operation = '';
    equalFlag = false;
    updateDisplay(displayedNumber);
}

function deleteFunction() {
    if (displayedNumber != '0') {
        if (displayedNumber.length > 2
                || (displayedNumber.length > 1 && displayedNumber[0] != '-')) {
            displayedNumber = displayedNumber.slice(0, -1);
            updateDisplay(displayedNumber);
        } else if (displayedNumber.length == 1 
                || (displayedNumber.length == 2 && displayedNumber[0] === '-')) {
            displayedNumber = '0';
            updateDisplay(displayedNumber);
        } 
    }
}

function equalFunction() {
    if (displayedNumber, operation, storedNumber) {
        storedNumber = operate(operatorMap[operation], storedNumber, displayedNumber);
        equalFlag = true;
        updateDisplay(storedNumber);
    }
}

function applyOperation(selectOperator) {
    if (equalFlag) { // Allows for continuing an operation after equal was pressed
        equalFlag = false;
        operation = '';
    }
    if (!storedNumber) {
        storedNumber = displayedNumber;
        operation = selectOperator; 
        displayedNumber = ''; 
    } else if (storedNumber && !operation) { // Case for if equal was pressed, then an operator
        operation = selectOperator;
        updateDisplay(storedNumber);
        displayedNumber = '';
    } else if (!displayedNumber && operation) {
        operation = selectOperator;
    } else {
        storedNumber = operate(operatorMap[operation],storedNumber, displayedNumber);
        updateDisplay(storedNumber);
        displayedNumber = '';
        operation = selectOperator;
    }
}

// Prevents focus after clicking button for better keyboard support
buttons.forEach(button => button.addEventListener('click', (e) => {
    e.preventDefault();
    button.blur();
}));

// Add Button Animations
buttons.forEach(button => button.addEventListener('animationend', (e) => {e.target.classList.remove('keyPress')}));

// Button setup ('click')
// Set up numbers
let numberButtons = document.querySelectorAll('button.input');
numberButtons.forEach((button) => button.addEventListener('click', (e) => {
    appendNumber(button.id);
}));


// Set up decimal
let decimalButton = document.querySelector('#\\.');
decimalButton.addEventListener('click', (e) => {
    appendDecimal();
});

// Set up +-
let plusMinusButton = document.querySelector('#\\+\\-');
plusMinusButton.addEventListener('click', (e) => {
    plusMinus();
})

// Set up delete
let deleteButton = document.querySelector('#delete');
deleteButton.addEventListener('click', (e) => {
    deleteFunction();
})

// Set up clear button
let clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', (e) => {
    clearFunction();
})

// Set up Operations
let operatorButtons = document.querySelectorAll('button.operator');
operatorButtons.forEach((button) => button.addEventListener('click', (e) => {
    applyOperation(button.id);
}))

// Set up equal
let equalButton = document.querySelector('button#\\=');
equalButton.addEventListener('click', (e) => {
    equalFunction();
})

// Keyboard Setup ('keydown')
window.addEventListener('keydown', keyEvent);

function keyEvent(e) {
    console.log(e.keyCode)
    // Numbers
    if (e.keyCode >= 48 && e.keyCode <= 57) {
        document.getElementById(String(e.keyCode - 48)).classList.add('keyPress');
        return appendNumber(String(e.keyCode - 48));
    } else if (e.keyCode >= 96 && e.keyCode <= 105) {
        document.getElementById(String(e.keyCode - 96)).classList.add('keyPress');
        return appendNumber(String(e.keyCode - 96));
    } else {
        switch(e.keyCode) {
            case 88: case 106: case 170:
                document.getElementById('*').classList.add('keyPress');
                return applyOperation('*');
            case 107:
                document.getElementById('+').classList.add('keyPress');
                return applyOperation('+');
            case 109: case 189:
                document.getElementById('-').classList.add('keyPress');
                return applyOperation('-');
            case 191: case 111:
                document.getElementById('/').classList.add('keyPress');
                return applyOperation('/');
            case 108: case 110: case 190:
                document.getElementById('.').classList.add('keyPress');
                return appendDecimal();
            case 27:
                document.getElementById('clear').classList.add('keyPress');
                return clearFunction();
            case 77:
                document.getElementById('+-').classList.add('keyPress');
                return plusMinus();
            case 13: case 187:
                document.getElementById('=').classList.add('keyPress');
                return equalFunction();
            case 8:
                document.getElementById('delete').classList.add('keyPress');
                return deleteFunction();
        }
    }
}

// Toggle Help Button
document.querySelector('#help').onclick = function() {
    let element = document.querySelector('#helpBar');
    if (element.className === 'hide') {
      element.className = 'show';
      document.querySelector('#help').className = 'active';
    } else {
      element.className = 'hide';
      document.querySelector('#help').className = '';
    }
}
