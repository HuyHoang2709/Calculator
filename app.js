const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const expressionDisplay = $('.cal__expression');
const operand1Display = $('.cal__operand1');
const operatorDisplay = $('.cal__operator');
const operand2Display = $('.cal__operand2');
const resultDisplay = $('.cal__result');

const clearBtn = $('.cal__number-clear');
const signBtn = $('.cal__number-sign');
const percentBtn = $('.cal__number-percent');
const commaBtn = $('.cal__number-comma');
const numberBtns = $$('.cal__number-btn');

const funcBtns = $$('.cal__func-btn');
const OPERATORS = [':', 'x', '-', '+'];
const NUMBERS = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

var hasOperator = false;
var hasOperand2 = false;
var hasResult = false;
var isActive = false;
var isOperand1Sign = false;
var isOperand2Sign = false;
var isResultSign = false;
var hasDecimalPlace = false;

var operand1 = 0;
var operator = '';
var operand2 = 0;
var fixDecimal = 1;
var countDecimal = 10;
var percentDecimal = 0;
var result;
var temp;
var resultLength;
var expressionLength;

function displayHandler() {
    if(hasOperator === false) {
        operand1Display.innerText = operand1;
        operatorDisplay.innerText = '';
        operand2Display.innerText = '';
    }
    else {
        operand1Display.innerText = operand1;
        // Update operand1 here to conduct a continuous calculation
        
        operatorDisplay.innerText = operator;

        if(hasOperand2) {
            operand2Display.innerText = operand2;
        }
        else {
            operand2Display.innerText = '';
        }

        if(hasResult) {
            resultDisplay.innerText = result;
            if(isActive === false) {
                expressionDisplay.classList.add('active');
                resultDisplay.classList.add('show');
                isActive = true;
            }
        }
    }
}

function optimizeResult() {
    // Round decimal so calculator can display the result properly
    if(Number.isInteger(result) == false) {
        result = result.toFixed(8);
        
        // Remove redundant '0' number in decimal place
        resultLength = result.length;
        let count = 0;
        for(let i = resultLength - 1; i >= 0; i--) {
            if(result[i] != '0') break;
            ++count;
        }
        result = result.slice(0, resultLength - count);
    }
    else {
        result = String(result);
    }

    // Adjust font size when result is too long
    resultLength = result.length;

    if(resultLength < 10) {
        if(resultDisplay.classList.contains('medium')) {
            resultDisplay.classList.remove('medium');
        } 
        if(resultDisplay.classList.contains('small')) {
            resultDisplay.classList.remove('small');
        } 
        if(resultDisplay.classList.contains('tiny')) {
            resultDisplay.classList.remove('tiny');
        } 
    }
    else if(resultLength > 10 && resultLength <= 12) {
        resultDisplay.classList.add('medium');
    }
    else if(resultLength > 12 && resultLength <= 16) {
        resultDisplay.classList.add('small');
    }
    else if(resultLength > 16) {
        resultDisplay.classList.add('tiny');
    }
}

function calculate(operand1, operand2, operator) {
    switch(operator) {
        case '+': return operand1 + operand2;
        case '-': return operand1 - operand2;
        case 'x': return operand1 * operand2;
        case ':': return operand1 / operand2;
    }
}

function input(operand, index) {
    if(hasDecimalPlace) {
        let temp = operand + NUMBERS[index] / countDecimal;
        temp = Number(temp.toFixed(fixDecimal));
        countDecimal *= 10;
        ++fixDecimal;
        return temp;
    }
    return operand * 10 + NUMBERS[index];
}

function percentDecimalCalculate(number) {
    if(Number.isInteger(number) === false) {
        let tempstr = String(number);
        percentDecimal = tempstr.slice(tempstr.indexOf('.')).length + 2;
    }
    else percentDecimal = 2;
}

numberBtns.forEach(function(btn, index) {
    btn.onclick = function() {
        // Remove active status of comma btn (if needed)
        if(commaBtn.classList.contains('cal__number-comma--active')) {
            commaBtn.classList.remove('cal__number-comma--active')
        }

        // Number input
        if(hasOperator === false) {
            operand1 = input(operand1, index);
            displayHandler();
        }
        else {
            if(hasResult === false) {
                operand2 = input(operand2, index);
                hasOperand2 = true;
                displayHandler();
            }
            else {
                resetAll();
                operand1 = input(operand1, index);
                displayHandler();
            }
        }
    }
})

funcBtns.forEach(function(btn, index) {
    btn.onclick = function() {
        // Reset temporary memory of calculator about comma
        hasDecimalPlace = false;
        countDecimal = 10;
        fixDecimal = 1;

        // Handle operator btns click
        if(index < 4) {
            if(hasOperand2 === false) {
                hasOperator = true;
                operator = OPERATORS[index];
                displayHandler();
            }
            else {
                // Handle continuous calculations
                if(hasResult === false) {
                    operand1 = calculate(operand1, operand2, operator);
                    operator = OPERATORS[index];
                    operand2 = 0;
                    hasOperand2 = false;
                }
                else {
                    hasOperand2 = false;
                    hasResult = false;
                    isActive = false;

                    operator = OPERATORS[index];
                    operand1 = temp;
                    operand2 = 0;

                    expressionDisplay.classList.remove('active');
                    resultDisplay.classList.remove('show');
                }
                displayHandler();
            }
        }
        // Handle equal btn click
        else {
            if(hasOperator) {
                if(!hasOperand2) {
                    operand2 = operand1;
                    hasOperand2 = true;
                }
                if(hasOperand2) {
                    if(hasResult === true) {
                        operand1 = temp;
                    }
                    result = calculate(operand1, operand2, operator);
                    hasResult = true;
                    optimizeResult();
                    temp = Number(result);
                    displayHandler();
                }
            }
        }
    }
})

function resetAll() {
    operand1 = 0;
    operator = '';
    operand2 = 0;
    fixDecimal = 1;
    countDecimal = 10;
    percentDecimal = 0;

    isOperand1Sign = false;
    isOperand2Sign = false;
    isResultSign = false;

    hasOperator = false;
    hasOperand2 = false;
    hasResult = false;
    hasDecimalPlace = false;
    isActive = false;


    expressionDisplay.classList.remove('active');
    resultDisplay.classList.remove('show');
    if(commaBtn.classList.contains('cal__number-comma--active')) {
        commaBtn.classList.remove('cal__number-comma--active')
    }

    displayHandler();
}

// Onclick handler
clearBtn.onclick = function() {
    resetAll();
}

signBtn.onclick = function() {
    if(hasOperator === false) {
        operand1 = operand1 * (-1);
    }
    else {
        if(hasResult == false) {
            operand2 = operand2 * (-1);
        }
        else {
            hasOperand2 = false;
            hasOperator = false;
            hasResult = false;
            isActive = false;

            operator = '';
            operand1 = temp * (-1);
            operand2 = 0;

            expressionDisplay.classList.remove('active');
            resultDisplay.classList.remove('show');
        }
    }
    displayHandler();
}

percentBtn.onclick = function() {
    if(hasOperator === false) {
        percentDecimalCalculate(operand1);
        operand1 = Number((operand1 / 100).toFixed(percentDecimal));
        percentDecimal += 2;
    }
    else {
        if(hasResult == false) {
            percentDecimalCalculate(operand2)
            operand2 = Number((operand2 / 100).toFixed(percentDecimal));
            percentDecimal += 2;
        }
        else {
            hasOperand2 = false;
            hasOperator = false;
            hasResult = false;
            isActive = false;

            operator = '';
            percentDecimalCalculate(temp);
            operand1 = Number((temp / 100).toFixed(percentDecimal));
            percentDecimal += 2;
            operand2 = 0;

            expressionDisplay.classList.remove('active');
            resultDisplay.classList.remove('show');
        }
    }
    displayHandler();
}

commaBtn.onclick = function() {
    hasDecimalPlace = true;
    if(!commaBtn.classList.contains('cal__number-comma--active')) {
        commaBtn.classList.add('cal__number-comma--active');
    }
}