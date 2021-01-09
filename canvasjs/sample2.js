const fs = require('fs')
const { createCanvas } = require('canvas')

function getRandomSign() {
  return Math.sign(Math.random() - 0.5)
}


// min <= return < max
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const nx = 512;
const ny = 512;

const order2points = {}

const canvas = createCanvas(nx, ny)
const ctx = canvas.getContext('2d')
ctx.antialias = 'none'

const devide = 5;
const clockwise = [];
for (let i = 1; i < devide - 1; i++) {
  clockwise.push({ x: i, y: 0 })
}
for (let i = 1; i < devide - 1; i++) {
  clockwise.push({ x: devide - 1, y: i })
}
for (let i = 1; i < devide - 1; i++) {
  clockwise.push({ x: devide - 1 - i, y: devide - 1 })
}
for (let i = 1; i < devide - 1; i++) {
  clockwise.push({ x: 0, y: devide - 1 - i })
}

clockwise.forEach((c, index) => {
  const xSpan = nx / devide;
  const xStart = Math.floor(xSpan * c.x);
  const xEnd = Math.floor(xStart + xSpan);
  const ySpan = ny / devide;
  const yStart = Math.floor(ySpan * c.y);
  const yEnd = Math.floor(yStart + ySpan);
  let x = (xStart + xEnd) / 2;
  x += 0.7 * getRandomSign() * getRandomArbitrary(0, xSpan / 2);
  let y = (yStart + yEnd) / 2;
  y += 0.7 * getRandomSign() * getRandomArbitrary(0, ySpan / 2);
  order2points[index] = { x, y }
})

// Object.keys(order2points)
//   .sort((a, b) => a - b)
//   .map(key => order2points[key])
//   .forEach((c) => {
//     ctx.beginPath();
//     ctx.strokeStyle = "red";
//     ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI, false);
//     ctx.stroke();
//   });

const colors = ['yellow', 'purple'];

for (let itr = 1; itr <= 6; itr++) {
  console.log(`iteration: ${itr}`);
  const orders = Object.keys(order2points).sort((a, b) => a - b);
  const ordersDiff = (Number(orders[1]) - Number(orders[0])) / 2;
  const addedPoints = [];
  for (let i = 0; i < orders.length; i++) {
    const p1 = order2points[orders[i]];
    const p2 = order2points[orders[(i + 1) % orders.length]];
    const m = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    m.y += 0.5 * getRandomSign() * Math.abs(p1.x - p2.x);
    m.x += 0.5 * getRandomSign() * Math.abs(p1.y - p2.y);
    if (m.x < 0) { m.x = 0 }
    if (m.y < 0) { m.y = 0 }
    if (m.x >= nx) { m.x = nx - 1 }
    if (m.y >= ny) { m.y = ny - 1 }
    const order = Number(orders[i]) + ordersDiff;
    order2points[order] = m;
    addedPoints.push(m);
  }
  // addedPoints.forEach((c) => {
  //   ctx.beginPath();
  //   ctx.strokeStyle = colors[(itr - 1) % colors.length];
  //   ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI, false);
  //   ctx.stroke();
  // });
}

ctx.beginPath();
ctx.strokeStyle = '#ffffff';
ctx.fillStyle = '#ffffff';
Object.keys(order2points)
  .sort((a, b) => a - b)
  .map(key => order2points[key])
  .forEach((c) => {
    ctx.lineTo(c.x, c.y);
  });
ctx.closePath();
ctx.fill();


const out = fs.createWriteStream(__dirname + '/test.png')
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () =>  console.log('The PNG file was created.'))
