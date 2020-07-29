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
var documentClient = new aws_sdk_1.default.DynamoDB.DocumentClient({ service: ddb });
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
        /*********************Get Fotos***********************/
        this.app.get('/fotos', function (req, res) {
            var imagenes = [];
            var params = {
                TableName: "estudiante",
            };
            var obj = documentClient.scan(params, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                else {
                    var Items = data.Items;
                    console.log("items");
                    var arr = Items;
                    console.log(Items);
                    var json = {
                        Items: Items
                    };
                    return res.json(json);
                }
            });
        });
        //**********************CARGA GRUPO Y ASISTENCIA*****************************/
        this.app.post('/grupoasist', function (req, res) {
            var body = req.body;
            var nombre = body.nombre;
            var name = body.name;
            var base64String = body.base64;
            var extension = body.extension;
            var date = new Date();
            var str = date.getDate() + '_' + (date.getMonth() + 1) + '_' + date.getFullYear() + '_' + date.getHours() + '_' + date.getMinutes();
            //Decodificar imagen
            var encodedImage = base64String;
            var decodedImage = Buffer.from(encodedImage, 'base64');
            var filename = name + "_" + str + "." + extension;
            //Parámetros para S3
            var bucketname = 'bucketfotos-201503608-sufis';
            var folder = 'grupo/';
            var filepath = "" + folder + filename;
            var uploadParamsS3 = {
                Bucket: bucketname,
                Key: filepath,
                Body: decodedImage,
                ACL: 'public-read',
            };
            s3.upload(uploadParamsS3, function sync(err, data) {
                if (err) {
                    console.log('Error uploading file:', err);
                    res.send({ 'message': 'failed' });
                }
                else {
                    console.log('Upload success at:', data.Location);
                    ddb.putItem({
                        TableName: "grupo",
                        Item: {
                            "Imagen": { S: data.Location },
                            "nombre": { S: nombre }
                        }
                    }, function (err, data) {
                        if (err) {
                            console.log('Error saving data:', err);
                            res.send({ 'message': false });
                        }
                        else {
                            console.log('Save success:', data);
                            res.send({ 'message': true });
                        }
                    });
                }
            });
            // aqui empiza la parte de la comparacion de rostros por rekognition
        });
        //***************************CARGAR FOTOS NUEVAS*****************************/
        this.app.post('/registro', function (req, res) {
            var body = req.body;
            var nombre = body.nombre;
            var name = body.name;
            var base64String = body.base64;
            var extension = body.extension;
            var date = new Date();
            var str = date.getDate() + '_' + (date.getMonth() + 1) + '_' + date.getFullYear() + '_' + date.getHours() + '_' + date.getMinutes();
            //Decodificar imagen
            var encodedImage = base64String;
            var decodedImage = Buffer.from(encodedImage, 'base64');
            var filename = name + "_" + str + "." + extension;
            //Parámetros para S3
            var bucketname = 'bucketfotos-201503608-sufis';
            var folder = 'estudiante/';
            var filepath = "" + folder + filename;
            var uploadParamsS3 = {
                Bucket: bucketname,
                Key: filepath,
                Body: decodedImage,
                ACL: 'public-read',
            };
            s3.upload(uploadParamsS3, function sync(err, data) {
                if (err) {
                    console.log('Error uploading file:', err);
                    res.send({ 'message': 'failed' });
                }
                else {
                    console.log('Upload success at:', data.Location);
                    ddb.putItem({
                        TableName: "estudiante",
                        Item: {
                            "Imagen": { S: data.Location },
                            "nombre": { S: nombre }
                        }
                    }, function (err, data) {
                        if (err) {
                            console.log('Error saving data:', err);
                            res.send({ 'message': false });
                        }
                        else {
                            console.log('Save success:', data);
                            res.send({ 'message': true });
                        }
                    });
                }
            });
        });
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
