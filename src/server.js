var express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var http = require('http');
var cors = require('cors');

import { RequestServiceCreator } from './services/request.service';
import { WebSocketControllerCreator } from './services/websocket.service';
import { RoomHandlerCreator } from './controllers/room.controller';
import { ChallengeControllerCreator } from './controllers/challenge.controller';

const app = require('express')();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cors());

server.listen(process.env.PORT || 8999);

let webSocketController = WebSocketControllerCreator.createController(io);
RequestServiceCreator.createService(app);

RoomHandlerCreator.createController(webSocketController);
ChallengeControllerCreator.createController(webSocketController);

/**
 * Client requests:
 * - Create a room and join it
 * - or join an existing room
 * 
 * Client Socket:
 * - 
 */
