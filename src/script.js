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

function handleKeyPress() {
   document.querySelector('.in').addEventListener('keypress', function(event) {
    if(event.key=='Enter') {
        getting();
        document.querySelector('.in').value=""; 
        document.querySelector('.in').blur(); 
    }
   });
}

handleKeyPress();

async function getting() {
    let a = document.querySelector('.in').value.trim(); 

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

function m_to_km(distance){
    return distance/1000;
};

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
        background_changer(a.weather[0].main);

        let div = document.querySelector('.ma');
        const iconUrl = `https://openweathermap.org/img/wn/${a.weather[0].icon}@2x.png`;

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
                   <img src="${iconUrl}" alt="">
                </div>
            </div>
            </div>

            <div class="sepration_line border border-white my-4"></div>

            <div class="middle flex w-full my-2 gap-4 items-start">
            <div class="section_1 text-white w-1/2">
                <p>Min Temp: ${a.main.temp_min}</p>
                <p>Humidity: ${a.main.humidity}%</p>
                <p>Visibility: ${m_to_km(a.visibility)}km</p>
                <p>Sunrise: ${convertUnixToTime(a.sys.sunrise)}</p>
            </div>

            <div class="sepration_line border-l border-white"></div>

            <div class="section_2 text-white w-1/2 text-right">
                <p>Max Temp: ${a.main.temp_max}</p>
                <p style="font-size:15px">Pressure:${a.main.pressure}hPa</p>
                <p>Cloudiness: ${a.clouds.all}%</p>
                <p>Sunset: ${convertUnixToTime(a.sys.sunset)}</p>
            </div>
            </div>

            <div class="sepration_line border border-white my-4"></div>

            <div class="last flex justify-between items-start gap-4">
            <div class="windspeed text-center flex-1">
                <p style="font-size: 12px;">Wind Speed</p>
                <p style="font-size: 12px;">${a.wind.speed} m/s</p>
            </div>

            <div class="sepration_line border-l border-white"></div>

            <div class="gusts text-center flex-1">
                <p style="font-size: 12px;">Gusts</p>
                <p style="font-size: 12px;">${a.wind.gust !== undefined ? a.wind.gust + " m/s" : "N/A"}</p>
            </div>

            <div class="sepration_line border-l border-white"></div>

            <div class="direction text-center flex-1">
                <p style="font-size: 12px;">Direction</p>
                <p style="font-size: 12px;">${a.wind.deg}°</p>
            </div>
            </div>
        `;

    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}






