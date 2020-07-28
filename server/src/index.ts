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
    }
    start():void{
        this.app.listen(this.app.get('port'),()=>{
            console.log("server on port ",this.app.get('port'));
        });
    }
}

const server=new Server();
server.start();