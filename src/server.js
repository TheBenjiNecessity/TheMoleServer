var express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var http = require('http');
var cors = require('cors');

import { RequestServiceCreator } from './services/request.service';
import WebSocketServiceCreator from './services/websocket.service';
import RoomControllerCreator from './controllers/room.controller';
import initExtensions from './extensions/main';
import RoomSocketHandler from './controllers/room.socket-handler';

initExtensions();

const app = require('express')();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cors());

RequestServiceCreator.createService(app);

let webSocketService = WebSocketServiceCreator.getInstance();
let instance = RoomSocketHandler.getInstance();

async function run() {
	await instance.init();
	webSocketService.init(io, instance);

	server.listen(process.env.PORT || 8999);

	console.log('Server started');
}

run();
