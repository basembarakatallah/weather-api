// Pick up some from data.json 
list = [
    {"temp": "40 °C", "description": "clear sky", "hour": "12 PM"}, 
    {"temp": "37 °C", "description": "clear sky", "hour": "2 PM"}, 
    {"temp": "32 °C", "description": "clear sky", "hour": "4 PM"}, 
    {"temp": "30 °C", "description": "clear sky", "hour": "6 PM"}, 
    {"temp": "34 °C", "description": "clear sky", "hour": "8 PM"}, 
    {"temp": "40 °C", "description": "clear sky", "hour": "10 PM"}, 
    {"temp": "43 °C", "description": "clear sky", "hour": "12 AM"}, 
    {"temp": "42 °C", "description": "clear sky", "hour": "2 AM"}, 
    {"temp": "37 °C", "description": "clear sky", "hour": "4 AM"}, 
    {"temp": "33 °C", "description": "clear sky", "hour": "12 PM"}, 
    {"temp": "31 °C", "description": "clear sky", "hour": "2 PM"}, 
    {"temp": "29 °C", "description": "clear sky", "hour": "4 PM"}, 
    {"temp": "33 °C", "description": "clear sky", "hour": "6 PM"}, 
    {"temp": "41 °C", "description": "clear sky", "hour": "8 PM"}, 
    {"temp": "43 °C", "description": "clear sky", "hour": "10 PM"}, 
    {"temp": "43 °C", "description": "clear sky", "hour": "12 AM"}, 
    {"temp": "38 °C", "description": "clear sky", "hour": "2 AM"}, 
    {"temp": "35 °C", "description": "clear sky", "hour": "4 AM"}, 
    {"temp": "32 °C", "description": "clear sky", "hour":"12 PM"}, 
    {"temp": "30 °C", "description": "clear sky", "hour": "2 PM"}
]
// Initialize arrays
const temps = []
const hours = []
const descriptions = new Set()
var i=0
temps[i] = list.map(item => item.temp)
hours[i] = list.map(item => item.hour)
descriptions[i] = new Set(list.map(item => item.description))
// Check Data
console.log(temps)
console.log(hours)
console.log(descriptions)
// Yesterday and Tomorrow Buttons
const prevBtn = document.getElementById("prev");
const now = document.getElementById("now");
const nextBtn = document.getElementById("next");
// 
let currentIndex = 0;
const itemsPerPage = 9;
// Function to map weather descriptions to icons (CSS classes or any visual representation)
function getWeatherIcon(description) {
    switch(description) {
        case 'clear sky':
            return '<i class="fa-solid fa-sun"></i>'; // Replace with class or icon name
        case 'cloudy':
            return '<i class="fa-solid fa-cloud"></i>';
        case 'rain':
            return '<i class="fa-solid fa-cloud-rain"></i>';
        case 'wind':
            return '<i class="fa-solid fa-wind"></i>';
        case 'snowflake':
            return '<i class="fa-thin fa-snowflake"></i>';
        case 'shower':
            return '<i class="fa-solid fa-cloud-showers-heavy"></i>'; 
        // Add more cases for different descriptions
        default:
            return '❓'; // Default icon or class
    }
}
// Function to display data
function displayData(startIndex) {
const weatherHour = document.getElementById("weather-hour")
weatherHour.innerHTML = ""; // Clear existing data
const endIndex = Math.min(startIndex + itemsPerPage, list.length);

for (let i = startIndex; i < endIndex; i++) {
    const item = list[i];
    // Create a weather-info container
    const weatherInfoDiv = document.createElement('div');
    weatherInfoDiv.classList.add('weather-info');
    // Create and append the hour div
    const hourDiv = document.createElement('div');
    hourDiv.classList.add('hour');
    hourDiv.textContent = item.hour;
    weatherInfoDiv.appendChild(hourDiv);
    // Create and append the icon (or description placeholder)
    const iconElement = document.createElement('i');
    iconElement.innerHTML = getWeatherIcon(item.description); // Replace this with your icon logic
    iconElement.style.width = "32px"
    iconElement.style.height = "32px"
    iconElement.style.padding = "2px 0px"
    iconElement.style.fontSize = "25px"
    weatherInfoDiv.appendChild(iconElement);
    // Create and append the temperature div
    const tempDiv = document.createElement('div');
    tempDiv.classList.add('temp');
    tempDiv.textContent = item.temp;
    weatherInfoDiv.appendChild(tempDiv);
    // Append the entire weather-info div to the "weatherHour" container
    weatherHour.appendChild(weatherInfoDiv);
    // Toggle styles on click
    weatherInfoDiv.addEventListener("click", function() {
        if(this.clicked) {
            this.style.position = "relative";
            this.style.top = "-19px";
            this.style.backgroundColor = "#FEE68B";
            this.style.border = "1px solid #FBDC64";
        } else {
            this.style.backgroundColor = "#E5F2F2";
            this.style.border = "1px solid #B5D6D6";
            this.style.position = "";
            this.style.top = "";
        }
        this.clicked = !this.clicked; // Toggle the clicked state
    });
}
// Update span degree
degreeIndex=0
function updateDegree() {
    if (degreeIndex >= endIndex) {
        degreeIndex = startIndex; // Reset to startIndex if we reach the end
    }
    const degreeElement = document.getElementById("degree");
    degreeElement.textContent = list[degreeIndex].temp; // Update the temperature
    degreeIndex++; // Move to the next temperature value
}
updateDegree()
setInterval(updateDegree, 2 * 60 * 60 * 1000); // Update temperature every 2 hours
}
// Initial display of the first 9 items
displayData(currentIndex);
// Event listeners for buttons
prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex -= itemsPerPage;
        displayData(currentIndex);
    }
});
nextBtn.addEventListener("click", () => {
    if (currentIndex + itemsPerPage < list.length) {
        currentIndex += itemsPerPage;
        displayData(currentIndex);
    }
});
// Display date in date-loc div
const date = new Date()
const today = document.getElementById("date")
today.textContent = date.toDateString()
console.log(date.toDateString())
// Enter city Name
const city = prompt("Enter your city: ")
const loc = document.getElementById("loc")
loc.textContent = city
// Display day in Clouds Section
const day = document.getElementById("day")
const week = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
day.textContent = week[date.getDay()]
// Display description in Clouds Section
const desc = document.getElementById("desc")
const val = descriptions[0].values() // Not working correctly 😅
desc.textContent = val.next().value
/// Test ///
// var hours = ["12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 AM", "2 AM", "4 AM"]
// var div_hour = document.getElementsByClassName("hour")
// for (let i = 0; i < 9; i++) {
//     if (div_hour[i]) {
//         div_hour[i].innerText = hours[i];
//     }
// }
// var temps = ["21 °C", "18 °C", "19 °C", "22 °C", "20 °C", "20 °C", "20 °C", "20 °C", "20 °C"]
// div_temp = document.getElementsByClassName("temp")
// for (let i = 0; i < 9; i++) {
//     if (div_temp[i]) {
//         div_temp[i].innerText = temps[i];
//     }
// }
