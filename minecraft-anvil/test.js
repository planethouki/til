const Anvil = require('prismarine-provider-anvil').Anvil('1.16')
const Vec3 = require('vec3')
const path = require('path')
const fs = require('fs');

const anvil = new Anvil(path.join(__dirname, './worlds/1/region'))
const d = anvil.load(0, 0)

d.then(function (data) {
    // console.log(data.getBlock(new Vec3(0, 62, 0)))
    const out = {
        data: []
    }
    for (let x = -15; x <= 16; x++) {
        for (let z = 170; z < 180; z++) {
            const vertical = []
            for (let y = -2; y < 18; y++) {
                const block = data.getBlock(new Vec3(x, y, z))
                vertical.push(block.name)
            }
            out.data.push({
                x,
                z,
                vertical
            }) 
        }
    }
    fs.writeFileSync('./out.json', JSON.stringify(out));
}).catch(function (err) {
    console.log(err.stack)
})