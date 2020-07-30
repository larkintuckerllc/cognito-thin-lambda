const AWS = require('aws-sdk');
const { v4 } = require('uuid');

AWS.config.update({region: 'us-east-1'});
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
    const { sub } = event.requestContext.authorizer.claims;
    const groups = event.requestContext.authorizer.claims['cognito:groups'];
    if (groups === undefined) {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            statusCode: 500,
            body: JSON.stringify('Unexpected Error'),
        };
    }
    const id = v4();
    const params = {
        Item: {
            Group: {
                S: groups[0], // USE FIRST GROUP
            }, 
            Id: {
                S: id,
            },
            Sub: {
                S: sub,
            },
        }, 
        TableName: "Example",
    };
    try {
        await dynamodb.putItem(params).promise();
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            statusCode: 200,
            body: JSON.stringify('Success'),
        };
    } catch (err) {
        console.log(err);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            statusCode: 500,
            body: JSON.stringify('Unexpected Error'),
        };
    }
};
