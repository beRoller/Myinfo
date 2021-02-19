require('dotenv').config();
const Mustache = require('mustache');
const fs = require('fs');
var weather = require('weather-js');

const MUSTACHE_MAIN_DIR = './main.mustache';

let TIMEZONE = 'Asia/Singapore';
let FORMAT = 'en-PH'

let DATA = {
  refresh_date: new Date().toLocaleDateString(FORMAT, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: TIMEZONE,
  }),
};

async function setWeatherInformation() {
  await weather.find({ search: 'Davao City, PH', degreeType: 'C' }, function (err, result) {
    if (err) console.log(err);

    var weather = result[0];
    DATA.city_name = weather.location.name
    DATA.city_temperature = weather.current.temperature
    DATA.city_winddisplay = weather.location.winddisplay
    DATA.city_skytext = weather.location.skytext
    DATA.city_humidity = weather.location.humidity
  });
}


async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  /**
   * Fetch Weather
   */
  await setWeatherInformation();

  /**
   * Generate README
   */
  await generateReadMe();
}

action();
