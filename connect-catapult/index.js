const catapult = require('catapult-sdk');
const net = require('net');

const config = {
    clientPrivateKey: '0000000000000000000000000000000000000000000000000000000000000000'
};
const node = {
    host: '13.115.141.239',
    port: '7910',
    publicKey: '6244B76B2385C47872E0EA2B6C746408D8021349A13DCAE007D3F6A58E472D01'
};

const serverSocket = net.createConnection(node.port, node.host);
const apiNodePublicKey = catapult.utils.convert.hexToUint8(node.publicKey);

const clientKeyPair = catapult.crypto.createKeyPairFromPrivateKeyString(config.clientPrivateKey);

const params = {
    payload: 'A5000000894A829717A6627C108BD69D56A188659C403A4E2C0CEDBB35F856AFD57713E9ACA553C68803E56E39683A9D18CBAF258BFCE043724C56175C53E425727C050FAC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26039054410000000000000000F475D6151700000090FA39EC47E05600AFA74308A7EA607D145E371B5F4F1447BC0100010044B262C46CEABB850000000000000000',
    hash: '',
    signer: '',
    type: 16724,
    networkType: 144
};

serverSocket
    .on('error', err => {
        console.error(`error raised by ${node.host}:${node.port} connection`, err);
    })
    .on('close', () => {
        console.log('close');
    });

catapult.auth.createAuthPromise(serverSocket, clientKeyPair, apiNodePublicKey, console.log).then(() => {

    const connection = serverSocket;
    const packetHeader = catapult.packet.header;

    const createPacketFromBuffer = (data, packetType) => {
        const length = packetHeader.size + data.length;
        const header = packetHeader.createBuffer(packetType, length);
        const buffers = [header, Buffer.from(data)];
        return Buffer.concat(buffers, length);
    };

    const parser = params => {
        return catapult.utils.convert.hexToUint8(params.payload)
    };

    const packetType = catapult.packet.PacketType.pushTransactions;

    const packetBuffer = createPacketFromBuffer(parser(params), packetType);
    console.log(packetBuffer.toString('hex').toUpperCase());
    const payload = packetBuffer;

    return new Promise((resolve, reject) => {
        connection.write(payload, resolve);
    })

}).then(() => {
    const packetType = catapult.packet.PacketType.pushTransactions;
    console.log(
        { message: `packet ${packetType} was pushed to the network via transaction` }
    );
    serverSocket.destroy();
});
