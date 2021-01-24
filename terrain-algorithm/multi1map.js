const hslRgb = require('hsl-rgb');
const PNG = require("pngjs").PNG;
const fs = require("fs");

function generatePerlinNoise(width, height, options) {
  options = options || {};
  var octaveMin = options.octaveMin || 4;
  var octaveMax = options.octaveMax || 7;
  var octaveCount = octaveMax - octaveMin + 1;
  var amplitude = options.amplitude || 1;
  var persistence = options.persistence || 0.5;

  var smoothNoiseList = new Array(octaveCount);
  for (let octave = octaveMin; octave <= octaveMax; octave++) {
    var whiteNoise = generateWhiteNoise(width, height);
    smoothNoiseList[octave] = generateSmoothNoise(octave, whiteNoise, width, height);
  }
  var perlinNoise = new Array(width * height);
  // blend noise together
  for (let octave = octaveMax; octave >= octaveMin; --octave) {
    amplitude *= persistence;

    console.log(octave, amplitude);

    for (var j = 0; j < perlinNoise.length; ++j) {
      perlinNoise[j] = perlinNoise[j] || 0;
      perlinNoise[j] += smoothNoiseList[octave][j] * amplitude;
    }
  }

  // normalization
  const maxAmplitude = perlinNoise.reduce((acc, cur) => {
    return acc > cur ? acc : cur;
  });
  const normalizedPerlinNoise = perlinNoise.map((val) => {
    return val /=  maxAmplitude;
  });

  return normalizedPerlinNoise;
}

function generateSmoothNoise(octave, whiteNoise, width, height) {
  var noise = new Array(width * height);
  var samplePeriod = Math.pow(2, octave);
  var sampleFrequency = 1 / samplePeriod;
  var noiseIndex = 0;
  for (var y = 0; y < height; ++y) {
    var sampleY0 = Math.floor(y / samplePeriod) * samplePeriod;
    var sampleY1 = (sampleY0 + samplePeriod) % height;
    var vertBlend = (y - sampleY0) * sampleFrequency;
    for (var x = 0; x < width; ++x) {
      var sampleX0 = Math.floor(x / samplePeriod) * samplePeriod;
      var sampleX1 = (sampleX0 + samplePeriod) % width;
      var horizBlend = (x - sampleX0) * sampleFrequency;

      // blend top two corners
      var top = interpolate(whiteNoise[sampleY0 * width + sampleX0], whiteNoise[sampleY1 * width + sampleX0], vertBlend);
      // blend bottom two corners
      var bottom = interpolate(whiteNoise[sampleY0 * width + sampleX1], whiteNoise[sampleY1 * width + sampleX1], vertBlend);
      // final blend
      noise[noiseIndex] = interpolate(top, bottom, horizBlend);
      noiseIndex += 1;
    }
  }
  return noise;
}

function generateWhiteNoise(width, height) {
  var noise = new Array(width * height);
  for (var i = 0; i < noise.length; ++i) {
    noise[i] = Math.random();
  }
  return noise;
}

function interpolate(x0, x1, alpha) {
  return x0 * (1 - alpha) + alpha * x1;
}

function generateSlope(width, height, options) {
  var value = new Array(width * height);
  for (var i = 0; i < value.length; ++i) {
    value[i] = i / value.length;
  }
  return value;
}


const n = 9;
const max = Math.pow(2, n);

const nx = max + 1;
const ny = max + 1;

const biomeFile = new PNG({ width: nx, height: ny });
const heightFile = new PNG({ width: nx, height: ny });
const temperatureFile = new PNG({ width: nx, height: ny });
const distributionFile = new PNG({ width: nx, height: ny });

const perlinHeight = generatePerlinNoise(nx, ny, {
  octaveMax: n - 3,
  octaveMin: n - 6
});

const perlinTemperature = generateSlope(nx, ny, {
  octaveMax: n - 1,
  octaveMin: n - 4,
  persistence: 0.3
});

const displayColors = (saturation) => {
  const colors = [...Array(11).keys()].map((index) => {
    const value = index / 10;
    const step = Math.floor(value * 10) / 10;
    const h = -225 * step + 225;
    const rgb = hslRgb(h, saturation, 0.4);
    return rgb.reduce((acc, cur) => {
      const hex = `00${cur.toString(16)}`.substr(-2).toUpperCase();
      return `${acc}${hex}`;
    }, "#");
  });
  console.log(colors.map(c => `"${c}"`).join(", "))
}

[...Array(5).keys()].map(i => 0.6 + 0.1 * i).forEach(displayColors)

const temperatureHeightCurve = (h, t) => {
  const stepHeight = Math.floor(h * 10) / 10;
  const hue = -225 * stepHeight + 225;

  if (stepHeight === 0) {
    return [11, 11, 16];  // #0B0B10
  }

  if (stepHeight === 0.1) {
    return [11, 11, 48];  // #0B0B30
  }

  if (stepHeight === 0.2) {
    return [11, 11, 80];  // #0B0B50
  }

  if (stepHeight === 0.3) {
    return [11, 11, 112]; // #0B0B70
  }


  const tilt = [...Array(5).keys()].map(() => 0.4);
  const intercept = [...Array(5).keys()].map(i => 0.7 - 0.2 * i);
  const saturation = [...Array(5).keys()].map(i => 0.6 + 0.1 * i);

  for (let i = 0; i < intercept.length - 1; i++) {
    if (h > tilt[i] * t + intercept[i]) {
      return hslRgb(hue, saturation[i], 0.4);
    }
  }

  return hslRgb(hue, saturation[intercept.length - 1], 0.4);
}

for (let index = 0; index < nx * ny; index++) {
  const temperature = perlinTemperature[index];
  const height = perlinHeight[index];
  const rgb = temperatureHeightCurve(height, temperature);

  const i = index << 2;
  biomeFile.data[i + 0] = rgb[0];
  biomeFile.data[i + 1] = rgb[1];
  biomeFile.data[i + 2] = rgb[2];
  biomeFile.data[i + 3] = 0xff;
}

perlinHeight.forEach((value, index) => {
  const i = index << 2;
  const step = Math.floor(value * 10) / 10;
  const h = -225 * step + 225;
  const rgb = hslRgb(h, 0.9, 0.4);
  heightFile.data[i + 0] = rgb[0];
  heightFile.data[i + 1] = rgb[1];
  heightFile.data[i + 2] = rgb[2];
  heightFile.data[i + 3] = 0xff;
});

perlinTemperature.forEach((value, index) => {
  const i = index << 2;
  const h = -225 * value + 225;
  const rgb = hslRgb(h, 0.9, 0.4);
  temperatureFile.data[i + 0] = rgb[0];
  temperatureFile.data[i + 1] = rgb[1];
  temperatureFile.data[i + 2] = rgb[2];
  temperatureFile.data[i + 3] = 0xff;
});

for (let h = 0; h < ny; h++) {
  for (let t = 0; t < nx; t++) {
    const index = t + h * nx;
    const temperature = t / nx;
    const height = h / ny;
    const rgb = temperatureHeightCurve(height, temperature);

    const i = index << 2;
    distributionFile.data[i + 0] = rgb[0];
    distributionFile.data[i + 1] = rgb[1];
    distributionFile.data[i + 2] = rgb[2];
    distributionFile.data[i + 3] = 0xff;
  }
}

for (let index = 0; index < nx * ny; index++) {
}

const biomePromise = new Promise((resolve) => {
  biomeFile
    .pack()
    .pipe(fs.createWriteStream(__dirname + "/multi1.png"))
    .on("finish", resolve);
});

const heightPromise = new Promise((resolve) => {
  heightFile
    .pack()
    .pipe(fs.createWriteStream(__dirname + "/multi1height.png"))
    .on("finish", resolve);
});

const temperaturePromise = new Promise((resolve) => {
  temperatureFile
    .pack()
    .pipe(fs.createWriteStream(__dirname + "/multi1temperature.png"))
    .on("finish", resolve);
});

const distributionPromise = new Promise((resolve) => {
  distributionFile
    .pack()
    .pipe(fs.createWriteStream(__dirname + "/multi1distribution.png"))
    .on("finish", resolve);
});

Promise
  .all([biomePromise, heightPromise, temperaturePromise, distributionPromise])
  .then(() => {
    console.log("Written!");
  });
