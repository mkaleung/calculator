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
        (Number(a) * cf) / (Number(b) * cf)
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
updateDisplay(displayedNumber); // Initialization *I guess i can remove this if i just set HTML to 0 instead of 0000


function appendNumber(number)  {
    if (equalFlag) {
        clearFunction();
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
        clearFunction();
    }
    if (displayedNumber.includes('.')) {
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
        updateDisplay(storedNumber);
        equalFlag = true;
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
    } else {
        storedNumber = operate(operatorMap[operation],storedNumber, displayedNumber);
        updateDisplay(storedNumber);
        displayedNumber = '';
        operation = selectOperator;
    }
}

// Set up numbers to click
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

//TODO ** How to separate operation so button clicks and keyboard works? Might have to do with optional function inputs i.e. operate(button.id (optional))
let operatorButtons = document.querySelectorAll('button.operator');
operatorButtons.forEach((button) => button.addEventListener('click', (e) => {
    applyOperation(button.id);
}))


let equalButton = document.querySelector('button#\\=');
equalButton.addEventListener('click', (e) => {
    equalFunction();
})

window.addEventListener('keydown', keyEvent);

function keyEvent(e) {
    console.log(e.keyCode)
    // Numbers
    if (e.keyCode >= 48 && e.keyCode <= 57) {
        return appendNumber(String(e.keyCode - 48));
    } else if (e.keyCode >= 96 && e.keyCode <= 105) {
        return appendNumber(String(e.keyCode - 96));
    } else {
        switch(e.keyCode) {
            case 88: case 106:
                return applyOperation('*');
            case 107:
                return applyOperation('+');
            case 109: case 189:
                return applyOperation('-');
            case 191: case 111:
                return applyOperation('/');
            case 110: case 190:
                return appendDecimal();
            case 27:
                return clearButton();
            case 77:
                return plusMinus();
            case 13:
                return equalFunction();
            case 8:
                return deleteFunction();
        }
    }


}

// TODO
// KEYBOARD SUPPORT

// REVIEW CSS, MERGE
// EXTRA EXTRA CREDIT: MEMORY/DISPLAY