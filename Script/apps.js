function fixAccuracy(mathOperation) {
    if (mathOperation.toString().includes('.')) {
        let indexDot = mathOperation.toString().indexOf('.');
        let len = mathOperation.toString().length - 2-2;
        if (len > 12) {
        // Converting to string to number will remove trailing 0's
            return Number(mathOperation.toFixed(len).toString());
        }
    }
    return mathOperation;
}

// Math Operations
function add(a, b) {
    return fixAccuracy(a+b);
}

function subtract(a, b) {
    return fixAccuracy(a-b);
}

function multiply(a, b) {
    return fixAccuracy(a*b);
}

function divide(a, b) {
    if (b == 0) {
        return 'E R R O R'
    }
    return fixAccuracy(a/b);
}

let operation = '';
let displayedNumber = '0';
let firstValue = '';
let secondValue = '';
let isEqual = false;
let isCurrent = false;
let previousOperator = '';
let buttons = document.querySelectorAll('button');

buttons.forEach(button => button.addEventListener('click', (e) => {
    operation = button.id;
    operate(operation);
    event.preventDefault();

    // Removes focus after clicking. Since it conflicts with keyboard inputs
    button.blur();
}));

// Use animation + keyframes to add/remove keyboard animations
buttons.forEach(button => button.addEventListener('animationend', (e) => {e.target.classList.remove('keyPress')}));

window.addEventListener('keydown', keyEvent);
function keyEvent(e) {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
        
        document.getElementById(String(e.keyCode - 48)).classList.add('keyPress');
        return operate(String(e.keyCode - 48));
    } else if (e.keyCode >= 96 && e.keyCode <= 105) {
        
        document.getElementById(String(e.keyCode - 96)).classList.add('keyPress');
        return operate(String(e.keyCode - 96));
    } else {
        switch(e.keyCode) {
            case 9:
                document.getElementById('+-').classList.add('keyPress');
                return operate('+-');
                break;
            case 111: case 19:                
                document.getElementById('/').classList.add('keyPress');
                return operate('/');
            case 106: case 88:                
                document.getElementById('*').classList.add('keyPress');
                return operate('*');
            case 109: case 189:                
                document.getElementById('-').classList.add('keyPress');
                return operate('-');
            case 107:                
                document.getElementById('+').classList.add('keyPress');
                return operate('+');
            case 13:                
                document.getElementById('=').classList.add('keyPress');
                return operate('=');
            case 110: case 190:                
                document.getElementById('.').classList.add('keyPress');
                return operate('.');
            case 27:                
                document.getElementById('clear').classList.add('keyPress');
                return operate('clear');
            case 8:
                document.getElementById('delete').classList.add('keyPress');
                return operate('delete');
        }
    }
}


function operate(operation) {
    if (displayedNumber === 'ERROR') {
        reset();
    }
    switch(operation) {
        case '0': case '1': case '2': case '3':
        case '4': case '5': case '6': case '7': 
        case '8': case '9':
            // Resets to accept next entry if last operation was equal
            if (isEqual) {
                if (previousOperator === ''){
                    reset()
                }
            }
            // Remove current operation flag after new input (for secondValue)
            isCurrent = false;

            if (displayedNumber === '0') {
                displayedNumber = operation;
            } 
            // Do not allow for input greater than 12
            else if (displayedNumber.length < 12) {
                displayedNumber += operation;
            }
            return updateDisplay();

        case '.':
            if (isEqual) {
                displayedNumber = '0';
                isEqual = false;
            }
            if (!displayedNumber.includes('.')){
                displayedNumber += operation;
                updateDisplay();
            }
            break;
        case '+-':
            if (displayedNumber != '0') {        
                if (displayedNumber[0] == '-') {
                    displayedNumber = displayedNumber.slice(1);
                } else {
                    displayedNumber = '-' + displayedNumber;
                }
                updateDisplay();
            }
            break;

        case '+': case '-': case '*': case '/': case '=':
            if (isCurrent && operation != '=') {
                // Updates if user changes operation before entering second value.
                previousOperator = operation;
                displayedNumber = '0';
                return;
            }


            if (!previousOperator) {
                if (operation === '=') {
                    isEqual = true;
                    break;
                }
                firstValue = displayedNumber;
                previousOperator = operation;
                displayedNumber = '0'
                isEqual = false;

            } else {
                    secondValue = displayedNumber;
                    displayedNumber = String(calculate(firstValue, secondValue, previousOperator));
                    updateDisplay()
                    firstValue = displayedNumber;
                    secondValue = '';
                
                if (operation != '='){
                    previousOperator = operation;
                    displayedNumber = '0';
                } else {
                    // By not changing 'displayedNumber', we can keep hitting equal and nothing will happen. Also, we can choose to continue with another operation afterwards.
                    previousOperator = '';
                    // displayedNumber = '0';
                    isEqual = true;
                }
            }
            isCurrent = true;
            break;

        case 'clear': 
            ///
            if (displayedNumber === '0') {
                return reset();
            } else {
                displayedNumber = '0';
                return updateDisplay();
            }
        case 'delete':
            if (displayedNumber != '0') {
                if (displayedNumber.length === 1) {
                    displayedNumber = '0';
                } else {
                    displayedNumber = displayedNumber.slice(0,(displayedNumber.length-1));
                }
            return updateDisplay();
            }
        }
}

function reset() {
    displayedNumber = '0';
    updateDisplay();
    firstValue = '';
    secondValue = '';
    isEqual = false;
    isCurrent = false;
    previousOperator = '';
}


function calculate(a, b, operator) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch(String(operator)) { 
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
    }
}

function updateDisplay() {
    // Update C and CE button according to display status
    if (displayedNumber === '0') {
        document.querySelector('#clear').textContent = 'C'
    } else {
        document.querySelector('#clear').textContent = 'CE'
    }


    if (displayedNumber.length > 12) {
        let newDisplay = '';     
        newDisplay = (+displayedNumber).toExponential(5);
        return document.querySelector('.display').textContent = newDisplay;
        }
    return document.querySelector('.display').textContent = displayedNumber;
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