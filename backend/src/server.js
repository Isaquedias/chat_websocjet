
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on('connection', (ws) => {
    ws.on("error", console.error);

    // ws.send('Welcome to the chat!')

    ws.on('message', (data) => {

        wss.clients.forEach((client) => {
            console.log(data.toString());
            client.send(data.toString());
        });
    });

    console.log('New client connected!');
});