"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoomHandlerCreator = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RoomController = /*#__PURE__*/function () {
  function RoomController() {
    _classCallCheck(this, RoomController);

    this.rooms = {};
    this.characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  }

  _createClass(RoomController, [{
    key: "addRoom",
    value: function addRoom() {
      var roomCode = this.getRandomRoomCode();
      this.rooms[roomCode] = roomCode;
      return roomCode;
    }
  }, {
    key: "deleteRoom",
    value: function deleteRoom() {// TODO when do rooms get deleted?
    }
  }, {
    key: "getRoom",
    value: function getRoom(roomCode) {
      return this.rooms[roomCode];
    }
  }, {
    key: "addPlayerToRoom",
    value: function addPlayerToRoom(room, player) {
      this.rooms[room.roomCode].addPlayer(player);
    }
  }, {
    key: "getRandomRoomCode",
    value: function getRandomRoomCode() {
      var found = false;

      while (!found) {
        var number1 = Math.floor(Math.random() * this.characters.length);
        var number2 = Math.floor(Math.random() * this.characters.length);
        var number3 = Math.floor(Math.random() * this.characters.length);
        var number4 = Math.floor(Math.random() * this.characters.length);
        var code = this.characters[number1] + this.characters[number2] + this.characters[number3] + this.characters[number4];
        found = typeof this.rooms[code] === 'undefined';
      }

      return code;
    }
  }]);

  return RoomController;
}();

var RoomHandlerCreator = /*#__PURE__*/function () {
  function RoomHandlerCreator() {
    _classCallCheck(this, RoomHandlerCreator);

    if (!RoomHandlerCreator.instance) {
      RoomHandlerCreator.instance = new RoomController();
    }
  }

  _createClass(RoomHandlerCreator, [{
    key: "getInstance",
    value: function getInstance() {
      return RoomHandlerCreator.instance;
    }
  }]);

  return RoomHandlerCreator;
}();

exports.RoomHandlerCreator = RoomHandlerCreator;