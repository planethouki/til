const Anvil = require('prismarine-provider-anvil').Anvil('1.16')
const Vec3 = require('vec3')
const path = require('path')
const fs = require('fs')


const anvil = new Anvil(path.join(__dirname, './worlds/1_16_5-4/region'))

const getChunks = (chunkX: number, chunkZ: number) => {

    const getBlocks = (data: { getBlock: (arg0: any) => any }) => {
        const blockNameList: string[] = [];
        const point: any = [];
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                const vertical: string[] = []
                for (let y = 62; y < 80; y++) {
                    const block = data.getBlock(new Vec3(x + chunkX * 16, y, z + chunkZ * 16))
                    vertical.push(block.name)
                    blockNameList.push(block.name)
                }
                point.push({
                    x: x + chunkX * 16,
                    z: z + chunkZ * 16,
                    vertical
                }) 
            }
        }
        return {
            blockNameList: [...new Set(blockNameList)],
            data: point
        }
    }

    return anvil
        .load(chunkX, chunkZ)
        .then(getBlocks)
        .catch(function (err: { stack: any }) {
            console.log(err.stack)
        })
}

const main = async () => {
    const blockNameListList: string[] = []
    const dataList: any = []
    for (let x = 0; x < 4; x++) {
        for (let z = 0; z < 4; z++) {
            console.log("chunk", x, z)
            const { blockNameList, data } = await getChunks(x, z)
            blockNameListList.push(...blockNameList)
            dataList.push(...data)
        }
    }
    fs.writeFileSync('./out.json', JSON.stringify({
        blockNameList: [...new Set(blockNameListList)],
        data: dataList
    }))
}

main()