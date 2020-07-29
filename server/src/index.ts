import express,{Application} from 'express';
import indexRoutes from './Routes/indexRoutes';
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import morgan from 'morgan';
import cors from 'cors';
import AWS, {AWSError} from 'aws-sdk';
import SendData = ManagedUpload.SendData;

const aws_keys = require('./awsKeys');
const s3 = new AWS.S3(aws_keys.s3);
const ddb = new AWS.DynamoDB(aws_keys.dynamodb);
const rekognition = new AWS.Rekognition(aws_keys.rekognition);
const documentClient = new AWS.DynamoDB.DocumentClient({ service: ddb });

class Server{
    public app:Application;
    constructor(){
        this.app=express();
        this.config();
        this.routes();
        
    }
    config():void{
        this.app.set('port',process.env.PORT||3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json({ limit: '50mb'}));
        this.app.use(express.urlencoded({extended:true,limit: '50mb'}));
    }
    routes():void{
        this.app.use('/',indexRoutes);
/*********************Get Fotos***********************/
    this.app.get('/fotos',(req,res)=>{
        var imagenes=[];
        const params = {
            TableName: "estudiante",
        };
        const obj=documentClient.scan(params, function(err, data){
            if (err) {
                console.log(err);
                res.send({
                  success: false,
                  message: 'Error: Server error'
                });
              }
            else{
                const { Items } = data;
                console.log("items")
                const arr = Items;
                console.log(Items);
                var json={
                    Items:Items
                }
                return res.json(json);
            }
        });
    });

//**********************CARGA GRUPO Y ASISTENCIA*****************************/
    this.app.post('/grupoasist',(req,res)=>{
        let body = req.body;

        let nombre = body.nombre
        let name = body.name;
        let base64String = body.base64;
        let extension = body.extension;

        let date = new Date();
        let str = date.getDate()+'_'+(date.getMonth()+1)+'_'+date.getFullYear()+'_'+date.getHours()+'_'+date.getMinutes()

        //Decodificar imagen
        let encodedImage = base64String;
        let decodedImage = Buffer.from(encodedImage, 'base64');
        let filename = `${name}_${str}.${extension}`;

        //Parámetros para S3
        let bucketname = 'bucketfotos-201503608-sufis';
        let folder = 'grupo/';
        let filepath = `${folder}${filename}`;
        var uploadParamsS3 = {
            Bucket: bucketname,
            Key: filepath,
            Body: decodedImage,
            ACL: 'public-read',
        };
        s3.upload(uploadParamsS3, function sync(err : Error, data :SendData) {
            if (err) {
                console.log('Error uploading file:', err);
                res.send({ 'message': 'failed' })
            } else {
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
                    } else {
                        console.log('Save success:', data);
                        res.send({ 'message': true });
                    }
                });
            } 
        });

    // aqui empiza la parte de la comparacion de rostros por rekognition
    const similarity = 65;//porcentaje de similitud
    const usuario = body.usuario;
    
    const params = {
        TableName: "grupo"
    };
    
    const params2 = {
        TableName: "estudiante"
    };
    try{
        festudiantes(params2);
    }catch(ex){
        return {
            error: true,
            message: "Error al obtener las informacion del usuario",
        };
    }
    });
async function festudiantes(params:any){
            var datos  = [];
            const obj = await documentClient.scan(params).promise();
            const arr2 = obj['Items'];
            console.log(arr2);
}    
//***************************CARGAR FOTOS NUEVAS*****************************/
    this.app.post('/registro', (req, res) => {
        let body = req.body;

        let nombre = body.nombre
        let name = body.name;
        let base64String = body.base64;
        let extension = body.extension;

        let date = new Date();
        let str = date.getDate()+'_'+(date.getMonth()+1)+'_'+date.getFullYear()+'_'+date.getHours()+'_'+date.getMinutes()

        //Decodificar imagen
        let encodedImage = base64String;
        let decodedImage = Buffer.from(encodedImage, 'base64');
        let filename = `${name}_${str}.${extension}`;

        //Parámetros para S3
        let bucketname = 'bucketfotos-201503608-sufis';
        let folder = 'estudiante/';
        let filepath = `${folder}${filename}`;
        var uploadParamsS3 = {
            Bucket: bucketname,
            Key: filepath,
            Body: decodedImage,
            ACL: 'public-read',
        };

        s3.upload(uploadParamsS3, function sync(err : Error, data :SendData) {
            if (err) {
                console.log('Error uploading file:', err);
                res.send({ 'message': 'failed' })
            } else {
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
                    } else {
                        console.log('Save success:', data);
                        res.send({ 'message': true });
                    }
                });
            }
        });
    });

}
    start():void{
        this.app.listen(this.app.get('port'),()=>{
            console.log("server on port ",this.app.get('port'));
        });
    }
}

const server=new Server();
server.start();