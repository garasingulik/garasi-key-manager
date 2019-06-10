"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var sqlite_1 = __importDefault(require("./sqlite"));
// You can add implementation for database here
// tslint:disable-next-line: no-console
console.log("Using \"" + config_1.default.db.type + "\" as database backend ...");
function getDB() {
    switch (config_1.default.db.type.toLowerCase()) {
        case 'sqlite':
            return sqlite_1.default;
        default:
            return sqlite_1.default;
    }
}
var db = getDB();
exports.default = db;
