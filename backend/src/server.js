const { Server: WebSocketServer } = require('ws');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const server = http.createServer();

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });

    console.log('Client connected');
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
