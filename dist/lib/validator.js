"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isHex = function (str) {
    for (var c in str.split('')) {
        if (!((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F'))) {
            return false;
        }
    }
    return true;
};
var checkKey = function (key) {
    if (key.kid) {
        if (key.kid.indexOf('^') !== 0) {
            if (!isHex(key.kid))
                return false;
        }
    }
    if (key.k) {
        if (!isHex(key.k))
            return false;
    }
    if (key.ek) {
        if (!isHex(key.ek))
            return false;
    }
    return true;
};
var checkKid = function (kid) {
    if (!isHex(kid) || kid.length !== 32) {
        return false;
    }
    return true;
};
var checkParameters = function (params) {
    if (params.kek) {
        if (params.kek.length !== 32) {
            return false;
        }
    }
    return true;
};
exports.default = {
    checkKey: checkKey,
    checkKid: checkKid,
    checkParameters: checkParameters,
    isHex: isHex
};
