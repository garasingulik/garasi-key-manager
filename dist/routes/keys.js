"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = __importDefault(require("../lib/db"));
var helper_1 = __importDefault(require("../lib/helper"));
var keywrap_1 = __importDefault(require("../lib/keywrap"));
var validator_1 = __importDefault(require("../lib/validator"));
var U = __importStar(require("../lib/utilities"));
function register(app) {
    var _this = this;
    app.get('/keys', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var kek, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!validator_1.default.checkParameters(req.query)) {
                        res.status(400).send({ message: 'Invalid Parameters' });
                        return [2 /*return*/];
                    }
                    kek = req.query.kek;
                    return [4 /*yield*/, U.wrapPromise(db_1.default.getKeys([], kek))];
                case 1:
                    keys = _a.sent();
                    if (U.isError(keys)) {
                        // tslint:disable-next-line: no-console
                        console.log(keys);
                        res.status(500).json(keys);
                        return [2 /*return*/];
                    }
                    res.status(200).json(keys);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/keys/count', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, U.wrapPromise(db_1.default.getKeyCount())];
                case 1:
                    result = _a.sent();
                    if (U.isError(result)) {
                        res.status(500).send({ message: 'Internal Server Error' });
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, res.status(200).json(result)];
            }
        });
    }); });
    app.get('/keys/:keyIds', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var kids, kidSelector, i, kid, kek, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    kids = req.params.keyIds;
                    kidSelector = kids.split(',');
                    if (!kids || !kidSelector) {
                        res.status(400).send({ message: 'Bad Request' });
                        return [2 /*return*/];
                    }
                    for (i = 0; i < kidSelector.length; i++) {
                        kid = helper_1.default.kidFromString(kidSelector[i]);
                        if (!validator_1.default.checkKid(kid)) {
                            res.status(400).send({ message: 'Invalid KID' });
                            return [2 /*return*/];
                        }
                        kidSelector[i] = kid;
                    }
                    if (!kidSelector) {
                        res.status(400).send({ message: 'Invalid KID' });
                        return [2 /*return*/];
                    }
                    kek = req.query.kek;
                    return [4 /*yield*/, U.wrapPromise(db_1.default.getKeys(kidSelector, kek))];
                case 1:
                    keys = _a.sent();
                    if (U.isError(keys)) {
                        // tslint:disable-next-line: no-console
                        console.log(keys);
                        res.status(500).json(keys);
                        return [2 /*return*/];
                    }
                    if (keys && keys.length > 0) {
                        if (kek) {
                            keys.forEach(function (k) {
                                var unwrapped = keywrap_1.default.unwrapKey(k.ek, kek);
                                if (unwrapped) {
                                    k.k = unwrapped.toString('hex');
                                }
                                else {
                                    res.status(400).send({ message: 'Incorrect KEK' });
                                    return;
                                }
                                delete k.ek;
                                delete k.kekId;
                            });
                        }
                        res.status(200).json(keys.length === 1 ? keys[0] : keys);
                    }
                    else {
                        res.status(404).send({ message: 'Not Found' });
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    app.post('/keys', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var key, kek, newKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!validator_1.default.checkParameters(req.query)) {
                        res.status(400).json({ message: 'Invalid Parameters' });
                        return [2 /*return*/];
                    }
                    try {
                        key = JSON.parse(req.body);
                        if (!validator_1.default.checkKey(key)) {
                            res.status(400).send({ message: 'Invalid Key Object' });
                            return [2 /*return*/];
                        }
                    }
                    catch (err) {
                        res.status(400).send({ message: 'Invalid JSON Body' });
                        return [2 /*return*/];
                    }
                    kek = req.query.kek;
                    if (!kek) {
                        // no kek was passed, check that an encrypted key was supplied
                        if (!key.ek) {
                            res.status(400).send({ message: 'No KEK passed: ek required' });
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, U.wrapPromise(helper_1.default.createNewKey(kek, key))];
                case 1:
                    newKey = _a.sent();
                    if (U.isError(newKey)) {
                        res.status(400).send({ message: 'Bad Request' });
                        return [2 /*return*/];
                    }
                    res.status(200).json(newKey);
                    return [2 /*return*/];
            }
        });
    }); });
    app.put('/keys/:keyId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var key, kid, kek, ek, keyDetail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!validator_1.default.checkParameters(req.query)) {
                        res.status(400).json({ message: 'Invalid Parameters' });
                        return [2 /*return*/];
                    }
                    try {
                        key = JSON.parse(req.body);
                        if (!validator_1.default.checkKey(key)) {
                            res.status(400).send({ message: 'Invalid Key Object' });
                            return [2 /*return*/];
                        }
                    }
                    catch (err) {
                        res.status(400).send({ message: 'Invalid JSON Body' });
                        return [2 /*return*/];
                    }
                    kid = req.params.keyId;
                    if (!validator_1.default.checkKid(kid) || !validator_1.default.checkKey(key)) {
                        res.status(400).send({ message: 'Invalid Parameters' });
                        return [2 /*return*/];
                    }
                    kek = req.query.kek;
                    if (key.k && !key.ek) {
                        if (!kek) {
                            res.status(400).send({ message: 'KEK Required' });
                            return [2 /*return*/];
                        }
                        ek = keywrap_1.default.wrapKey(key.k, kek);
                        if (!ek) {
                            res.status(500).send({ message: 'Internal Server Error' });
                            return [2 /*return*/];
                        }
                        key.ek = ek.toString('hex');
                    }
                    return [4 /*yield*/, U.wrapPromise(db_1.default.putKey(kid, key))];
                case 1:
                    keyDetail = _a.sent();
                    if (U.isError(keyDetail)) {
                        if (keyDetail.message === 'Not Found') {
                            res.status(404).send(keyDetail.message);
                        }
                        else {
                            res.status(500).send({ message: 'Internal Server Error' });
                        }
                    }
                    res.status(200).json(keyDetail);
                    return [2 /*return*/];
            }
        });
    }); });
    app.delete('/keys/:keyIds', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var kids, kidSelector, i, kid, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    kids = req.params.keyIds;
                    kidSelector = kids.split(',');
                    if (!kids || !kidSelector) {
                        res.status(400).send({ message: 'Bad Request' });
                        return [2 /*return*/];
                    }
                    for (i = 0; i < kidSelector.length; i++) {
                        kid = helper_1.default.kidFromString(kidSelector[i]);
                        if (!validator_1.default.checkKid(kid)) {
                            res.status(400).send({ message: 'Invalid KID' });
                            return [2 /*return*/];
                        }
                        kidSelector[i] = kid;
                    }
                    if (!kidSelector) {
                        res.status(400).send({ message: 'Invalid KID' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, U.wrapPromise(db_1.default.deleteKeys(kids))];
                case 1:
                    result = _a.sent();
                    if (result) {
                        res.status(500).send({ message: 'Internal Server Error' });
                        return [2 /*return*/];
                    }
                    res.status(200).json(result);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.register = register;
exports.default = {
    register: register
};
