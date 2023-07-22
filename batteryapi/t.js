// Get the canvas and its 2D rendering context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initialize variables
let charging = false;
let chargeAnimation = null;
let bar = 100;
let time = "- cannot check battery time on your device";

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

// Data object to store battery information for the line chart
let data = {
    time: [0],
    bar: [0]
};

// Theme variable to track the current theme (white or black)
let theme = "white";

// Check if there is saved data in the local storage for the graph and update the data object
if (localStorage.getItem("graphTime") && localStorage.getItem("graphBar")) {
    let tmpT = localStorage.getItem("graphTime").split(",");
    let tmpB = localStorage.getItem("graphBar").split(",");
    data.time = [];
    data.bar = [];
    for (let i = 0; i < tmpT.length; i++) {
        data.time.push(Number(tmpT[i]));
        data.bar.push(Number(tmpB[i]));
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
    calc();
});

// Call the calc function to initialize battery data
calc();

// Function to calculate a percentage of a number
function numPercent(num, percent) {
    return ((percent / 100) * num);
}

// Event listener for click event to toggle between white and black themes
let light = false;
const rootstyle = document.documentElement.style;
canvas.addEventListener("click", () => {
    if (light) {
        theme = "black";
        document.body.style.backgroundColor = "white";
        backgroundColor = "white";
        rootstyle.setProperty("--theme", theme);
    } else {
        theme = "white";
        document.body.style = "#1f1f1f";
        backgroundColor = "#1f1f1f";
        rootstyle.setProperty("--theme", theme);
    }
    // Redraw the battery graphic with the new theme
    batteryGraphic();
    light = !light;
});

// Function to draw a stroke with the given stroke width, color, and position percentage
function stroke(strokeWidth, color, posPercent) {
    const sideStrokeRadius = numPercent(canvasDepth, posPercent);

    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;
    ctx.arc(halfCanvasWidth, halfCanvasHeight - numPercent(canvasDepth, 2), sideStrokeRadius, 0, Math.PI * 2);
    ctx.stroke();
}

// Function to draw the battery graphic
function batteryGraphic() {
    // Get the current battery bar value and charging status
    let batteryBar = bar;
    let batteryCharging = charging;
    let estimatedTime = "Estimated time remaining " + time;

    // Determine the color based on battery level and charging status
    let color;
    if (batteryCharging || batteryBar > 70)
        color = "springgreen";
    else if (batteryBar < 30)
        color = "red";
    else
        color = "hsl(" + 1 * batteryBar + ", 100%, 50%)";

    // Calculate some sizes for drawing elements
    let width = (canvasDepth) / 100;
    let fontSize = (canvasDepth) / 22.5;

    // Clear the canvas and draw the battery shape
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'butt';
    stroke(width + 5, color, 7);
    stroke(width, backgroundColor, 7);
    ctx.beginPath();
    ctx.lineWidth = width + 5;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.font = fontSize + "px sans-serif";
    const startAngle = -Math.PI / 2;
    const endAngle = (Math.PI / 180) * ((batteryBar / 100) * 360) + startAngle;
    ctx.arc(halfCanvasWidth, halfCanvasHeight - numPercent(canvasDepth, 2), numPercent(canvasDepth, 7), startAngle, endAngle);

    // Draw the battery percentage text
    const textWidth = ctx.measureText(batteryBar + "%").width;
    const textX = halfCanvasWidth - textWidth / 2;
    const textY = halfCanvasHeight + numPercent(canvasDepth, -0.2);
    ctx.fillText(batteryBar + "%", textX, textY);
    ctx.stroke();

    // Cancel the previous chargeAnimation if running
    if (chargeAnimation) {
        cancelAnimationFrame(chargeAnimation);
    }

    // Function to animate the charging effect
    let offset = 0;
    function charge() {
        ctx.clearRect(halfCanvasWidth - numPercent(canvasDepth, 1), halfCanvasHeight - numPercent(canvasDepth, -0.5), numPercent(canvasDepth, 1.5), numPercent(canvasDepth, 3));
        offset++;
        if (offset > 10) {
            offset = 0;
        }

        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -offset;

        ctx.strokeStyle = "springgreen";
        ctx.beginPath();
        ctx.moveTo(halfCanvasWidth, halfCanvasHeight + numPercent(canvasDepth, 1))
        ctx.lineWidth = (canvasDepth) / 280;
        ctx.lineCap = "round";
        ctx.shadowColor = "lightblue";
        ctx.shadowBlur = 4;
        ctx.lineTo(halfCanvasWidth + numPercent(canvasDepth, -0.5), halfCanvasHeight + numPercent(canvasDepth, 2));
        ctx.lineTo(halfCanvasWidth + numPercent(canvasDepth, 0.005), halfCanvasHeight + numPercent(canvasDepth, 2));
        ctx.lineTo(halfCanvasWidth + numPercent(canvasDepth, -0.5), halfCanvasHeight + numPercent(canvasDepth, 3));
        ctx.stroke();
        chargeAnimation = requestAnimationFrame(charge);
        ctx.restore();
    }

    // Start the charge animation if the battery is charging
    if (batteryCharging) {
        chargeAnimation = requestAnimationFrame(charge);
    }

    // Draw the estimated time text
    fontSize = (canvasDepth) / 100;
    ctx.beginPath();
    ctx.fillStyle = theme;
    ctx.font = fontSize + "px cursive";
    const timeWidth = ctx.measureText(estimatedTime).width;
    ctx.fillText(estimatedTime, halfCanvasWidth - timeWidth / 2, halfCanvasHeight + numPercent(canvasDepth, 8))
    ctx.fill();

    // Draw the battery usage line chart
    batteryUsageLineChart(time);
}

// Function to draw the battery usage line chart
function batteryUsageLineChart(estimatedTime) {
    // Set the styles for the line chart
    ctx.lineWidth = canvasDepth / 700;
    ctx.strokeStyle = theme;

    // Define the coordinates for the line chart
    let cX = halfCanvasWidth - numPercent(canvasDepth, 15);
    let cHeight = halfCanvasHeight + numPercent(canvasDepth, 14);
    let cY = halfCanvasHeight + numPercent(canvasDepth, 9.3);
    let cWidth = halfCanvasWidth + numPercent(canvasDepth, 15);

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
    let cYrangeInc = (cHeight + yDif - curY) / Math.max(...data.time);
    let Ydata = Array(data.time.length).fill(null);
    let Xdata = Array(data.bar.length).fill(null);
    for (var i = Math.min(...data.time); i <= Math.max(...data.time) && data.time.length > 1; i++) {
        for (let j = 1; j < data.time.length; j++) {
            if (i == data.time[j]) {
                Ydata[j] = curY;
            }
        }
        ctx.beginPath();
        ctx.moveTo(cX, curY);
        ctx.lineWidth = canvasDepth / 2000;
        if (i % 2 == 0) {
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
        for (let j = 1; j < data.bar.length; j++) {
            if (i == data.bar[j]) {
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
    for (let i = 1; i < data.time.length; i++) {
            ctx.lineTo(Xdata[i], Ydata[i]);
    }
    if (data.bar[i] > data.bar[1])
        ctx.lineTo(Xdata[i], Ydata[i]);
        
    ctx.stroke();
    for (let i = 1; i < data.time.length; i++) {
        ctx.beginPath();
        ctx.arc(Xdata[i], Ydata[i], 2, 0, Math.PI * 2)
        ctx.fill();
    }
}

function insertionSort() {
    const barLen = data.bar.length;
  
    for (let i = 1; i < barLen; i++) {
      const currentBar = data.bar[i];
      const currentTime = data.time[i];
      let j = i - 1;
  
      while (j >= 0 && data.bar[j] > currentBar) {
        data.bar[j + 1] = data.bar[j];
        data.time[j + 1] = data.time[j];
        j--;
      }
  
      data.bar[j + 1] = currentBar;
      data.time[j + 1] = currentTime;
    }
}

// Function to calculate and update battery data
function calc() {
    // Use the Web Battery API to get battery information
    navigator.getBattery().then((battery) => {
        // Function to update all battery information
        function updateAllBatteryInfo() {
            updateChargeInfo();
            updateLevelInfo();
            if (charging) updateChargingInfo();
            else updateDischargingInfo();
        }
        // Call the function to update initial battery data
        updateAllBatteryInfo();

        // Event listeners to update battery information on changes

        battery.addEventListener("chargingchange", () => {
            updateChargeInfo();
        });
        function updateChargeInfo() {
            charging = battery.charging;
            batteryGraphic();
        }

        battery.addEventListener("levelchange", () => {
            updateLevelInfo();
        });
        function updateLevelInfo() {
            bar = parseInt((battery.level) * 100);
            batteryGraphic();
        }

        battery.addEventListener("chargingtimechange", () => {
            updateChargingInfo();
        });
        function updateChargingInfo() {
            if (battery.chargingTime !== Infinity) {
                let timeInc = battery.chargingTime / bar;
                let minInc = timeInc / 60;

                if (data.bar.includes(bar)) {
                    data.time[data.bar.indexOf(bar)] = parseInt(minInc);
                } else {
                    data.time.push(parseInt(minInc));
                    data.bar.push(bar);
                }
                insertionSort();

                localStorage.setItem("graphTime", data.time);
                localStorage.setItem("graphBar", data.bar);

                let min = battery.chargingTime / 60;
                let hr = min / 60
                let remMin = parseInt(min - parseInt(hr) * 60);
                let remHr = parseInt(hr);
                time = remHr + "hr " + remMin + "min";
                batteryGraphic();
            } else time = "- cannot check battery charging time on your device";
        }

        battery.addEventListener("dischargingtimechange", () => {
            updateDischargingInfo();
        });

        function updateDischargingInfo() {
            if (battery.dischargingTime !== Infinity) {
                let timeInc = battery.dischargingTime / bar;
                let minInc = timeInc / 60;

                if (data.bar.includes(bar)) {
                    data.time[data.bar.indexOf(bar)] = parseInt(minInc);
                } else {
                    data.time.push(parseInt(minInc));
                    data.bar.push(bar);
                }

                insertionSort();

                localStorage.setItem("graphTime", data.time);
                localStorage.setItem("graphBar", data.bar);
                let min = battery.dischargingTime / 60;
                let hr = min / 60
                let remMin = parseInt(min - parseInt(hr) * 60);
                let remHr = parseInt(hr);
                time = remHr + "hr " + remMin + "min";
                batteryGraphic();
            } else time = "- cannot check battery discharging time on your device";
        }
    });
}

let section = document.querySelector("section");

document.querySelector("#clearPrompt").addEventListener("click", () => {
    section.style.display = "block";
})
document.querySelector("#yes").addEventListener("click", () => {
    data.time = [0];
    data.bar = [0];
    localStorage.setItem("graphTime", data.time);
    localStorage.setItem("graphBar", data.bar);
    calc();
})
document.querySelector("#no").addEventListener("click", () => {
    section.style.display = "none";
});
