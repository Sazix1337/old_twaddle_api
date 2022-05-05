"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ws_1 = __importDefault(require("ws"));
var post_1 = __importDefault(require("./posts/post"));
var socket = new ws_1["default"]('ws://176.113.82.87:8765');
var xor = require('xor-crypt');
var TwaddlePoints = /** @class */ (function () {
    function TwaddlePoints() {
    }
    return TwaddlePoints;
}());
socket.on('open', function () {
    console.log('Twaddle WebSocket started.');
});
socket.on('message', function (data) {
    console.log("Data:", data.toString());
});
var randomKey = Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9);
global.commands = [];
global.botToken = [];
global.prefix = [];
var Twaddle = /** @class */ (function () {
    function Twaddle() {
        return {
            $login: Twaddle.$login
        };
    }
    Twaddle.$login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, $emitToken, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_1["default"].send_request('http://176.113.82.87/api/accounts.login', {
                            username: username,
                            password: password
                        })];
                    case 1:
                        response = _a.sent();
                        if (response["error"]) {
                            throw new Error("Error has occured! Error code: ".concat(response["error"], "."));
                        }
                        $emitToken = response.data;
                        token = response.data["token"];
                        socket.send(JSON.stringify($emitToken));
                        return [2 /*return*/, {
                                $token: token,
                                $_CreateCollection: function (options) {
                                    var commands = options["commands"];
                                    var prefix = options["prefix"];
                                    var token = options["botToken"];
                                    global.commands.push(commands);
                                    global.botToken.push(token);
                                    global.prefix.push(prefix);
                                    return {
                                        commands: commands,
                                        prefix: prefix,
                                        token: token
                                    };
                                },
                                $_SelectCommand: function (command) {
                                    var commands = global.commands[0];
                                    var cmd = global.prefix.join('') + commands.find(function (c) { return c === command; }).split(' ');
                                    if (cmd) {
                                        return cmd;
                                    }
                                    else {
                                        throw new TypeError("Command ".concat(command, " not identified. Please check your \"commands\" array in \"CreateCollection\" Object Data."));
                                    }
                                },
                                $_SendMessage: function (dialog_id, $tkn, $message) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var encrypt, msg;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    encrypt = function (message, key) {
                                                        var XOR = btoa(xor(message, key));
                                                        return XOR;
                                                    };
                                                    return [4 /*yield*/, post_1["default"].send_request('http://176.113.82.87/api/messages.send', {
                                                            token: $tkn,
                                                            encrypt_key: randomKey,
                                                            encrypted_text: encrypt($message, randomKey),
                                                            dialog_id: dialog_id,
                                                            attachments: []
                                                        })];
                                                case 1:
                                                    msg = _a.sent();
                                                    return [2 /*return*/, msg["data"]];
                                            }
                                        });
                                    });
                                }
                            }];
                }
            });
        });
    };
    return Twaddle;
}());
var clientPromise = Twaddle.$login('SaziX', '5d01d486');
var bot = function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, token, commands, ping;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, clientPromise];
            case 1:
                client = _a.sent();
                token = client.$token;
                client.$_CreateCollection({
                    botToken: token,
                    prefix: '$',
                    commands: [
                        'ping',
                        'pong'
                    ]
                });
                commands = {};
                ping = client.$_SelectCommand('ping');
                commands["".concat(ping)] = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client.$_SendMessage(8, client.$token, 'Pong')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                commands["".concat(ping)]();
                return [2 /*return*/];
        }
    });
}); };
bot();
exports["default"] = Twaddle;
