"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var home_1 = __importDefault(require("./home"));
var keys_1 = __importDefault(require("./keys"));
function register(app) {
    home_1.default.register(app);
    keys_1.default.register(app);
}
exports.default = {
    register: register
};
