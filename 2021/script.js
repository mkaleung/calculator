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
};
let displayedNumber = '0';
let truncatedNumber = '0';
let storedNumber = '';
let operation = '';
let equalFlag = false;
const screenOutput = document.querySelector('#display');
const screenLength = 11;


function updateDisplay(value) {
    if (value === 'Infinity') {
        screenOutput.textContent = "ERROR";
    } else if (value.length <= screenLength) {
        screenOutput.textContent = value;
    } else if (value.length > screenLength) {
        let result = '';

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
        screenOutput.textContent = result;
    }
}
updateDisplay(displayedNumber);


// Set up numbers to click
let numberButtons = document.querySelectorAll('button.input');
numberButtons.forEach((button) => button.addEventListener('click', (e) => {
    // Do not allow inputs > screenLength (Design Choice)
    if (displayedNumber.length >= screenLength) {return}

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


let operatorButtons = document.querySelectorAll('button.operator');
operatorButtons.forEach((button) => button.addEventListener('click', (e) => {
    if (equalFlag) { // Allows for continuing an operation after equal was pressed
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


// TODO
// KEYBOARD SUPPORT
// REVIEW CSS, MERGE
// EXTRA EXTRA CREDIT: MEMORY/DISPLAY