const ejs = require('ejs');
const fs = require('fs');

const ROOTDIR = "multi1";

const ALPINE = "Extreme Hills M";
const CONIFERROUS = "Taiga";
const SUMMERGREEN = "Birch Forest";
const LAUREL = "Forest";
const SUBTROPICAL = "Jungle";
const OCEAN = "Ocean";
const DEEPOCEAN = "Deep Ocean";

const biomeTemplate = fs.readFileSync(`${ROOTDIR}/WorldBiomes/Extender.ejs`).toString();

const volatility = [0.1, 0.1, 0.1, 0.1, 0.05, 0.05, 0.1, 0.2, 0.35, 0.5];
const suffix = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",];
const biomeColors = {
  [ALPINE]: ["#2947A3", "#2975A3", "#29A3A3", "#29A375", "#29A347", "#38A329", "#66A329", "#94A329", "#A38529", "#A35729", "#A32929"],
  [CONIFERROUS]: ["#1F42AD", "#1F78AD", "#1FADAD", "#1FAD78", "#1FAD42", "#30AD1F", "#66AD1F", "#9CAD1F", "#AD8A1F", "#AD541F", "#AD1F1F"],
  [SUMMERGREEN]: ["#143DB8", "#147AB8", "#14B8B8", "#14B87A", "#14B83D", "#29B814", "#66B814", "#A3B814", "#B88F14", "#B85214", "#B81414"],
  [LAUREL]: ["#0A38C2", "#0A7DC2", "#0AC2C2", "#0AC27D", "#0AC238", "#21C20A", "#66C20A", "#ABC20A", "#C2940A", "#C24F0A", "#C20A0A"],
  [SUBTROPICAL]: ["#0033CC", "#007FCC", "#00CCCC", "#00CC80", "#00CC33", "#1ACC00", "#66CC00", "#B3CC00", "#CC9900", "#CC4D00", "#CC0000"],
  [OCEAN]: [null, null, null, "#0B0B70"],
  [DEEPOCEAN]: ["#0B0B10", "#0B0B30", "#0B0B50"],
};
const minecraftBiomeNames = {
  [ALPINE]: "minecraft:mutated_extreme_hills",
  [CONIFERROUS]: "minecraft:taiga",
  [SUMMERGREEN]: "minecraft:beaches",
  [LAUREL]: "minecraft:forest",
  [SUBTROPICAL]: "minecraft:jungle",
  [OCEAN]: "minecraft:ocean",
  [DEEPOCEAN]: "minecraft:deep_ocean"
}

const customBiomes = []

Object
  .keys(biomeColors)
  .forEach((biomeName) => {
    biomeColors[biomeName].forEach((color, i) => {
      if (color === null) { return }
      const biomeHeight = -8.1 + i * 1.6;
      const biomeData = {
        biomeExtends: biomeName,
        biomeColor: color,
        replaceToBiomeName: minecraftBiomeNames[biomeName],
        biomeHeight,
        biomeVolatility: volatility[i],
        smoothRadius: 4
      }

      const rendered = ejs.render(biomeTemplate, biomeData);

      fs.writeFileSync(`${ROOTDIR}/WorldBiomes/${biomeName} ${suffix[i]}.bc`, rendered);

      customBiomes.push(`${biomeName} ${suffix[i]}`)
    })
  });

const worldConfigTemplate = fs.readFileSync(`${ROOTDIR}/WorldConfig.ejs`).toString();
const worldConfigData = {
  imageOrientation: 'North',
  imageXOffset: -256,
  imageZOffset: -256,
  customBiomes,
  biomeMode: 'FromImage',
  imageFile: `${ROOTDIR}.png`,
  worldHeightScaleBits: 7,
  waterLevelMax: 35
}
fs.writeFileSync(`${ROOTDIR}/WorldConfig.ini`, ejs.render(worldConfigTemplate, worldConfigData));

