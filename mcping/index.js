const mcping = require('mcping-js')
 
// 25565 is the default Minecraft Java Edition multiplayer server port
// The port may be omitted and will default to 25565
const server = new mcping.MinecraftServer('houkiserver.com', 25565)
 
server.ping(1000, 74, (err, res) => {
    console.log(res)
    console.log(err)
})