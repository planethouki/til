let PNG = require("pngjs").PNG;
let fs = require("fs");

let newfile = new PNG({ width: 10, height: 10 });

function setColor(file, x, y, r = 0x00, g = 0x00, b = 0x00, a = 0xff) {
  let idx = (file.width * y + x) << 2;

  file.data[idx] = r;
  file.data[idx + 1] = g;
  file.data[idx + 2] = b;
  file.data[idx + 3] = a;
}

for (let y = 0; y < newfile.height; y++) {
  for (let x = 0; x < newfile.width; x++) {
    const r = Math.floor(x / newfile.width * 0xff);
    const g = 0x00;
    const b = 0x00;
    setColor(newfile, x, y, r, g, b)
    // let idx = (newfile.width * y + x) << 2;

    // let col =
    //   (x < newfile.width >> 1) ^ (y < newfile.height >> 1) ? 0xe5 : 0xff;

    // newfile.data[idx] = col;
    // newfile.data[idx + 1] = col;
    // newfile.data[idx + 2] = col;
    // newfile.data[idx + 3] = 0xff;
  }
}

newfile
  .pack()
  .pipe(fs.createWriteStream(__dirname + "/newfile.png"))
  .on("finish", function () {
    console.log("Written!");
  });
