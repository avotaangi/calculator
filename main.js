let is_result = true;

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function compile(str) {
    let out = [];
    let stack = [];
    if (str.length > 0 && str.at(0) === '-') {
        str = '0' + str;
    } else if (str.length > 0 && str.at(0) === '+') {
        str = str.slice(1);
    }
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1])
            && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

function performOperation(a, b, operator) {
    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) {
                throw new Error('Division by zero');
            }
            return a / b;
        default:
            throw new Error('Invalid operator');
    }
}

function evaluate(str) {
    let arr = [];
    let znach = str.split(' ');

    for (symbol of znach) {
        if (isNumeric(symbol)) {
            arr.push(parseFloat(symbol));
        } else if (isOperation(symbol)) {
            let oper2 = arr.pop();
            let oper1 = arr.pop();
            let result = performOperation(oper1, oper2, symbol);
            arr.push(result);
        }
    }
    return arr.pop();
}

function clickHandler(event) {
    const screen = document.querySelector('.screen');
    const target = event.target;

    if (target.classList.contains('digit')
        || target.classList.contains('operation')
        || target.classList.contains('bracket')) {
        if (is_result === true && target.classList.contains('digit') || screen.textContent.trim() === '0' || screen.textContent.trim() === 'Error') {
            screen.textContent = '';
        }
        screen.textContent += target.textContent;
        is_result = false;
    } else if (target.classList.contains('modifier')) {
        screen.textContent = '0';
        is_result = true;
    } else if (target.classList.contains('result')) {
        try {
            const expression = screen.textContent;
            const result = evaluate(compile(expression));
            if (isNaN(result)) {
                throw new Error('NaN value');
            }
            screen.textContent = result.toFixed(2);
            if (screen.textContent.includes('.') && screen.textContent.endsWith('.00')) {
                screen.textContent = screen.textContent.slice(0, -3);
            } else if (screen.textContent.endsWith('0')) {
                screen.textContent = screen.textContent.slice(0, -1);
            }

        } catch (error) {
            screen.textContent = 'Error';
            console.error(error);
        }
        is_result = true;
    }
}

window.onload = function () {
    is_result = true;
    const calculator = document.querySelector('.calculate');
    calculator.addEventListener('click', clickHandler);
};
