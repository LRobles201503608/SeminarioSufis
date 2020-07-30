import AWS, {AWSError} from 'aws-sdk';

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

/**
 * direccion del serverless https://6mhvx2kh5h.execute-api.us-east-1.amazonaws.com/dev/take/asist
 **/
exports.handler= async (event, context, callback) => {

};