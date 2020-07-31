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
var datos:any  = [];
var id:number=0;

class Server{

    public app:Application;
    constructor(){
        this.app=express();
        this.config();
        this.routes();
        
    }
    config():void{
        this.app.set('port',process.env.PORT||4100);
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
/*********************Get Asist***********************/
this.app.get('/gasist',(req,res)=>{
    var imagenes=[];
    const params = {
        TableName: "asistencia",
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

/*********************Get Fotos***********************/
this.app.get('/fotos2',(req,res)=>{
    var imagenes=[];
    const params = {
        TableName: "grupo",
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
    
    });
    this.app.get('/grupoasist2',(req,res)=>{
        try{
            const params = {
                TableName: "grupo"
            };
            
            const params2 = {
                TableName: "estudiante"
            };
            festudiantes(params2,params);
        }catch(e){
            console.log("error",e);
        }
        var a={
            mensaje:"ingreso correcto"
        };
        return res.json(a);
    });
 async function festudiantes(params:any,params2:any){
     try{
        const params2 = {
            TableName: "grupo"
        };
        
        const params = {
            TableName: "estudiante"
        };
        const obj = await documentClient.scan(params).promise();
        const arr2 = obj['Items'];
        const obj2= await documentClient.scan(params2).promise();
        const arr1 = obj2['Items'];
        reconocimiento(arr2,arr1);
     }catch(e){
        console.log("error",e);
     }
           
}
async function reconocimiento(arreglo1:any,arreglo2:any){
    console.log("inicio de reconocimiento");
    console.log("arreglo 1",arreglo1);
    console.log("arreglo 2",arreglo2);
    
    for(let i in arreglo1){
        for (let j in arreglo2){
                await new Promise(next=>{
                    const direc = arreglo1[i].Imagen
                    
                    var espacios = direc.split('/')
                    //console.log(espacios);
                    const foto_comparar = espacios[3]+"/"+espacios[4]
                    const direc2 = arreglo2[j].Imagen;
                    const nombre = arreglo2[j].nombre;
                    console.log(foto_comparar);
                    var espacios2 = direc2.split('/')
                    const foto_comparar2 = espacios2[3]+"/"+espacios2[4]
                    console.log(foto_comparar2);
                    const datosrekognition = {
                        SimilarityThreshold: 65,
                         SourceImage: {//captura o foto
                             S3Object: {
                                 Bucket: "bucketfotos-201503608-sufis",
                                 Name: foto_comparar2
                                         }
                                     },
                         TargetImage: {//foto perfil
                             S3Object: {
                                 Bucket: "bucketfotos-201503608-sufis",
                                 Name: foto_comparar
                                         }
                                     }
                         };
                         debugger;
                         rekognition.compareFaces(datosrekognition, function(err:any, data:any) {
                            if (err) {
                                console.log("Rekognition error ",err);
                            }
                            else {
                                if(Object.keys(data['FaceMatches']).length === 0){
                                    console.log("no coinciden"); 
                                    const parametro={
                                        TableName: "asistencia",
                                        Item: {
                                            "Asistencia": "no",
                                            "Imagen":  direc,
                                            "nombre": nombre,
                                            "id":id
                                        }
                                    }
                                    id++;
                                    documentClient.put(parametro,function(err,data){
                                        if (err) {
                                            console.log('error', err);
                                        } else {
                                            console.log('data', data);
                                        }
                                    });   
                                }
                                else{
                                const valor = data['FaceMatches'][0].Similarity
                                    if(valor >= 65){
                                        datos.push({ 
                                            "Imagen": direc,
                                        });
                                        console.log("Reconocida");
                                        const parametro={
                                            TableName: "asistencia",
                                            Item: {
                                                "Asistencia": "si",
                                                "Imagen":  direc,
                                                "nombre": nombre,
                                                "id":id
                                            }
                                        }
                                        id++;
                                        documentClient.put(parametro,function(err,data){
                                            if (err) {
                                                console.log('error', err);
                                              } else {
                                                console.log('data', data);
                                              }
                                        });
                                               
                                    }else{
                                        console.log("No Reconocida");
                                                    
                                    }
                                }
                            }
                         
                        });
                        next();
                });
        }
    }
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