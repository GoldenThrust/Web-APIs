// Get the canvas and its 2D rendering context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initialize variables
let isCharging = false;
let chargeAnimation = null;
let batteryLevel = 100;
let batteryTime = "- cannot check battery time on your device";

// Set the canvas width and height based on the device pixel ratio for better resolution
if (devicePixelRatio) {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
} else {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
}

// Get the background color of the document body
let computedStyle = getComputedStyle(document.body);
let backgroundColor = computedStyle.backgroundColor;

// Set the image smoothing quality to high for better graphics
ctx.imageSmoothingQuality = "high";

// Calculate some helper variables for positioning
let halfCanvasWidth = canvas.width / 2;
let halfCanvasHeight = canvas.height / 2;
let canvasDepth = canvas.width + canvas.height;

// Battery Data object to store battery information for the line chart
let batteryData = {
    time: [0],
    level: [0]
};

function averagebatteryTime(arr)
{
    let sum = arr.reduce((accumulator, currentValue)=>{
        return accumulator + currentValue
    })
    return sum/arr.length;
}
// Theme variable to track the current theme (white or black)
let theme = "white";

// Check if there is saved Battery Data in the local storage for the graph and update the batteryData object
if (localStorage.getItem("graphTime") && localStorage.getItem("graphLevel")) {
    let tmpTime = localStorage.getItem("graphTime").split(",");
    let tmpLevel = localStorage.getItem("graphLevel").split(",");
    batteryData.time = [];
    batteryData.level = [];
    for (let i = 0; i < tmpTime.length; i++) {
        batteryData.time.push(Number(tmpTime[i]));
        batteryData.level.push(Number(tmpLevel[i]));
    }
}

// Event listener for window resize to adjust the canvas size accordingly
addEventListener("resize", () => {
    if (devicePixelRatio) {
        canvas.width = innerWidth * devicePixelRatio;
        canvas.height = innerHeight * devicePixelRatio;
    } else {
        canvas.width = innerWidth * devicePixelRatio;
        canvas.height = innerHeight * devicePixelRatio;
    }
    // Recalculate and redraw the battery graphic
    calculateBattery();
});

// Call the calculateBattery function to initialize battery data
calculateBattery();

// Function to calculate a percentage of a number
function calculatePercentage(num, percent) {
    return ((percent / 100) * num);
}

// Event listener for click event to toggle between white and black themes
let isLightTheme = false;
const rootStyle = document.documentElement.style;
canvas.addEventListener("click", () => {
    if (isLightTheme) {
        theme = "black";
        document.body.style.backgroundColor = "white";
        backgroundColor = "white";
        rootStyle.setProperty("--theme", theme);
    } else {
        theme = "white";
        document.body.style.backgroundColor = "black";
        backgroundColor = "black";
        rootStyle.setProperty("--theme", theme);
    }
    // Redraw the battery graphic with the new theme
    drawBattery();
    isLightTheme = !isLightTheme;
});

// Function to draw a stroke with the given stroke width, color, and position percentage
function drawStroke(strokeWidth, color, posPercent) {
    const sideStrokeRadius = calculatePercentage(canvasDepth, posPercent);

    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;
    ctx.arc(halfCanvasWidth, halfCanvasHeight - calculatePercentage(canvasDepth, 2), sideStrokeRadius, 0, Math.PI * 2);
    ctx.stroke();
}

// Function to draw the battery graphic
function drawBattery() {
    // Get the current battery level and charging status
    // let batteryLevel = batteryLevel;
    // let isCharging = isCharging;
    let estimatedTime = "Estimated time remaining " + batteryTime;

    // Determine the color based on battery level and charging status
    let color;
    if (isCharging || batteryLevel > 70)
        color = "springgreen";
    else if (batteryLevel < 30)
        color = "red";
    else
        color = "hsl(" + 1 * batteryLevel + ", 100%, 50%)";

    // Calculate some sizes for drawing elements
    let width = (canvasDepth) / 100;
    let fontSize = (canvasDepth) / 22.5;

    // Clear the canvas and draw the battery shape
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'butt';
    drawStroke(width + 5, color, 7);
    drawStroke(width, backgroundColor, 7);
    ctx.beginPath();
    ctx.lineWidth = width + 5;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.font = fontSize + "px sans-serif";
    const startAngle = -Math.PI / 2;
    const endAngle = (Math.PI / 180) * ((batteryLevel / 100) * 360) + startAngle;
    ctx.arc(halfCanvasWidth, halfCanvasHeight - calculatePercentage(canvasDepth, 2), calculatePercentage(canvasDepth, 7), startAngle, endAngle);

    // Draw the battery percentage text
    const textWidth = ctx.measureText(batteryLevel + "%").width;
    const textX = halfCanvasWidth - textWidth / 2;
    const textY = halfCanvasHeight + calculatePercentage(canvasDepth, -0.2);
    ctx.fillText(batteryLevel + "%", textX, textY);
    ctx.stroke();

    // Cancel the previous chargeAnimation if running
    if (chargeAnimation) {
        cancelAnimationFrame(chargeAnimation);
    }

    // Function to animate the charging effect
    let offset = 0;
    function animateCharging() {
        ctx.clearRect(halfCanvasWidth - calculatePercentage(canvasDepth, 1), halfCanvasHeight - calculatePercentage(canvasDepth, -0.5), calculatePercentage(canvasDepth, 1.5), calculatePercentage(canvasDepth, 3));
        offset++;
        if (offset > 10) {
            offset = 0;
        }

        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -offset;

        ctx.strokeStyle = "springgreen";
        ctx.beginPath();
        ctx.moveTo(halfCanvasWidth, halfCanvasHeight + calculatePercentage(canvasDepth, 1))
        ctx.lineWidth = (canvasDepth) / 280;
        ctx.lineCap = "round";
        ctx.shadowColor = "lightblue";
        ctx.shadowBlur = 4;
        ctx.lineTo(halfCanvasWidth + calculatePercentage(canvasDepth, -0.5), halfCanvasHeight + calculatePercentage(canvasDepth, 2));
        ctx.lineTo(halfCanvasWidth + calculatePercentage(canvasDepth, 0.005), halfCanvasHeight + calculatePercentage(canvasDepth, 2));
        ctx.lineTo(halfCanvasWidth + calculatePercentage(canvasDepth, -0.5), halfCanvasHeight + calculatePercentage(canvasDepth, 3));
        ctx.stroke();
        chargeAnimation = requestAnimationFrame(animateCharging);
        ctx.restore();
    }

    // Start the charge animation if the battery is charging
    if (isCharging) {
        chargeAnimation = requestAnimationFrame(animateCharging);
    }

    // Draw the estimated time text
    fontSize = (canvasDepth) / 100;
    ctx.beginPath();
    ctx.fillStyle = theme;
    ctx.font = fontSize + "px cursive";
    const timeWidth = ctx.measureText(estimatedTime).width;
    ctx.fillText(estimatedTime, halfCanvasWidth - timeWidth / 2, halfCanvasHeight + calculatePercentage(canvasDepth, 8))
    ctx.fill();

    // Draw the battery usage line chart
    drawBatteryUsageLineChart(batteryTime);

    fontSize = (canvasDepth) / 100;
    ctx.beginPath();
    ctx.fillStyle = theme;
    ctx.font = fontSize + "px cursive";
    const avgtimeWidth = ctx.measureText("avg time - " + parseInt(averagebatteryTime(batteryData.time)) + "min").width;
    ctx.fillText("avg time - " + parseInt(averagebatteryTime(batteryData.time)) + "min", halfCanvasWidth - avgtimeWidth / 2, halfCanvasHeight - calculatePercentage(canvasDepth, 5))
    ctx.fill();
}


// Function to draw the battery usage line chart
function drawBatteryUsageLineChart(estimatedTime) {
    // Set the styles for the line chart
    ctx.lineWidth = canvasDepth / 700;
    ctx.strokeStyle = theme;

    // Define the coordinates for the line chart
    let cX = halfCanvasWidth - calculatePercentage(canvasDepth, 15);
    let cHeight = halfCanvasHeight + calculatePercentage(canvasDepth, 14);
    let cY = halfCanvasHeight + calculatePercentage(canvasDepth, 9.3);
    let cWidth = halfCanvasWidth + calculatePercentage(canvasDepth, 15);

    // Draw the Y-axis
    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.lineTo(cX, cHeight)
    ctx.stroke()

    // Set the font size for the Y-axis labels
    let fontSize = canvasDepth / 180;
    ctx.font = fontSize + "px sans-serif";

    // Calculate the increment and plot Y-axis labels
    let yDif = cHeight - cY;
    let curY = cY + yDif;

    let cYrangeInc = (cHeight + yDif - curY) / Math.max(...batteryData.time);
    let Ydata = Array(batteryData.time.length).fill(null);
    let Xdata = Array(batteryData.level.length).fill(null);
    for (var i = Math.min(...batteryData.time); i <= Math.max(...batteryData.time) && batteryData.time.length > 1; i++) {
        for (let j = 1; j < batteryData.time.length; j++) {
            if (i == batteryData.time[j]) {
                Ydata[j] = curY;
            }
        }
        ctx.beginPath();
        ctx.moveTo(cX, curY);
        ctx.lineWidth = canvasDepth / 2000;
        if (i % 2 == 0 && Math.max(...batteryData.time) < 10) {
            ctx.fillText(i, cX - (canvasDepth / 100), curY + (canvasDepth / 450))
            ctx.lineTo(cX - (canvasDepth / 160), curY);
        } else if (i % 5 == 0 && Math.max(...batteryData.time) > 10) {
            ctx.fillText(i, cX - (canvasDepth / 100), curY + (canvasDepth / 450))
            ctx.lineTo(cX - (canvasDepth / 160), curY);
        } else {
            ctx.lineTo(cX - (canvasDepth / 200), curY);
        }
        ctx.stroke();
        curY -= cYrangeInc;
    }

    // Draw the "min" label on the Y-axis
    ctx.beginPath();
    ctx.fillText("min", cX - (canvasDepth / 100), curY + (canvasDepth / 450))

    // Set the line width for the X-axis
    ctx.lineWidth = canvasDepth / 700;

    // Draw the X-axis
    ctx.beginPath();
    ctx.moveTo(cX, cHeight);
    ctx.lineTo(cWidth, cHeight)
    ctx.stroke()

    // Calculate the increment and plot X-axis labels
    let curX = cX;
    let cXrangeInc = (cWidth - cX) / 100;
    for (var i = 0; i <= 100; i++) {
        for (let j = 1; j < batteryData.level.length; j++) {
            if (i == batteryData.level[j]) {
                Xdata[j] = curX;
            }
        }
        ctx.beginPath();
        ctx.moveTo(curX, cHeight);
        ctx.lineWidth = canvasDepth / 2000;
        if (i % 10 == 0 && i !== 0) {
            ctx.fillText(i, curX - (canvasDepth / 400), cHeight + (canvasDepth / 100))
            ctx.lineTo(curX, cHeight + (canvasDepth / 200));
        } else if (i % 5 == 0 && i !== 0) {
            ctx.lineTo(curX, cHeight + (canvasDepth / 270));
        }
        ctx.stroke();
        curX += cXrangeInc;
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.fillText("%", (curX + 2 * cXrangeInc) - (canvasDepth / 400), cHeight + (canvasDepth / 100))

    // Plot the data points on the line chart
    ctx.beginPath();
    ctx.moveTo(Xdata[1], Ydata[1])
    for (let i = 1; i < batteryData.time.length; i++) {
        ctx.lineTo(Xdata[i], Ydata[i]);
    }
    if (batteryData.level[i] > batteryData.level[1])
        ctx.lineTo(Xdata[i], Ydata[i]);

    ctx.stroke();
    for (let i = 1; i < batteryData.time.length; i++) {
        ctx.beginPath();
        ctx.arc(Xdata[i], Ydata[i], 2, 0, Math.PI * 2)
        ctx.fill();
    }
}

function insertionSort() {
    const levelLen = batteryData.level.length;

    for (let i = 1; i < levelLen; i++) {
        const currentLevel = batteryData.level[i];
        const currentTime = batteryData.time[i];
        let j = i - 1;

        while (j >= 0 && batteryData.level[j] > currentLevel) {
            batteryData.level[j + 1] = batteryData.level[j];
            batteryData.time[j + 1] = batteryData.time[j];
            j--;
        }

        batteryData.level[j + 1] = currentLevel;
        batteryData.time[j + 1] = currentTime;
    }
}

// Function to calculate and update battery data
function calculateBattery() {
    // Use the Web Battery API to get battery information
    navigator.getBattery().then((battery) => {
        // Function to update all battery information
        function updateAllBatteryInfo() {
            updateChargingInfo();
            updateLevelInfo();
            if (isCharging) updateChargingTimeInfo();
            else updateDischargingTimeInfo();
        }
        // Call the function to update initial battery data
        updateAllBatteryInfo();

        // Event listeners to update battery information on changes

        battery.addEventListener("chargingchange", () => {
            updateChargingInfo();
        });
        function updateChargingInfo() {
            isCharging = battery.charging;
            drawBattery();
        }

        battery.addEventListener("levelchange", () => {
            updateLevelInfo();
        });
        function updateLevelInfo() {
            batteryLevel = parseInt((battery.level) * 100);
            drawBattery();
        }

        battery.addEventListener("chargingtimechange", () => {
            updateChargingTimeInfo();
        });
        function updateChargingTimeInfo() {
            if (battery.chargingTime !== Infinity) {
                let timeInc = battery.chargingTime / batteryLevel;
                let minInc = timeInc / 60;

                if (batteryData.level.includes(batteryLevel)) {
                    batteryData.time[batteryData.level.indexOf(batteryLevel)] = parseInt(minInc);
                } else {
                    batteryData.time.push(parseInt(minInc));
                    batteryData.level.push(batteryLevel);
                }
                insertionSort();

                localStorage.setItem("graphTime", batteryData.time);
                localStorage.setItem("graphLevel", batteryData.level);

                let min = battery.chargingTime / 60;
                let hr = min / 60
                let remMin = parseInt(min - parseInt(hr) * 60);
                let remHr = parseInt(hr);
                batteryTime = remHr + "hr " + remMin + "min";
                drawBattery();
            } else batteryTime = "- cannot check battery charging time on your device";
        }

        battery.addEventListener("dischargingtimechange", () => {
            updateDischargingTimeInfo();
        });

        function updateDischargingTimeInfo() {
            if (battery.dischargingTime !== Infinity) {
                let timeInc = battery.dischargingTime / batteryLevel;
                let minInc = timeInc / 60;

                if (batteryData.level.includes(batteryLevel)) {
                    batteryData.time[batteryData.level.indexOf(batteryLevel)] = parseInt(minInc);
                } else {
                    batteryData.time.push(parseInt(minInc));
                    batteryData.level.push(batteryLevel);
                }

                insertionSort();

                localStorage.setItem("graphTime", batteryData.time);
                localStorage.setItem("graphLevel", batteryData.level);
                let min = battery.dischargingTime / 60;
                let hr = min / 60
                let remMin = parseInt(min - parseInt(hr) * 60);
                let remHr = parseInt(hr);
                batteryTime = remHr + "hr " + remMin + "min";
                drawBattery();
            } else batteryTime = "- cannot check battery discharging time on your device";
        }
    });
}

// Clear prompt
let section = document.querySelector("section");

document.querySelector("#clearPrompt").addEventListener("click", () => {
    section.style.display = "block";
})
document.querySelector("#yes").addEventListener("click", () => {
    batteryData.time = [0];
    batteryData.level = [0];
    localStorage.setItem("graphTime", batteryData.time);
    localStorage.setItem("graphLevel", batteryData.level);
    calculateBattery();
})
document.querySelector("#no").addEventListener("click", () => {
    section.style.display = "none";
});

console.log();
