"use strict";

var _request = require("./services/request.service");

var _websocket = require("./services/websocket.service");

var express = require('express');

var http = require('http');

var cors = require('cors');

var app = express();
var server = http.createServer(app);
app.use(cors());

_websocket.WebSocketControllerCreator.createController(server);

_request.RequestServiceCreator.createService(app);
/**
 * Client requests:
 * - Create a room and join it
 * - or join an existing room
 * 
 * Client Socket:
 * - 
 */