"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3_1 = __importDefault(require("sqlite3"));
var config_1 = __importDefault(require("../../config"));
var keywrap_1 = __importDefault(require("../keywrap"));
var db = new sqlite3_1.default.Database(config_1.default.db.connectionString);
db.on('error', function (err) {
    // tslint:disable-next-line: no-console
    console.error('CANNOT OPEN DB');
    // tslint:disable-next-line: no-console
    console.error(err);
});
var createKey = function (key) {
    return new Promise(function (resolve, reject) {
        var params = {
            $kid: key.kid,
            // tslint:disable-next-line: object-literal-sort-keys
            $ek: key.ek,
            $kekId: key.kekId,
            $info: key.info,
            $contentId: key.contentId,
            $expiration: 0
        };
        if (key.expiration) {
            // tslint:disable-next-line: strict-type-predicates
            if (typeof key.expiration === 'string') {
                try {
                    var date = new Date(key.expiration).getTime() / 1000;
                    if (!isNaN(date)) {
                        params.$expiration = date;
                    }
                }
                catch (err) {
                    return reject(err);
                }
            }
        }
        // tslint:disable-next-line: max-line-length
        db.run('INSERT INTO Keys (kid, ek, kekId, info, contentId, expiration, lastUpdate) VALUES ($kid, $ek, $kekId, $info, $contentId, $expiration, strftime("%s", "now"))', params, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(key);
        });
    });
};
var getKeyCount = function () {
    return new Promise(function (resolve, reject) {
        db.get('SELECT COUNT(*) FROM Keys', function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result['COUNT(*)']);
        });
    });
};
var getKeys = function (kids, kek) {
    if (kids === void 0) { kids = []; }
    var rows = [];
    return new Promise(function (resolve, reject) {
        var localProgressCallback = function (err, result) {
            if (err) {
                return reject(err);
            }
            if (kids && kids.length > 1 && Array.isArray(result)) {
                // reorder the result to match the KID order
                var indexed = {};
                // tslint:disable-next-line: prefer-for-of
                for (var i = 0; i < result.length; i++) {
                    indexed[result[i].kid] = result[i];
                }
                var reordered = [];
                for (var i = 0; i < kids.length; i++) {
                    reordered[i] = indexed[kids[i]];
                }
                result = reordered;
            }
            if (!Array.isArray(result)) {
                if (kek) {
                    var unwrapped = keywrap_1.default.unwrapKey(result.ek, kek);
                    if (unwrapped) {
                        result.k = unwrapped.toString('hex');
                    }
                }
                rows.push(result);
            }
            if (kids && Array.isArray(result)) {
                return resolve(result);
            }
        };
        var localCompletionCallback = function (err, result) {
            // tslint:disable-next-line: no-console
            console.log("Rows: " + result + " row(s)");
            if (err) {
                return reject(err);
            }
            return resolve(rows);
        };
        if (kids.length > 0) {
            db.all('SELECT * FROM Keys WHERE ' + kidPlaceholders(kids.length), kids, localProgressCallback);
        }
        else {
            // get all keys
            db.each('SELECT * FROM Keys', localProgressCallback, localCompletionCallback);
        }
    });
};
var putKey = function (kid, key) {
    return new Promise(function (resolve, reject) {
        var sql = [];
        var params = [];
        if (key.ek) {
            sql.push('ek = ?');
            params.push(key.ek);
        }
        if (key.kekId !== '') {
            sql.push(' kekId = ?');
            params.push(key.kekId);
        }
        if (key.info !== '') {
            sql.push(' info = ?');
            params.push(key.info);
        }
        if (key.contentId !== '') {
            sql.push(' contentId = ?');
            params.push(key.contentId);
        }
        if (sql.length === 0) {
            // tslint:disable-next-line: no-console
            console.log('nothing to update');
            return reject(new Error('Invalid Parameters'));
        }
        params.push(kid);
        db.run('UPDATE Keys SET ' + sql.join(',') + ' WHERE kid = ?', params, function (err, result) {
            if (err) {
                return reject(err);
            }
            else {
                if (result.changes === 0) {
                    return reject(new Error('Not Found'));
                }
            }
            return resolve(key);
        });
    });
};
var deleteKeys = function (kids) {
    return new Promise(function (resolve, reject) {
        db.run('DELETE FROM Keys WHERE ' + kidPlaceholders(kids.length), kids, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
};
var kidPlaceholders = function (kidCount) {
    var placeholders = [];
    for (var i = 0; i < kidCount; i++) {
        placeholders[i] = 'kid = ?';
    }
    return placeholders.join(' OR ');
};
exports.default = {
    createKey: createKey,
    deleteKeys: deleteKeys,
    getKeyCount: getKeyCount,
    getKeys: getKeys,
    putKey: putKey
};
