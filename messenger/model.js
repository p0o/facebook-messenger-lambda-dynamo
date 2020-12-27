const dynamoose = require("dynamoose");

const schema = new dynamoose.Schema(
  {
    messageId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
    saveUnknown: true,
  }
);

exports.Message = dynamoose.model("MessagesTable", schema);
