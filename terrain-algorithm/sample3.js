// https://blog.splout.co.jp/3429/ #2
// https://en.wikipedia.org/wiki/Diamond-square_algorithm
// http://www.playfuljs.com/realistic-terrain-in-130-lines/

const PNG = require("pngjs").PNG;
const fs = require("fs");

const n = 9;
const max = Math.pow(2, n);

const nx = max + 1;
const ny = max + 1;

const newfile = new PNG({ width: nx, height: ny });

function getRandomSign() {
  return Math.sign(Math.random() - 0.5)
}

// min <= return < max
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 *
 * @param {*} file
 * @param {number} x
 * @param {number} y
 * @param {number} value 0 to 1
 */
function setValue(file, x, y, value) {
  if (x < 0 || y < 0 || x > max || y > max) { return; }
  let idx = (file.width * y + x) << 2;
  file.data[idx + 0] = value * 0xff;
  file.data[idx + 1] = value * 0xff;
  file.data[idx + 2] = value * 0xff;
  file.data[idx + 3] = 0xff;
}

function getValue(file, x, y) {
  if (x < 0 || y < 0 || x > max || y > max) { return -1; }
  let idx = (file.width * y + x) << 2;
  return (file.data[idx + 0] + file.data[idx + 1] + file.data[idx + 2]) / (0xff * 3);
}

// edge
setValue(newfile, 0, 0, 1);
setValue(newfile, max, 0, 0.5);
setValue(newfile, max, max, 0);
setValue(newfile, 0, max, 0.5);

function divide(size) {
  const half = size / 2;
  var scale = 0.2;
  if (half < 1) return;

  for (let y = half; y < ny; y += size) {
    for (let x = half; x < nx; x += size) {
      const samples = [
        getValue(newfile, x - half, y - half),
        getValue(newfile, x + half, y - half),
        getValue(newfile, x + half, y + half),
        getValue(newfile, x - half, y + half)
      ].filter(v => v !== -1);
      const sum = samples.reduce((previous, current) => {
        return previous + current;
      }, 0);
      const average = samples.length > 0 ? sum / samples.length : 0;
      let value = average + getRandomArbitrary(-scale, scale);
      if (value < 0) { value = 0 }
      if (value > 1) { value = 1 }
      setValue(newfile, x, y, value);
    }
  }
  for (let y = 0; y <= ny; y += half) {
    for (let x = (y + half) % size; x <= nx; x += size) {
      const samples = [
        getValue(newfile, x, y - half),
        getValue(newfile, x + half, y),
        getValue(newfile, x, y + half),
        getValue(newfile, x - half, y)
      ].filter(v => v !== -1);
      const sum = samples.reduce((previous, current) => {
        return previous + current;
      }, 0);
      const average = samples.length > 0 ? sum / samples.length : 0;
      let value = average + getRandomArbitrary(-scale, scale);
      if (value < 0) { value = 0 }
      if (value > 1) { value = 1 }
      setValue(newfile, x, y, value);
    }
  }
  divide(size / 2);
}

divide(Math.pow(2, n));

newfile
  .pack()
  .pipe(fs.createWriteStream(__dirname + "/sample3.png"))
  .on("finish", function () {
    console.log("Written!");
  });
