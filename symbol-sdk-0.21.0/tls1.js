const tls = require('tls');

// const dir = './cert'
// const config = {
//     certificate: fs.readFileSync(`${dir}/node.crt.pem`),
//     key: fs.readFileSync(`${dir}/node.key.pem`),
//     caCertificate: fs.readFileSync(`${dir}/ca.cert.pem`)
// };

const node = {
    port: 7900,
    host: "beacon-01.us-east-1.0.10.0.x.symboldev.network"
}
// const node = {
//     port: 7900,
//     host: "api-01.ap-northeast-1.0.10.0.x.symboldev.network"
// }
// const node = {
//     "port": 7900,
//     "host": "54.238.93.124"
// };

console.log(`connecting to ${node.host}:${node.port}`);

const contextOptions = {
    minVersion: 'TLSv1.3',
    // key: config.key,
    // cert: config.certificate,
    // ca: [config.caCertificate],
    sigalgs: 'ed25519'
};

let secureContext;
try {
    secureContext = tls.createSecureContext(contextOptions)
} catch (error) {
    console.error('an error occurred with the provided TLS key and certificates before trying to establish any connection to the server');
    throw error;
}

const connectionOptions = {
    host: node.host,
    port: node.port,
    secureContext,
    // skip hostname checks since this is not a web-https case
    checkServerIdentity: () => undefined
};

const serverSocket = tls.connect(connectionOptions);

new Promise((resolve, reject) => {
    serverSocket.enableTrace();
    serverSocket
        .on('data', (data) => {
            console.log('data', data.toString());
        })
        .on('connect', () => {
            console.log('connect');
            resolve();
        })
        .on('keylog', (line) => {
            // console.log('keylog', line.toString());
        })
        .on('secureConnect', () => {
            if (serverSocket.authorized) {
                console.log('secure connect');
                resolve();
            }
        })
        .on('error', err => {
            console.log('error');
            reject(err);
        })
        .once('close', () => {
            console.log('connection close');
            serverSocket.destroy();
        });
})
    .then(() => {
        serverSocket.end();
    })
    .catch((e) => {
        console.log(e);
    });