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
  var totalAmplitude = 0;
  // blend noise together
  for (let octave = octaveMax; octave >= octaveMin; --octave) {
    amplitude *= persistence;
    totalAmplitude += amplitude;

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


const n = 9;
const max = Math.pow(2, n);

const nx = max + 1;
const ny = max + 1;

const newfile = new PNG({ width: nx, height: ny });

const perlin = generatePerlinNoise(nx, ny, {
  octaveMax: n - 3,
  octaveMin: n - 6
});

console.log(...[...Array(11).keys()].map((index) => {
  const value = index / 10;
  const step = Math.floor(value * 10) / 10;
  const h = -225 * step + 225;
  const rgb = hslRgb(h, 0.9, 0.4);
  return rgb.reduce((acc, cur) => {
    const hex = `00${cur.toString(16)}`.substr(-2).toUpperCase();
    return `${acc}${hex}`;
  }, "#");
}));

perlin.forEach((value, index) => {
  const i = index << 2;
  const step = Math.floor(value * 10) / 10;
  const h = -225 * step + 225;
  const rgb = hslRgb(h, 0.9, 0.4);
  newfile.data[i + 0] = rgb[0];
  newfile.data[i + 1] = rgb[1];
  newfile.data[i + 2] = rgb[2];
  newfile.data[i + 3] = 0xff;
});

newfile
  .pack()
  .pipe(fs.createWriteStream(__dirname + "/single1.png"))
  .on("finish", function () {
    console.log("Written!");
  });
