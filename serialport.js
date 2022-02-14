const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const serialPort = new SerialPort({
	path: 'COM5',
	baudRate: 9600,
});

setTimeout(() => {
	serialPort.write('1');
}, 2000);
