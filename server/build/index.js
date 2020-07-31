"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var datos = [];
var id = 0;
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    Server.prototype.config = function () {
        this.app.set('port', process.env.PORT || 4100);
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
        /*********************Get Asist***********************/
        this.app.get('/gasist', function (req, res) {
            var imagenes = [];
            var params = {
                TableName: "asistencia",
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
        /*********************Get Fotos***********************/
        this.app.get('/fotos2', function (req, res) {
            var imagenes = [];
            var params = {
                TableName: "grupo",
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
        this.app.get('/grupoasist2', function (req, res) {
            try {
                var params = {
                    TableName: "grupo"
                };
                var params2 = {
                    TableName: "estudiante"
                };
                festudiantes(params2, params);
            }
            catch (e) {
                console.log("error", e);
            }
            var a = {
                mensaje: "ingreso correcto"
            };
            return res.json(a);
        });
        function festudiantes(params, params2) {
            return __awaiter(this, void 0, void 0, function () {
                var params2_1, params_1, obj, arr2, obj2, arr1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            params2_1 = {
                                TableName: "grupo"
                            };
                            params_1 = {
                                TableName: "estudiante"
                            };
                            return [4 /*yield*/, documentClient.scan(params_1).promise()];
                        case 1:
                            obj = _a.sent();
                            arr2 = obj['Items'];
                            return [4 /*yield*/, documentClient.scan(params2_1).promise()];
                        case 2:
                            obj2 = _a.sent();
                            arr1 = obj2['Items'];
                            reconocimiento(arr2, arr1);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.log("error", e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        function reconocimiento(arreglo1, arreglo2) {
            return __awaiter(this, void 0, void 0, function () {
                var _loop_1, _a, _b, _i, i;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            console.log("inicio de reconocimiento");
                            console.log("arreglo 1", arreglo1);
                            console.log("arreglo 2", arreglo2);
                            _loop_1 = function (i) {
                                var _loop_2, _a, _b, _i, j;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _loop_2 = function (j) {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, new Promise(function (next) {
                                                                var direc = arreglo1[i].Imagen;
                                                                var espacios = direc.split('/');
                                                                //console.log(espacios);
                                                                var foto_comparar = espacios[3] + "/" + espacios[4];
                                                                var direc2 = arreglo2[j].Imagen;
                                                                var nombre = arreglo2[j].nombre;
                                                                console.log(foto_comparar);
                                                                var espacios2 = direc2.split('/');
                                                                var foto_comparar2 = espacios2[3] + "/" + espacios2[4];
                                                                console.log(foto_comparar2);
                                                                var datosrekognition = {
                                                                    SimilarityThreshold: 65,
                                                                    SourceImage: {
                                                                        S3Object: {
                                                                            Bucket: "bucketfotos-201503608-sufis",
                                                                            Name: foto_comparar2
                                                                        }
                                                                    },
                                                                    TargetImage: {
                                                                        S3Object: {
                                                                            Bucket: "bucketfotos-201503608-sufis",
                                                                            Name: foto_comparar
                                                                        }
                                                                    }
                                                                };
                                                                debugger;
                                                                rekognition.compareFaces(datosrekognition, function (err, data) {
                                                                    if (err) {
                                                                        console.log("Rekognition error ", err);
                                                                    }
                                                                    else {
                                                                        if (Object.keys(data['FaceMatches']).length === 0) {
                                                                            console.log("no coinciden");
                                                                            var parametro = {
                                                                                TableName: "asistencia",
                                                                                Item: {
                                                                                    "Asistencia": "no",
                                                                                    "Imagen": direc,
                                                                                    "nombre": nombre,
                                                                                    "id": id
                                                                                }
                                                                            };
                                                                            id++;
                                                                            documentClient.put(parametro, function (err, data) {
                                                                                if (err) {
                                                                                    console.log('error', err);
                                                                                }
                                                                                else {
                                                                                    console.log('data', data);
                                                                                }
                                                                            });
                                                                        }
                                                                        else {
                                                                            var valor = data['FaceMatches'][0].Similarity;
                                                                            if (valor >= 65) {
                                                                                datos.push({
                                                                                    "Imagen": direc,
                                                                                });
                                                                                console.log("Reconocida");
                                                                                var parametro = {
                                                                                    TableName: "asistencia",
                                                                                    Item: {
                                                                                        "Asistencia": "si",
                                                                                        "Imagen": direc,
                                                                                        "nombre": nombre,
                                                                                        "id": id
                                                                                    }
                                                                                };
                                                                                id++;
                                                                                documentClient.put(parametro, function (err, data) {
                                                                                    if (err) {
                                                                                        console.log('error', err);
                                                                                    }
                                                                                    else {
                                                                                        console.log('data', data);
                                                                                    }
                                                                                });
                                                                            }
                                                                            else {
                                                                                console.log("No Reconocida");
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                                next();
                                                            })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _a = [];
                                            for (_b in arreglo2)
                                                _a.push(_b);
                                            _i = 0;
                                            _c.label = 1;
                                        case 1:
                                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                                            j = _a[_i];
                                            return [5 /*yield**/, _loop_2(j)];
                                        case 2:
                                            _c.sent();
                                            _c.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            };
                            _a = [];
                            for (_b in arreglo1)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            i = _a[_i];
                            return [5 /*yield**/, _loop_1(i)];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
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
