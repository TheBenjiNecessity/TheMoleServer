"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoomHandlerCreator = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RoomHandler = /*#__PURE__*/function () {
  function RoomHandler() {
    _classCallCheck(this, RoomHandler);

    this.rooms = {};
    this.characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  }

  _createClass(RoomHandler, [{
    key: "addRoom",
    value: function addRoom() {
      var roomCode = getRandomRoomCode();
      rooms[roomCode] = roomCode;
      return roomCode;
    }
  }, {
    key: "getRandomRoomCode",
    value: function getRandomRoomCode() {
      var found = false;

      while (!found) {
        var number1 = Math.floor(Math.random() * characters.length);
        var number2 = Math.floor(Math.random() * characters.length);
        var number3 = Math.floor(Math.random() * characters.length);
        var number4 = Math.floor(Math.random() * characters.length);
        var code = characters[number1] + characters[number2] + characters[number3] + characters[number4];
        console.log('rooms', rooms);
        found = typeof rooms[code] === 'undefined';
      }

      return code;
    }
  }]);

  return RoomHandler;
}();

var RoomHandlerCreator = /*#__PURE__*/function () {
  function RoomHandlerCreator() {
    _classCallCheck(this, RoomHandlerCreator);

    if (!RoomHandlerCreator.instance) {
      RoomHandlerCreator.instance = new RoomHandler();
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