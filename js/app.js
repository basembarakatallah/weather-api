// Weather API
const api_key = "2558325ef979ea39e0f540d75eabc37c";

// Initialize variables
let city;
let country;

async function getData() {
    // Check if geolocation is available
    if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
        return null;
    }
    
    // Get the user's location
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const url_weekly = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
                // Fetch the weekly forecast data
                const response = await fetch(url_weekly);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data_weekly = await response.json();
                city = data_weekly['city']['name'];
                country = data_weekly['city']['country'];
                
                // Combine data into a single list of objects
                const weatherData = data_weekly['list'].map((entry) => ({
                    temp: Math.round(entry['main']['temp'] - 273.15) + " °C",
                    description: entry['weather'][0]['description'],
                    day: entry['dt_txt'].split(" ")[0],
                    hour: entry['dt_txt'].split(" ")[1]
                }));
                
                console.log(weatherData);  // Check combined data
                console.log(city);
                console.log(country);
                resolve(weatherData); // Return the combined data
            } catch (error) {
                console.error('Error fetching data:', error);
                reject(null);
            }
        }, (error) => {
            console.error('Error getting location:', error.message);
            reject(null);
        });
    });
}

// Display date in date-loc div 
const date = new Date();
const today = document.getElementById("date");
const day = document.getElementById("day");
const week = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

// Yesterday and Tomorrow Buttons
const prevBtn = document.getElementById("prev");
const now = document.getElementById("now");
const nextBtn = document.getElementById("next");

let currentIndex = 0;
const itemsPerPage = 8;

// Function to map weather descriptions to icons (CSS classes or any visual representation)
function getWeatherIcon(description) {
    switch(description) {
        case 'clear sky':
            return '<i class="fa-solid fa-sun"></i>';
        case 'few clouds':
            return '<i class="fa-solid fa-cloud-sun"></i>';
        case 'scattered clouds':
            return '<i class="fa-solid fa-cloud"></i>';
        case 'broken clouds':
            return '<i class="fa-solid fa-smog"></i>';
        case 'shower rain':
            return '<i class="fa-solid fa-cloud-showers-heavy"></i>';
        case 'rain':
            return '<i class="fa-solid fa-cloud-sun-rain"></i>';
        case 'thunderstorm':
            return '<i class="fa-solid fa-cloud-bolt"></i>';
        case 'snowflake':
            return '<i class="fa-thin fa-snowflake"></i>';
        case 'mist':
            return '<i class="fa-solid fa-wind"></i>';
        default:
            return '❓'; // Default icon or class
    }
}

// Set up day and hour to match with temperature for that day
function getcurrentTimeDetails() {
    const currentDate = new Date();
    let currentHour = currentDate.getHours();

    // Round down to the nearest 3-hour increment
    currentHour -= currentHour % 3;

    // Format hour to "HH:00:00"
    const formattedHour = `${String(currentHour).padStart(2, '0')}:00:00`;
    const currentDay = currentDate.toISOString().split('T')[0];

    return { currentDay, currentHour: formattedHour };
}

getData().then(data => {
    if (data) {
        // Handle hour formatting
        function handleHour(hourString) {
            let hourInt = parseInt(hourString.substring(0, 2), 10);
            const suffix = hourInt >= 12 ? 'PM' : 'AM';
            hourInt = hourInt % 12 || 12;
            return `${hourInt} ${suffix}`;
        }

        // Update span degree
        function updateDegree() {
            const { currentDay, currentHour } = getcurrentTimeDetails();
            const matchingEntry = data.find(item => item.day === currentDay && item.hour === currentHour);
            const degreeElement = document.getElementById("degree");

            if (matchingEntry) {
                degreeElement.textContent = matchingEntry.temp;
            } else {
                degreeElement.textContent = "N/A";
            }
        }

        setInterval(updateDegree, 3 * 60 * 60 * 1000); // Update temperature automatically every 3 hours

        // Function to display data
        function displayData(startIndex) {
            const weatherHour = document.getElementById("weather-hour");
            weatherHour.innerHTML = ""; // Clear existing data
            const endIndex = Math.min(startIndex + itemsPerPage, data.length);
            for (let i = startIndex; i < endIndex; i++) {
                const item = data[i];
                
                // Create a weather-info container
                const weatherInfoDiv = document.createElement('div');
                weatherInfoDiv.classList.add('weather-info');

                // Create and append the hour div
                const hourDiv = document.createElement('div');
                hourDiv.classList.add('hour');
                hourDiv.textContent = handleHour(item.hour);
                weatherInfoDiv.appendChild(hourDiv);

                // Create and append the icon (or description placeholder)
                const iconElement = document.createElement('i');
                iconElement.innerHTML = getWeatherIcon(item.description);
                iconElement.style.width = "32px";
                iconElement.style.height = "32px";
                iconElement.style.padding = "2px 0px";
                iconElement.style.fontSize = "25px";
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
                    this.classList.toggle("clicked");
                });
            }
        }

        // Initial display of the first 8 items
        displayData(currentIndex);

        // Calculate temperature for the next 5 days
        const currentDate = new Date();
        const startDate = new Date(); // Starting point, today's date
        const endDate = new Date(); // Ending point, 5 days from start date
        endDate.setDate(startDate.getDate() + 4); // 5-day range

        function updateDateDisplay() {
            today.textContent = currentDate.toDateString();
            day.textContent = week[currentDate.getDay()];
        }

        function checkButtons() {
            if (currentDate <= startDate) {
                prevBtn.disabled = true;
                prevBtn.style.opacity = 0.5;
            } else {
                prevBtn.disabled = false;
                prevBtn.style.opacity = 1;
            }
            if (currentDate >= endDate) {
                nextBtn.disabled = true;
                nextBtn.style.opacity = 0.5;
            } else {
                nextBtn.disabled = false;
                nextBtn.style.opacity = 1;
            }
        }

        function updateUI() {
            updateDateDisplay();
            updateDegree();
            checkButtons();
        }

        // Initial temperature update
        updateUI();

        // Event listeners for buttons
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex -= itemsPerPage;
                displayData(currentIndex);
            }
            if (currentDate > startDate) {
                currentDate.setDate(currentDate.getDate() - 1);
                updateUI();
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentIndex + itemsPerPage < data.length) {
                currentIndex += itemsPerPage;
                displayData(currentIndex);
            }
            if (currentDate < endDate) {
                currentDate.setDate(currentDate.getDate() + 1);
                updateUI();
            }
        });

        const loc = document.getElementById("loc");
        loc.textContent = `${city}, ${country}`;

        // Display description in Clouds Section
        const desc = document.getElementById("desc");
        desc.textContent = data.description;

    } else {
        console.log("Failed to fetch data.");
    }
});
