"use strict";
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
var errorhandler_1 = __importDefault(require("errorhandler"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var bodyParser = __importStar(require("body-parser"));
var fs = __importStar(require("fs"));
var https = __importStar(require("https"));
var routes_1 = __importDefault(require("./routes"));
// server init
var port = process.env.PORT || 8000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express_1.default();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan_1.default('dev'));
// registering routes
routes_1.default.register(app);
// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
    app.use(errorhandler_1.default());
}
var httpsServer = https.createServer({
    key: fs.readFileSync('./dev.garasingulik.com-key.pem').toString(),
    cert: fs.readFileSync('./dev.garasingulik.com.pem').toString()
}, app);
httpsServer.listen(port, function () {
    console.log("App listening on port " + port + " (HTTPS)!");
});
