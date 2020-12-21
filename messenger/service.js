const axios = require("axios");
const { ACCESS_TOKEN } = process.env;
const sendEndpoint = `https://graph.facebook.com/v9.0/me/messages?access_token=${ACCESS_TOKEN}`;

exports.sendStandardMessage = async (
  text,
  recipientId,
  messagingType = "RESPONSE"
) => {
  try {
    await axios.post(
      sendEndpoint,
      JSON.stringify({
        messaging_type: messagingType,
        recipient: {
          id: recipientId,
        },
        message: {
          text,
        },
      })
    );
  } catch (e) {
    console.error("Message is failed to be sent as a response", e);
    // TODO: might need to retry or report the incident
  }
};
