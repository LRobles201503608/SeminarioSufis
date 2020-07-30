'use strict';
const AWS = require("aws-sdk");
var datos  = [];
var id=0;

let aws_keys = {
    s3: {
        region: 'us-east-1',
        accessKeyId: "AKIAW2Q4DOGD4D3355MX",
        secretAccessKey: "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",
        //apiVersion: '2006-03-01',
    },
    dynamodb: {
        //apiVersion: '2012-08-10',
        region: 'us-east-1',
        accessKeyId: "AKIAW2Q4DOGD4D3355MX",
        secretAccessKey: "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"
    },
    rekognition: {
        region: 'us-east-1',
        accessKeyId: "AKIAW2Q4DOGD4D3355MX",
        secretAccessKey: "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"
    }
}

const s3 = new AWS.S3(aws_keys.s3);
const ddb = new AWS.DynamoDB(aws_keys.dynamodb);
const rekognition = new AWS.Rekognition(aws_keys.rekognition);
const documentClient = new AWS.DynamoDB.DocumentClient({ service: ddb });


module.exports.hello = async event => {
    const params = {
        TableName: "grupo"
    };
    
    const params2 = {
        TableName: "estudiante"
    };
        festudiantes(params2,params);
        return {
            datos:datos,
            mensaje:JSON.stringify("Listo")
            }
};

async function festudiantes(params,params2){
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
async function reconocimiento(arreglo1,arreglo2){
    console.log("inicio de reconocimiento");
    console.log("arreglo 1",arreglo1);
    console.log("arreglo 2",arreglo2);
    
    for(let i in arreglo1){
        for (let j in arreglo2){
                await new Promise(next=>{
                    const direc = arreglo1[i].Imagen
                    const iden = arreglo1[j].nombre; 
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
                         rekognition.compareFaces(datosrekognition, function(err, data) {
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
