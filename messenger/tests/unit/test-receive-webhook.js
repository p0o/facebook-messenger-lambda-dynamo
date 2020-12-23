"use strict";
const sinon = require("sinon");
const chai = require("chai");
const app = require("../../app.js");
const service = require("../../service");
const expect = chai.expect;
let event, context;

// payload is taken from https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages
const mockMessagePayload = {
  sender: {
    id: "<PSID>",
  },
  recipient: {
    id: "<PAGE_ID>",
  },
  timestamp: 1458692752478,
  message: {
    mid: "mid.1457764197618:41d102a3e1ae206a38",
    text: "hello, world!",
    quick_reply: {
      payload: "<DEVELOPER_DEFINED_PAYLOAD>",
    },
  },
};

describe("Tests for receiveWebhookHandler", function () {
  let sendStandardMessageStub;

  beforeEach(function () {
    sendStandardMessageStub = sinon
      .stub(service, "sendStandardMessage")
      .returns(Promise.resolve());
  });

  afterEach(function () {
    sendStandardMessageStub.restore();
  });

  it("should return 404 if message is not coming from a page", async () => {
    let event = {
      body: JSON.stringify({
        object: "NOT page",
        entry: [
          {
            messaging: [
              {
                ...mockMessagePayload,
              },
            ],
          },
        ],
      }),
    };
    const result = await app.receiveWebhookHandler(event, context);
    expect(result.statusCode).to.be.equal(404);
  });

  it("should return 200 to all requests coming from the page", async () => {
    let event = {
      body: JSON.stringify({
        object: "page",
        entry: [
          {
            messaging: [
              {
                ...mockMessagePayload,
              },
            ],
          },
        ],
      }),
    };
    const result = await app.receiveWebhookHandler(event, context);
    expect(result.statusCode).to.be.equal(200);
    expect(sendStandardMessageStub.calledOnce).to.equal(true);
  });
});
