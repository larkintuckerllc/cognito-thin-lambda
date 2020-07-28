const AWS = require('aws-sdk');
const { v4 } = require('uuid');

AWS.config.update({region: 'us-east-1'});
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
    const { sub } = event.requestContext.authorizer.claims;
    const id = v4();
    const params = {
        Item: {
            Sub: {
                S: sub,
            }, 
            Id: {
                S: id,
            },
        }, 
        TableName: "Example",
    };
    try {
        const data = await dynamodb.putItem(params).promise();
    } catch (err) {
        console.log(err);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

