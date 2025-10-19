// Calculator state
let display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    setupButtonAnimations();
    setupResizeHandle();
    positionTitleLogoBlock();
});

// Update display
function updateDisplay() {
    display.textContent = currentInput;
}

// Input number
function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

// Input decimal point
function inputDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

// Set operation
function setOperation(op) {
    if (operation !== null) {
        calculate();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetDisplay = true;
}

// Calculate result
function calculate() {
    if (operation === null || shouldResetDisplay) return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current !== 0 ? prev / current : 0;
            break;
        default:
            return;
    }

    // Format result to avoid floating point precision issues
    if (result % 1 !== 0) {
        result = parseFloat(result.toFixed(10));
    }

    currentInput = result.toString();
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear all
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Toggle sign
function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.charAt(0) === '-' ? 
            currentInput.slice(1) : '-' + currentInput;
        updateDisplay();
    }
}

// Percentage
function percentage() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

// Setup button press animations
function setupButtonAnimations() {
    const buttons = document.querySelectorAll('.calc-button');
    buttons.forEach(button => {
        const circle = button.querySelector('.button-circle');
        
        button.addEventListener('mousedown', function() {
            circle.classList.add('pressed');
        });
        
        button.addEventListener('mouseup', function() {
            circle.classList.remove('pressed');
        });
        
        button.addEventListener('mouseleave', function() {
            circle.classList.remove('pressed');
        });
    });
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    }
    
    // Decimal point
    if (key === '.' || key === ',') {
        inputDecimal();
    }
    
    // Operations
    if (key === '+') {
        setOperation('+');
    } else if (key === '-') {
        setOperation('-');
    } else if (key === '*') {
        setOperation('*');
    } else if (key === '/') {
        setOperation('/');
    }
    
    // Calculate
    if (key === 'Enter' || key === '=') {
        calculate();
    }
    
    // Clear
    if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    }
    
    // Prevent default for calculator keys
    if ('0123456789+-*/.=,EnterEscapecC'.includes(key)) {
        event.preventDefault();
    }
});

// Resize handling for calculator
function setupResizeHandle() {
    const wrapper = document.getElementById('calculatorResizable');
    const handle = document.getElementById('resizeHandle');
    if (!wrapper || !handle) return;

    const minWidth = 435;  // Figma minimum
    const minHeight = 663; // Figma minimum

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startWidth = minWidth;
    let startHeight = minHeight;

    function applySize(width, height) {
        wrapper.style.width = width + 'px';
        wrapper.style.height = height + 'px';
        // Typography scales naturally because layout is percentage-based grid and flex
        // The inner .calculator-container uses 100% width/height to fill
    }

    handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDragging = true;
        const rect = wrapper.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = rect.width;
        startHeight = rect.height;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Free aspect resize with independent width/height deltas
        let newWidth = Math.max(minWidth, Math.round(startWidth + dx));
        let newHeight = Math.max(minHeight, Math.round(startHeight + dy));

        applySize(newWidth, newHeight);
    });

    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
        // Reposition title logo block after resize ends
        positionTitleLogoBlock();
    });
}

// Position the title-logo-block aligned to calculator bottom
function positionTitleLogoBlock() {
    const wrapper = document.getElementById('calculatorResizable');
    const block = document.getElementById('titleLogoBlock');
    if (!wrapper || !block) return;

    const wrapperRect = wrapper.getBoundingClientRect();

    // Align bottoms: set block bottom equal to distance from viewport bottom to wrapper bottom
    const viewportHeight = window.innerHeight;
    const distanceFromBottom = viewportHeight - wrapperRect.bottom;
    block.style.bottom = distanceFromBottom + 'px';

    // Center horizontally between left page edge (x=0) and wrapper's left edge
    const centerX = wrapperRect.left / 2; // midpoint between 0 and wrapper left
    const blockHalfWidth = block.offsetWidth / 2;
    const left = Math.max(0, Math.round(centerX - blockHalfWidth));
    block.style.left = left + 'px';
}

window.addEventListener('resize', positionTitleLogoBlock);
