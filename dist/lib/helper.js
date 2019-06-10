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
var crypto_1 = __importDefault(require("crypto"));
var db_1 = __importDefault(require("./db"));
var keywrap_1 = __importDefault(require("./keywrap"));
var U = __importStar(require("./utilities"));
var KEKID_CONSTANT_1 = 'KEKID_1';
function computeKekId(kek) {
    var hash = crypto_1.default.createHash('sha1');
    hash.update(KEKID_CONSTANT_1, 'ascii');
    hash.update(kek, 'ascii');
    return '#1.' + hash.digest('hex').substring(0, 32);
}
function kidFromString(kid) {
    if (kid.indexOf('^') === 0) {
        // derive the KID using a hash
        var hash = crypto_1.default.createHash('sha1');
        hash.update(kid.slice(1), 'ascii');
        kid = hash.digest('hex').substring(0, 32);
    }
    return kid;
}
function randomize(key) {
    return new Promise(function (resolve, reject) {
        crypto_1.default.randomBytes(32, function (err, random) {
            if (err) {
                return reject(err);
            }
            if (!key.kid) {
                key.kid = random.slice(0, 16).toString('hex');
            }
            if (!key.ek && !key.k) {
                key.k = random.slice(16, 32).toString('hex');
            }
            return resolve(key);
        });
    });
}
function createNewKey(kek, key) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var theKey, random, newKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    theKey = key;
                    if (!(!key.kid || (!key.ek && !key.k))) return [3 /*break*/, 2];
                    return [4 /*yield*/, U.wrapPromise(randomize(key))];
                case 1:
                    random = _a.sent();
                    if (U.isError(random)) {
                        return [2 /*return*/, reject(random)];
                    }
                    theKey = random;
                    _a.label = 2;
                case 2: return [4 /*yield*/, U.wrapPromise(storeNewKey(kek, theKey))];
                case 3:
                    newKey = _a.sent();
                    if (U.isError(newKey)) {
                        return [2 /*return*/, reject(newKey)];
                    }
                    return [2 /*return*/, resolve(newKey)];
            }
        });
    }); });
}
function storeNewKey(kek, key) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var ek, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key.kid = kidFromString(key.kid);
                    if (!key.ek) {
                        ek = keywrap_1.default.wrapKey(key.k, kek);
                        if (!ek) {
                            return [2 /*return*/, reject(new Error('Invalid Key Format'))];
                        }
                        key.ek = ek.toString('hex');
                    }
                    if (key.kekId === '') {
                        if (kek) {
                            // compute the KEK ID from the kek itself
                            key.kekId = computeKekId(kek);
                        }
                        else {
                            // no KEK ID
                            key.kekId = '';
                        }
                    }
                    return [4 /*yield*/, U.wrapPromise(db_1.default.createKey(key))];
                case 1:
                    result = _a.sent();
                    if (U.isError(result)) {
                        return [2 /*return*/, reject(result)];
                    }
                    return [2 /*return*/, resolve(key)];
            }
        });
    }); });
}
exports.default = {
    createNewKey: createNewKey,
    kidFromString: kidFromString
};
