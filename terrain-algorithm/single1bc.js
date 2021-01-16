const ejs = require('ejs');
const fs = require('fs');

const plainsTemplate = fs.readFileSync('single1/WorldBiomes/Plains.ejs').toString();
const suffix = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
]
const colors = [
  "#0A38C2",
  "#0A7DC2",
  "#0AC2C2",
  "#0AC27D",
  "#0AC238",
  "#21C20A",
  "#66C20A",
  "#ABC20A",
  "#C2940A",
  "#C24F0A",
  "#C20A0A",
]
const customBiomes = []

for (let i = 0; i <= 10; i++) {
  const biomeHeight = -8.1 + i * 1.6;
  const biomeData = {
    biomeColor: colors[i],
    biomeHeight,
    smoothRadius: 4
  }

  const rendered = ejs.render(plainsTemplate, biomeData);

  fs.writeFileSync(`single1/WorldBiomes/Plains${suffix[i]}.bc`, rendered);

  customBiomes.push(`Plains${suffix[i]}`)
}

const worldConfigTemplate = fs.readFileSync('single1/WorldConfig.ejs').toString();
const worldConfigData = {
  imageOrientation: 'North',
  imageXOffset: -256,
  imageZOffset: -256,
  customBiomes,
  biomeMode: 'FromImage',
  imageFile: 'single1.png',
  waterLevelMax: 31
}
fs.writeFileSync(`single1/WorldConfig.ini`, ejs.render(worldConfigTemplate, worldConfigData));

