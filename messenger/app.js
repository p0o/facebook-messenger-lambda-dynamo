

const { MESSENGER_VERIFY_TOKEN } = process.env;
/**
 * Receive webhook from Facebook Messenger
 * 
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.receiveWebhookHandler = async (event, context) => {
  let response;
  try {
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
          success: true,
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }

  return response
};

/**
 * Verify webhook from Facebook Messenger
 * 
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.webhookVerificationHandler = (event, context) => {
  let response;
  const { queryStringParameters: params } = event;

  if (!params) {
    response = {
      statusCode: 400,
    };
    return response;
  }

  // Parse the query params
  const mode = params["hub.mode"];
  const token = params["hub.verify_token"];
  const challenge = params["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === MESSENGER_VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      response = {
        statusCode: 200,
        body: challenge,
      };
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      response = {
        statusCode: 403,
      };
    }
  }

  return response;
};
