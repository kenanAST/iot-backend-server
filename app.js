const express = require('express');
const http = require('http');
const res = require('express/lib/response');
const socketio = require('socket.io');
const fs = require('fs');
const { append } = require('express/lib/response');
const { delimiter } = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

//Serial Port

//////////////////////////////////////////////////

const data = fs.readFileSync('data.json', 'utf-8');
const dataObj = JSON.parse(data);

// app.get('/', (request, response) => {
// 	response.status(200).json({ name: 'Joshua Kenan', age: '21' });
// });

// app.post('/', (request, response) => {
// 	response.send('You can send post to this endpoint');
// });

// app.post('/counter', (request, response) => {
// 	dataObj.data.counter += 1;
// 	console.log(dataObj.data.LED);
// });

const serialPort = new SerialPort({
	path: 'COM5',
	baudRate: 9600,
});

setTimeout(() => {
	serialPort.write(dataObj.data.LED);
}, 2000);

io.on('connection', (socket) => {
	console.log(`New Web Socket ${socket.id}`);
	socket.on('disconnect', () => {
		console.log('User has disconnected');
	});

	//Toggle LED
	socket.on('toggleLED', (data) => {
		dataObj.data.LED = data;
		fs.writeFileSync('data.json', JSON.stringify(dataObj));

		//Update Data
		socket.broadcast.emit('led', dataObj.data.LED);
		serialPort.write(dataObj.data.LED);
	});
	//Initialize and LifeCyle
	socket.emit('led', dataObj.data.LED);
	console.log(dataObj.data.LED);
});

const port = 8000;
server.listen(port, () => {
	console.log(`Running on port ${port}`);
});
