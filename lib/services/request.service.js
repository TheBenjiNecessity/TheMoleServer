"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestServiceCreator = void 0;

var _room = require("../controllers/room.controller");

var _player = require("../models/player.model");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PORT = process.env.PORT || 8999;

var RequestService = /*#__PURE__*/function () {
  function RequestService(app) {
    _classCallCheck(this, RequestService);

    app.post('/create', this.createRoom);
    app.put('/join/:roomcode', this.joinRoom);
    app.get('/room', this.getRoom);
    app.listen(process.env.PORT || 3001);
  }

  _createClass(RequestService, [{
    key: "createRoom",
    value: function createRoom(req, res) {
      // creates a websocket and returns a room code that can be used to interact with the websocket
      var roomHandler = new _room.RoomHandlerCreator().getInstance();
      var roomCode = roomHandler.addRoom();
      console.log('PORT', PORT);
      res.send({
        success: true,
        roomCode: roomCode,
        web_socket_url: "ws://localhost:".concat(PORT)
      });
    }
  }, {
    key: "joinRoom",
    value: function joinRoom(req, res) {
      var roomCode = req.params.roomCode;
      var player = req.body.player; // Check if roomcode given

      if (!roomCode) {
        res.status(422);
        res.send({
          success: false,
          errors: [{
            message: 'no_room_code_given'
          }]
        });
        return;
      }

      var playerObj = _player.PlayerCreator.createPlayer(player);

      if (!playerObj.success) {
        res.status(422);
        res.send({
          playerObj: playerObj
        });
        return;
      }

      var roomHandler = (0, _room.RoomHandlerCreator)().getInstance();
      var room = roomHandler.getRoom(roomCode); // Check if room exists

      if (!room) {
        res.status(404);
        res.send({
          success: false,
          errors: [{
            message: 'no_room_by_code'
          }]
        });
        return;
      } //Check if room is full


      if (room.isFull) {
        res.status(403);
        res.send({
          success: false,
          errors: [{
            message: 'room_is_full'
          }]
        });
        return;
      }

      if (room.isInProgress) {
        res.status(403);
        res.send({
          success: false,
          errors: [{
            message: 'room_is_in_progress'
          }]
        });
        return;
      }

      if (room.hasPlayer(playerObj.player)) {
        res.status(403);
        res.send({
          success: false,
          errors: [{
            message: 'room_already_has_player'
          }]
        });
        return;
      }

      roomHandler.addPlayerToRoom(room, playerObj.player);
      console.log("Player ".concat(playerObj.player.name, " has joined room ").concat(room.roomCode));
      res.send({
        success: true,
        web_socket_url: 'ws://localhost:' + PORT
      });
    }
  }, {
    key: "getRoom",
    value: function getRoom(req, res) {
      var roomCode = req.query.room; // Check if room exists

      if (!roomCode) {
        res.status(400);
        res.send({
          success: false,
          errors: [{
            message: 'no_room_code_given'
          }]
        });
        return;
      }

      var roomHandler = (0, _room.RoomHandlerCreator)().getInstance();
      var room = roomHandler.getRoom(roomCode); // Check if room exists

      if (!room) {
        res.status(404);
        res.send({
          success: false,
          errors: [{
            message: 'no_room_by_code'
          }]
        });
        return;
      } //TODO

    }
  }]);

  return RequestService;
}();

var RequestServiceCreator = /*#__PURE__*/function () {
  function RequestServiceCreator() {
    _classCallCheck(this, RequestServiceCreator);
  }

  _createClass(RequestServiceCreator, [{
    key: "getInstance",
    value: function getInstance() {
      return RequestServiceCreator.instance;
    }
  }], [{
    key: "createService",
    value: function createService(app) {
      if (!RequestServiceCreator.instance) {
        RequestServiceCreator.instance = new RequestService(app);
      }

      return RequestServiceCreator.instance;
    }
  }]);

  return RequestServiceCreator;
}();

exports.RequestServiceCreator = RequestServiceCreator;