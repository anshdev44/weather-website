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

const text = "Smart weather updates ";
let index = 0;

function typeText() {
    if (index < text.length) {
        document.querySelector('.none').innerHTML += text.charAt(index);
        index++;
        setTimeout(typeText, 100); // 100ms delay between each character
    }
}

typeText();

function background_changer(weather) {
    // console.log(weather);
    if (weatherBackgrounds[weather]) {
        document.body.style.backgroundImage = weatherBackgrounds[weather];
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    } else {
        console.warn("Background image not found for weather:", weather);
    }
}

function handleKeyPress() {
    document.querySelector('.in').addEventListener('keypress', function (event) {
        if (event.key == 'Enter') {
            getting();
            document.querySelector('.in').value = "";
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
        await future_weather(a)
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

function m_to_km(distance) {
    return distance / 1000;
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

async function future_weather(city) {
    // http://api.openweathermap.org/data/2.5/forecast?q=London&cnt=40&units=metric&appid=YOUR_API_KEY
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=40&units=metric&appid=${apikey}`);
    let data = await response.json();
    fetch_week_data(data)
}


function fetch_week_data(data) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const time = '12:00:00';

    for (let i = 1; i <= 4; i++) {
        let nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        let day_name = days[(today.getDay() + i) % 7];

        let year = nextDate.getFullYear();
        let month = String(nextDate.getMonth() + 1).padStart(2, '0');
        let date = String(nextDate.getDate()).padStart(2, '0');

        let target_datetime = `${year}-${month}-${date} ${time}`;



        let match = data.list.find(f => f.dt_txt === target_datetime);
        if (match) {
            display_week_data(match, day_name, i);
            console.log(day_name)
        }
    }
}


function display_week_data(data, day_name, i) {
    let div_1 = document.querySelector(`.box_${i}`);
    div_1.innerHTML = `<div class="date"><p>${day_name}</p></div>
                <div class="icon"><p><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""></p></div>
                <div class="temp"><p>${data.main.temp}&deg</p></div>
                <div class="feels"><p>${data.main.feels_like}&deg</p></div>`

}










