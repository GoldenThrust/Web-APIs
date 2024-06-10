import { replaceStringInUrl } from '../utils.js'

// Function to generate a random color component (0 to 255)
function randomColor() {
    return Math.floor(Math.random() * 255);
}  

// Function to send a Beacon report with data
function sendBeaconReport(data) {
    // Get the <p> element for displaying log information
    let p = document.querySelector("p");

    // Create a FormData object and append data as a JSON string
    let form = new FormData();
    form.append("log", JSON.stringify(data));

    // Send the Beacon report with the data to the specified URL
    navigator.sendBeacon(replaceStringInUrl(window.location.origin, "5502", "8000"), form);

    // Update the <p> element with logged data details
    p.innerText = "Logged data : \r\n\r\n";
    for (keys in data) {
        if (keys == "brands") {
            p.innerText += keys + " = \n";
            for (let i = 0; i < data[keys].length; i++) {
                for (key in data[keys][i]) {
                    p.innerText += key + " : " + data[keys][i][key] + "\n";
                }
            }
        } else {
            p.innerText += keys + " = " + data[keys] + "\n";
        }
    }

    // Set a random background color
    document.documentElement.style.backgroundColor =
        "rgb(" + randomColor() + "," + randomColor() + "," + randomColor() + ")";
    
    // Set a random text color
    document.documentElement.style.color =
        "rgb(" + randomColor() + "," + randomColor() + "," + randomColor() + ")";
}

// Function to log user activity
function logUserActivity() {
    let brands = [];

    // Iterate through user agent brands and push to the 'brands' array
    for (let i = 0; i < navigator.userAgentData.brands.length; i++) {
        brands.push(navigator.userAgentData.brands[i]);
    }

    // Create an activity data object
    const activityData = {
        timestamp: new Date().toISOString(),
        eventType: navigator.onLine ? 'leavePage' : 'goOffline',
        userAgent: navigator.userAgent,
        mobile: navigator.userAgentData.mobile,
        platform: navigator.userAgentData.platform,
        url: window.location.href,
        brands: brands,
    };

    // Send the activity data using the sendBeaconReport function
    sendBeaconReport(activityData);
}

// Attach the logUserActivity function to the beforeunload event 
window.addEventListener('beforeunload', logUserActivity);
window.addEventListener("blur", logUserActivity);

// Attach the logUserActivity function to the offline event
window.addEventListener('offline', logUserActivity);

// Log a message to indicate that user activity logging is in progress
console.log("logging user activity", location);
