"use strict";

var _requestHandler = require("./request-handler");

var _webSocketHandler = require("./web-socket-handler");

var express = require('express');

var http = require('http');

var cors = require('cors');

var app = express();
var server = http.createServer(app);
app.use(cors());
var wsController = new _webSocketHandler.WebSocketController(server);
var rController = new _requestHandler.RequestController(app);
app.listen(process.env.PORT || 3001);