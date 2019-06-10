"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrapPromise(promise) {
    return new Promise(function (resolve) {
        promise.then(function (result) {
            return resolve(result);
        }).catch(function (err) {
            return resolve(err);
        });
    });
}
exports.wrapPromise = wrapPromise;
function isError(arg) {
    return arg instanceof Error;
}
exports.isError = isError;
