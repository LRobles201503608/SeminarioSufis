"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var indexRoutes_1 = __importDefault(require("./Routes/indexRoutes"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var aws_keys = require('./awsKeys');
var s3 = new aws_sdk_1.default.S3(aws_keys.s3);
var ddb = new aws_sdk_1.default.DynamoDB(aws_keys.dynamodb);
var rekognition = new aws_sdk_1.default.Rekognition(aws_keys.rekognition);
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    Server.prototype.config = function () {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
    };
    Server.prototype.routes = function () {
        this.app.use('/', indexRoutes_1.default);
    };
    Server.prototype.start = function () {
        var _this = this;
        this.app.listen(this.app.get('port'), function () {
            console.log("server on port ", _this.app.get('port'));
        });
    };
    return Server;
}());
var server = new Server();
server.start();
