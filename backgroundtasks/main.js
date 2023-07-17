// Get references to HTML elements
let lengthText = document.getElementById('length');
let start = document.getElementById('startButton');
let end = document.getElementById('endButton');
let progressText = document.getElementById('progressText');
let logElem = document.getElementById('serial');
let logContainer = document.getElementById('log');
let progressBarElem = document.querySelector('progress');

// Variables to manage the code generation process
let taskHandler = null;
let chunktaskHandler = null;
let Taskend = false;

// Available characters for generating serial codes
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Array to store generated serial codes
let serialCode = [];

// Variables to track the progress and display the generated codes
let currentTaskNumber = 0;
let serial = null;
let logFragment = null;
let codeChunkLength = 0;

// Check if browser supports the api
if ("requestIdleCallback" in window) {
    // Function to append a log message to the log container
    function log(text) {
        if (!logFragment) {
            logFragment = document.createDocumentFragment();
        }

        const elem = document.createElement('span');
        elem.textContent = text;
        logFragment.appendChild(elem);
    }

    // Function to update the progress bar, log, and progress text
    function updateDisplay() {
        progressBarElem.max = lengthText.value;
        progressBarElem.value = currentTaskNumber + 1;
        log(serial);
        logElem.appendChild(logFragment);
        progressText.innerText = 'Generated ' + (currentTaskNumber + 1) + ' of ' + lengthText.value;

        // Scroll log container to the bottom if necessary
        const scrolledToEnd = logContainer.scrollHeight - logContainer.clientHeight <= logContainer.scrollTop + 1;
        if (!scrolledToEnd) {
            logContainer.scrollTop = logContainer.scrollHeight - logContainer.clientHeight;
        }
    }

    // Function to validate the input number
    function validateNumber(value) {
        if (value === '' || isNaN(value) || parseInt(value) <= 0 || parseInt(value) > Number.MAX_SAFE_INTEGER) {
            return false;
        }
        return true;
    }

    // Function to generate background tasks for serial code generation
    function generateBackgroundTasks(deadline) {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && serialCode.length && !Taskend) {
            serial = serialCode.shift();
            updateDisplay();
            currentTaskNumber++;
        }

        if (serialCode.length && !Taskend) {
            taskHandler = requestIdleCallback(generateBackgroundTasks, { timeout: 1000 });
        } else {
            lengthText.disabled = false;
            start.disabled = false;
            taskHandler = null;
        }
    }

    // Function to generate a chunk of serial codes
    function generateCodeChunk(deadline) {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && codeChunkLength < lengthText.value && !Taskend) {
            let code = '';
            for (let j = 0; j < 8; j++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            serialCode.push(code);
            codeChunkLength++;

            // If the desired number of codes is reached, start generating background tasks
            if (codeChunkLength >= lengthText.value) {
                logElem.innerText = null;
                taskHandler = requestIdleCallback(generateBackgroundTasks, { timeout: 1000 });
                break;
            }
        }

        // Continue generating code chunks if more codes are needed
        if (codeChunkLength < lengthText.value && !Taskend) {
            chunktaskHandler = requestIdleCallback(generateCodeChunk, { timeout: 1000 });
        } else {
            chunktaskHandler = null;
            taskHandler = requestIdleCallback(generateBackgroundTasks, { timeout: 1000 });
        }
    }

    // Function to initiate the serial code generation process
    function generateSerialCode() {
        const value = lengthText.value.trim();

        if (!validateNumber(value)) {
            alert('Please enter a valid number greater than zero.');
            return;
        }

        logElem.innerText = 'Processing Data....';
        currentTaskNumber = 0;
        codeChunkLength = 0;
        lengthText.disabled = true;
        start.disabled = true;
        Taskend = false;

        chunktaskHandler = requestIdleCallback(generateCodeChunk, { timeout: 1000 });
    }

    // Function to stop the serial code generation process
    function stopProcess() {
        if (logElem.innerText === 'Processing Data....') {
            logElem.innerText = null;
        }
        if (chunktaskHandler) {
            cancelIdleCallback(chunktaskHandler);
            chunktaskHandler = null;
        }
        if (taskHandler) {
            cancelIdleCallback(taskHandler);
            taskHandler = null;
        }
        lengthText.disabled = false;
        start.disabled = false;
        Taskend = true;
        serialCode = [];
        currentTaskNumber = 0;
    }

    // Event listeners for the "Start" and "End" buttons
    start.addEventListener('click', generateSerialCode);
    end.addEventListener('click', stopProcess);
}
else {
    document.body.innerText = "Your browser does not support RequestIdleCallback api";
}
