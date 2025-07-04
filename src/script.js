const apikey = "a53eb8725bed36b9685bdaecdad472d2"
const weatherBackgrounds = {
    Thunderstorm: "url('./bg/thunderstorm.jpg')",
    Drizzle: "url('./bg/rain.jpg')",
    Rain: "url('./bg/rain.jpg')",
    Snow: "url('./bg/snow.jpg')",
    Mist: "url('./bg/mist.jpg')",
    Smoke: "url('./bg/smoke.jpg')",
    Haze: "url('./bg/fog.jpg')",
    Dust: "url('./bg/sandy.jpg')",
    Fog: "url('./bg/fog.jpg')",
    Sand: "url('./bg/sandy.jpg')",
    Ash: "url('./bg/ash.jpg')",
    Squall: "url('./bg/squall.jpg')",
    Tornado: "url('./bg/tornado.jpg')",
    Clear: "url('./bg/clear.jpg')",
    Clouds: "url('./bg/clouds.jpg')",
};

function background_changer(weather) {
    console.log(weather);
    if (weatherBackgrounds[weather]) {
        document.body.style.backgroundImage = weatherBackgrounds[weather];
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    } else {
        console.warn("Background image not found for weather:", weather);
    }
}



async function getting() {
    let a = document.querySelector('.in').value.trim(); // trim removes extra spaces

    if (a === "") {
        alert("Please enter a valid city name.");
    } else {
        await getweather(a);
        document.querySelector('.in').value = "";
    }
}

function convertUnixToTime(timestamp) {
   
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}


async function getweather(city) {
    try {
        let raw = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);

        if (!raw.ok) {
            alert("City not found");
            document.querySelector('.in').value = "";
            return;
        }

        let a = await raw.json();
        console.log(a);
        console.log("Weather main:", a.weather[0].main);

        // Call background changer
        background_changer(a.weather[0].main);

        let div = document.querySelector('.ma');

        // Render the weather info
        div.innerHTML = `
            <div class="upper flex-col gap-[20px]">
                <div class="smth_4 flex justify-between items-center gap-4">
                    <div>
                        <div class="heading flex justify-evenly gap-4">
                            <p>${a.name}</p>
                            <p>${a.sys.country}</p>
                        </div>
                        <div class="desc">
                            <p>${a.weather[0].description}</p>
                        </div>
                        <div class="main_temp flex items-start gap-1">
                            <p>${a.main.temp}</p>
                            <p>&#8451;</p>
                        </div>
                        <div class="fell_like_temp">
                            <p>Feels like: ${a.main.feels_like} &#8451;</p>
                        </div>
                    </div>

                    <div class="weather_icon flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="white">
                            <path d="M48.7,24.1C47.1,16.7,40.1,11,32,11c-7.1,0-13.1,4.5-15.3,10.8C10.3,23,6,28.2,6,34.2C6,41,11.6,46.7,18.5,46.7H47
                                c6.1,0,11-4.9,11-11C58,29.4,53.9,25,48.7,24.1z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="sepration_line border border-white my-4"></div>

            <div class="middle flex w-full my-2 gap-4 items-start">
                <div class="section_1 text-white w-1/2">
                    <p>Min Temp: ${a.main.temp_min}</p>
                    <p>Humidity: ${a.main.humidity}%</p>
                    <p>Visibility: ${a.visibility} m</p>
                    <p>Sunrise: ${(a.sys.sunrise)}</p>
                </div>

                <div class="sepration_line border-l border-white"></div>

                <div class="section_2 text-white w-1/2 text-right">
                    <p>Max Temp: ${a.main.temp_max}</p>
                    <p>Pressure: ${a.main.pressure} hPa</p>
                    <p>Cloudiness: ${a.clouds.all}%</p>
                    <p>Sunset: ${(a.sys.sunset)}</p>
                </div>
            </div>

            <div class="sepration_line border border-white my-4"></div>

            <div class="last flex justify-between items-start gap-4">
                <div class="windspeed text-center flex-1">
                    <p style="font-size: 12px;">Wind Speed</p>
                    <p>${a.wind.speed} m/s</p>
                </div>

                <div class="sepration_line border-l border-white"></div>

                <div class="gusts text-center flex-1">
                    <p>Gusts</p>
                    <p>${a.wind.gust !== undefined ? a.wind.gust + " m/s" : "N/A"}</p>
                </div>

                <div class="sepration_line border-l border-white"></div>

                <div class="direction text-center flex-1">
                    <p>Direction</p>
                    <p>${a.wind.deg}°</p>
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}




