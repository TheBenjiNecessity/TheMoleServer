var express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var http = require('http');
var cors = require('cors');

import { RequestServiceCreator } from './services/request.service';
import WebSocketService from './services/websocket.service';
import RoomSocketHandler from './controllers/room.socket-handler';
import ChallengeService from './services/game/challenge.service';
import RoomController from './controllers/room.controller';

import './extensions/main';
import ChallengeController from './controllers/challenge.controller';

const app = require('express')();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cors());

RequestServiceCreator.createService(app);

let webSocketService = WebSocketService.getInstance();
let roomControllerInstance = RoomController.getInstance();
let challengeControllerInstance = ChallengeController.getInstance();

async function run() {
	webSocketService.init(io);

	roomControllerInstance.init();

	server.listen(process.env.PORT || 8999);

	console.log('Server started');
}

run();
