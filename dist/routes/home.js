"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var register = function (app) {
    app.get('/', function (req, res) {
        var data = {
            status: 'Server is running ...',
            time: new Date()
        };
        res.status(200).json(data);
    });
};
exports.default = {
    register: register
};
