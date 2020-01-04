process.env.HASHING_FUNCTION = 'keccak';

const catapult = require('catapult-sdk');
const net = require('net');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const { sizes } = catapult.constants;

const config = {
    clientPrivateKey: '1B86B4F9120358FA83E79E4D38C2A2BC6A8A8C08B128659C751F21C6585D15D3'
};
const node = {
    host: 'test-api.48gh23s.xyz',
    port: '7900',
    publicKey: '945FE33CEBE8EA7B3F7530A57649E4575F5DCE8741B94949BB105E2A1996A349'
};

// const node = {
//     host: 'devnet-api.48gh23s.xyz',
//     port: '7950',
//     publicKey: '45B0843E484D47B55717E3FE757A190D9201C1EA81EFFF760D2FB497CCAAAF4D'
// };

logger.debug(`connecting to ${node.host}:${node.port}`);
const serverSocket = net.createConnection(node.port, node.host);
const apiNodePublicKey = catapult.utils.convert.hexToUint8(node.publicKey);

const clientKeyPair = catapult.crypto.createKeyPairFromPrivateKeyString(config.clientPrivateKey);

serverSocket
    .on('error', err => {
        logger.error(`error raised by ${node.host}:${node.port} connection`, err);
    })
    .on('close', () => {
        logger.debug('connection close');
    });

catapult.auth.createAuthPromise(serverSocket, clientKeyPair, apiNodePublicKey, console.log)
    .then(() => {
        const connection = serverSocket;
        const packetHeader = catapult.packet.header;
        const packetType = catapult.packet.PacketType.nodeDiscoveryPullPing;
        const packetBuffer = packetHeader.createBuffer(packetType, packetHeader.size);

        const payload = packetBuffer;

        return new Promise((resolve, reject) => {
            connection.write(payload, resolve);
        })
    }).then(() => {
        return new Promise((resolve, reject) => {
            const connection = serverSocket;
            const packetParser = new catapult.parser.PacketParser();
            connection.once('close', () => {
                serverSocket.destroy();
                reject();
            });
            connection.on('data', data => {
                packetParser.push(data);
            });
            packetParser.onPacket(packet => {
                serverSocket.destroy();
                resolve(packet);
            });
        })
    }).then((packet) => {
        logger.debug(packet);
        const parser = new catapult.parser.BinaryParser();
        parser.push(packet.payload);
        const nodeInfo = {};
        parser.uint32(); // Node size
        nodeInfo.version = parser.uint32();
        nodeInfo.publicKey = parser.buffer(sizes.signerPublicKey);
        nodeInfo.roles = parser.uint32();
        nodeInfo.port = parser.uint16();
        nodeInfo.networkIdentifier = parser.uint8();
        const hostSize = parser.uint8();
        const friendlyNameSize = parser.uint8();
        nodeInfo.host = 0 === hostSize ? Buffer.alloc(0) : parser.buffer(hostSize);
        nodeInfo.friendlyName = 0 === friendlyNameSize ? Buffer.alloc(0) : parser.buffer(friendlyNameSize);
        logger.info(nodeInfo);
    });
