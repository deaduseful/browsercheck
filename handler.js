const check = require('./check.js');
// @see https://github.com/serverless/examples/tree/master/aws-node-serve-dynamic-html-via-http-endpoint
module.exports.landingPage = (event, context, callback) => {
  // @see https://serverless.com/framework/docs/providers/aws/events/apigateway/
  const html = check(event.requestContext.identity.userAgent);
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };

  // callback is sending HTML back
  callback(null, response);
};
