"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var development_1 = __importDefault(require("./development"));
var production_1 = __importDefault(require("./production"));
var staging_1 = __importDefault(require("./staging"));
exports.NODE_ENV = process.env.NODE_ENV || 'development';
function getConfig() {
    switch (exports.NODE_ENV) {
        case 'production': {
            return production_1.default;
        }
        case 'staging': {
            return staging_1.default;
        }
        default: {
            return development_1.default;
        }
    }
}
var config = getConfig();
exports.default = config;
