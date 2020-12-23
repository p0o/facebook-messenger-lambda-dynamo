
const { sendStandardMessage } = require("./service");
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
exports.receiveWebhookHandler = async (event, context, cb) => {
  let response;
  const { body: bodyInJson } = event;

  if (!bodyInJson || typeof bodyInJson !== "string") {
    return;
  }

  let body;

  try {
    body = JSON.parse(bodyInJson);
  } catch (e) {
    console.error("body is not valid JSON", e);
    return e;
  }

  // Checks this is an event from a page subscription
  if (body && body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    await Promise.all(
      body.entry.map(async function (entry) {
        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
        const webhookEvent = entry.messaging[0];
        console.log("[Lambda] Message received", webhookEvent);

        if (webhookEvent.sender) {
          // Reply back to the sender to confirm if the message is received
          await sendStandardMessage(
            "Thank you! I just received your message ✌🏼",
            webhookEvent.sender.id
          );
        }
      })
    );

    response = {
      statusCode: 200,
      body: "EVENT_RECEIVED",
    };
  } else {
    response = {
      statusCode: 404,
    };
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
exports.webhookVerificationHandler = async (event, context, cb) => {
  let response;
  const { queryStringParameters: params } = event;

  if (!params || !params['hub.mode']) {
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
