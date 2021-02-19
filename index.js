require('dotenv').config();
const Mustache = require('mustache');
const fs = require('fs');
const weather = require('weather-js');

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
  await weather.find({ search: 'Davao City, PH', degreeType: 'C' }, (err, result) => {
    if (err) console.log(err);
    DATA.city_name = result[0].location.name;
    DATA.city_temperature = result[0].current.temperature;
    DATA.city_winddisplay = result[0].current.winddisplay.replace(/\/(?![^<>]*>)/g, "|");
    DATA.city_skytext = result[0].current.skytext;
    DATA.city_humidity = result[0].current.humidity;
  });
}


async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err)
      throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function action() {
  /**
   * Fetch Weather
   */
  await setWeatherInformation();
  await sleep(1000); // nilagay ko to kc ung data na di pa nakuha i dederetso nya ung pag save na di pa tapos ung pag store nang data
  /**
   * Generate README
   */
  await generateReadMe();
}

action();
