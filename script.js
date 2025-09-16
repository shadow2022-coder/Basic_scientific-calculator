let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

function updateDisplay() {
    if (currentInput === '') {
        display.textContent = '0';
    } else {
        display.textContent = currentInput.replace(/Math\./g, '').replace(/\*\*/g, '^');
    }
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    // Handle special cases
    if (value === '**') {
        currentInput += '**';
    } else if (value === '**3') {
        currentInput += '**3';
    } else if (value === 'Math.PI') {
        currentInput += Math.PI;
    } else if (value === 'Math.E') {
        currentInput += Math.E;
    } else if (value === '1/') {
        currentInput += '1/';
    } else {
        currentInput += value;
    }
    
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    updateDisplay();
}

function clearEntry() {
    currentInput = '';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.endsWith('Math.sin(')) {
        currentInput = currentInput.slice(0, -9);
    } else if (currentInput.endsWith('Math.cos(')) {
        currentInput = currentInput.slice(0, -9);
    } else if (currentInput.endsWith('Math.tan(')) {
        currentInput = currentInput.slice(0, -9);
    } else if (currentInput.endsWith('Math.log10(')) {
        currentInput = currentInput.slice(0, -11);
    } else if (currentInput.endsWith('Math.log(')) {
        currentInput = currentInput.slice(0, -9);
    } else if (currentInput.endsWith('Math.sqrt(')) {
        currentInput = currentInput.slice(0, -10);
    } else if (currentInput.endsWith('Math.pow(')) {
        currentInput = currentInput.slice(0, -9);
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function calculate() {
    try {
        if (currentInput === '') return;

        // Replace display-friendly symbols with JavaScript equivalents
        let expression = currentInput;
        
        // Handle trigonometric functions (convert degrees to radians)
        expression = expression.replace(/Math\.sin\(/g, 'Math.sin(Math.PI/180*');
        expression = expression.replace(/Math\.cos\(/g, 'Math.cos(Math.PI/180*');
        expression = expression.replace(/Math\.tan\(/g, 'Math.tan(Math.PI/180*');

        // Evaluate the expression
        let result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }

        // Format the result
        if (result % 1 === 0 && Math.abs(result) < 1e10) {
            currentInput = result.toString();
        } else {
            currentInput = parseFloat(result.toFixed(10)).toString();
        }
        
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        display.textContent = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key === '*' ? '*' : key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    }
});

// Initialize display
updateDisplay();
