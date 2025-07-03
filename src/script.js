const apikey = "a53eb8725bed36b9685bdaecdad472d2"
async function getting() {
    let a = document.querySelector('.in').value.trim(); // trim removes extra spaces

    if (a === "") {
        alert("Please enter a valid city name.");
    } else {
        await getweather(a);
        document.querySelector('.in').value = "";
    }
}

async function getweather(city) {
    let raw = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
    if (!raw.ok) {
        alert("city not found");
        document.querySelector('.in').value = "";
    }
    else {
        let a = await raw.json();
        console.log(a);
    }

}



