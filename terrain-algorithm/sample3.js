// https://blog.splout.co.jp/3429/ #2
// https://en.wikipedia.org/wiki/Diamond-square_algorithm

const PNG = require("pngjs").PNG;
const fs = require("fs");

const power = 9;
const nx = Math.pow(2, power) + 1;
const ny = Math.pow(2, power) + 1;

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
  let idx = (file.width * y + x) << 2;
  file.data[idx + 0] = value * 0xff;
  file.data[idx + 1] = value * 0xff;
  file.data[idx + 2] = value * 0xff;
  file.data[idx + 3] = 0xff;
}

function getValue(file, x, y) {
  let idx = (file.width * y + x) << 2;
  return (file.data[idx + 0] + file.data[idx + 1] + file.data[idx + 2]) / (0xff * 3);
}

function setColor(file, x, y, r = 0x00, g = 0x00, b = 0x00, a = 0xff) {
  let idx = (file.width * y + x) << 2;

  file.data[idx] = r;
  file.data[idx + 1] = g;
  file.data[idx + 2] = b;
  file.data[idx + 3] = a;
}

function hoge(x, power) {
  const c = Math.pow(2, power - 1);
  if (x === c) {
    return 0;
  } else if (x < c) {
    return - x + Math.pow(2, power - 1);
  } else if (x > c) {
    return x - Math.pow(2, power - 1);
  }
}

// center = 1
const center = Math.pow(2, power - 1);
setColor(newfile, center, center, 0xff, 0xff, 0xff);

// edge = 0
for (let x = 0; x < nx; x++) {
  setColor(newfile, x, 0, 0, 0, 0);
  setColor(newfile, x, ny, 0, 0, 0);
}
for (let y = 0; y < ny; y++) {
  setColor(newfile, 0, y, 0, 0, 0);
  setColor(newfile, nx, y, 0, 0, 0);
}

for (let p = 1; p < power; p++) {
  const iStep = Math.pow(2, power - p);
  const neighborDistance = iStep / 2;
  for (let i = 0; i < Math.pow(2, p - 1); i++) {
    const sideLength = Math.pow(2, power) - iStep * (2 * i - 1);
    // top
    for (let j = 0; j < sideLength; j++) {
      const x = (iStep / 2) * (2 * i - 1);
    }

    const y = Math.pow(2, power - 1);
    const x = Math.pow(2, power - p - 1) + i * iStep;
    const refLeft = x - neighborDistance;
    const refRight = x + neighborDistance;
    const refLeftValue = getValue(newfile, refLeft, y);
    const refRightValue = getValue(newfile, refRight, y);
    let value = getRandomSign() * getRandomArbitrary(0, 0.2) + (refLeftValue + refRightValue) / 2;
    if (value < 0) { value = 0 }
    if (value > 1) { value = 1 }
    const yHalfLength = hoge(x, power);
    for (let j = 0; j < yHalfLength; j++) {
      setValue(newfile, x, y + j, value);
      setValue(newfile, x, y - j, value);
    }
    setValue(newfile, x, y, value);
  }
  // const distance = Math.pow(2, power - p);
  // const xyStart = Math.pow(2, power - p - 1);
  // const xyEnd = xyStart + distance;
  // for (let xy = xyStart; xy < xyEnd; xy++) {
  //   setColor(newfile, xy, xyStart, 0x7f, 0x7f, 0x7f);
  //   setColor(newfile, xy, xyEnd, 0x7f, 0x7f, 0x7f);
  //   setColor(newfile, xyStart, xy, 0x7f, 0x7f, 0x7f);
  //   setColor(newfile, xyEnd, xy, 0x7f, 0x7f, 0x7f);
  // }

}

newfile
  .pack()
  .pipe(fs.createWriteStream(__dirname + "/newfile3.png"))
  .on("finish", function () {
    console.log("Written!");
  });
