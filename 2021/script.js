// Math Operations
let cf = 10; // correction factor for floating point arithmetic

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
        (Number(a) * cf) / (Number(b) * cf) / (cf * cf)
    );
}

function operate(operator, a, b) {
    return operator(a, b);
}

let operatorMap = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide
}


let displayedNumber = '0';
let truncatedNumber = '0';
let storedNumber = '';
let operation = '';
let equalFlag = false;

function updateDisplay(value) {
    if (value.length <= 11) {
        document.querySelector('#display').textContent = value;
    } else if (value.length > 11) {
        // CURRENT ISSUE::: Javascript uses exponents too, so if they show i.e. 1.212312938129e24, then that messes with my truncation.  value.length doesn't work.
        // Also have to consider negative exp (decimals) for scientific notation
        let valueExp = value.length - 1;
        value = String(value / (10 ** (valueExp)));
        value = value.substr(0,(11 - String(valueExp).length - 1));
        value += `E${valueExp}`;
        document.querySelector('#display').textContent = value;
    }
}
updateDisplay(displayedNumber);
// TODO:
// Display shows 11 characters
// Positive is if length > 11 turn into e22


// Set up numbers to click
let numberButtons = document.querySelectorAll('button.input');
numberButtons.forEach((button) => button.addEventListener('click', (e) => {
    // Do not allow inputs > 11 digits (Design Choice)
    if (displayedNumber.length >= 11) {return}
    if (displayedNumber === '0') {  
            displayedNumber = '';
        }
    displayedNumber += button.id
    updateDisplay(displayedNumber);
    })
);

// Set up decimal
let decimalButton = document.querySelector('#\\.');
decimalButton.addEventListener('click', (e) => {
    if (displayedNumber.includes('.')) {
        return;
    }

    if (displayedNumber === '0' || !displayedNumber) {
        displayedNumber = '0.';
    } else {
        displayedNumber += '.';
    }
    updateDisplay(displayedNumber);
});

// Set up +-
let plusMinusButton = document.querySelector('#\\+\\-');
plusMinusButton.addEventListener('click', (e) => {
    if (displayedNumber === '0' || !displayedNumber) {return}
    if (displayedNumber.includes('-')) {
        displayedNumber = displayedNumber.slice(1);
    } else {
        displayedNumber = '-' + displayedNumber;
    }
    updateDisplay(displayedNumber);
})

// Setup delete and clear button
let deleteButton = document.querySelector('#delete');
deleteButton.addEventListener('click', (e) => {
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
})

function clearFunction() {
    displayedNumber = '0';
    truncatedNumber = '0';
    storedNumber = '';
    operation = '';
    updateDisplay(displayedNumber);
}


let clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', (e) => {
    clearFunction();
})

// Think about how to save history? or how to implement operations

let operatorButtons = document.querySelectorAll('button.operator');
operatorButtons.forEach((button) => button.addEventListener('click', (e) => {
    // Allows for continuing an operation after equal was pressed
    if (equalFlag) {
        equalFlag = false;
        operation = '';
    }

    if (!storedNumber) {
        storedNumber = displayedNumber;
        operation = button.id; 
        displayedNumber = ''; 
    } else if (storedNumber && !operation) { // Case for if equal was pressed, then an operator
        operation = button.id;
        updateDisplay(storedNumber);
        displayedNumber = '';
    } else {
        storedNumber = operate(operatorMap[operation],storedNumber, displayedNumber);
        updateDisplay(storedNumber);
        displayedNumber = '';
        operation = button.id;
    }
}))


let equalButton = document.querySelector('button#\\=');
equalButton.addEventListener('click', (e) => {
    // Below implementation allows for equal to repeat last operation on displayed result (i.e. 10 + 5 = 15 = 20 = 25, etc)
    if (displayedNumber, operation, storedNumber) {
        storedNumber = operate(operatorMap[operation], storedNumber, displayedNumber);
        updateDisplay(storedNumber);
        equalFlag = true;
    }
})