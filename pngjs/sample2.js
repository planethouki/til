const PNG = require("pngjs").PNG;
const fs = require("fs");

const nx = 512;
const ny = 512;
const newfile = new PNG({ width: nx, height: ny });


// min <= return < max
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function setColor(file, x, y, r = 0x00, g = 0x00, b = 0x00, a = 0xff) {
  let idx = (file.width * y + x) << 2;

  file.data[idx] = r;
  file.data[idx + 1] = g;
  file.data[idx + 2] = b;
  file.data[idx + 3] = a;
}

const devide = 5;

for (let dy = 0; dy < devide; dy++) {
  for (let dx = 0; dx < devide; dx++) {
    if (dy === 0 && (dx === 0 || dx === devide - 1)) {
      continue;
    }
    if (dy == devide - 1 && (dx === 0 || dx === devide -1)) {
      continue;
    }
    if (0 < dx && dx < devide - 1) {
      if (0 < dy && dy < devide - 1) {
        continue;
      }
    }
    const xSpan = nx / devide;
    const xStart = Math.floor(xSpan * dx);
    const xEnd = Math.floor(xStart + xSpan);
    const ySpan = ny / devide;
    const yStart = Math.floor(ySpan * dy);
    const yEnd = Math.floor(yStart + ySpan);
    const x = getRandomArbitrary(xStart, xEnd);
    const y = getRandomArbitrary(yStart, yEnd);
    setColor(newfile, x, y, 0xff, 0xff, 0xff);
    // for (ix = xStart; ix <= xEnd; ix++) {
    //   for (iy = yStart; iy <= yEnd; iy++) {
    //     setColor(newfile, ix, iy, Math.floor(0xff / devide * dx), Math.floor(0xff / devide * dy));
    //   }
    // }

  }
}

newfile
  .pack()
  .pipe(fs.createWriteStream(__dirname + "/newfile2.png"))
  .on("finish", function () {
    console.log("Written!");
  });
