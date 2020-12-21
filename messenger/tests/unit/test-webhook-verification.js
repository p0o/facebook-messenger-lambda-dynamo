"use strict";

const app = require("../../app.js");
const chai = require("chai");
const expect = chai.expect;
let event, context;

const { MESSENGER_VERIFY_TOKEN } = process.env;

const p = "placeholder value";
const wrongVerifyToken = "xxx";
const challenge = "Server Sent Challenge";

describe("Tests for webhookVerificationHandler", function () {
  it("should return 403 error if verifyToken doesn't match", async () => {
    let event = {
      queryStringParameters: {
        "hub.mode": p,
        "hub.verify_token": wrongVerifyToken,
        "hub.challenge": challenge,
      },
    };
    const result = await app.webhookVerificationHandler(event, context);
    expect(result.statusCode).to.be.equal(403);
  });

  it("should return 403 error if mode is not subscribe", async () => {
    let event = {
      queryStringParameters: {
        "hub.mode": "NOT subscribe",
        "hub.verify_token": MESSENGER_VERIFY_TOKEN,
        "hub.challenge": challenge,
      },
    };
    const result = await app.webhookVerificationHandler(event, context);
    expect(result.statusCode).to.be.equal(403);
  });

  it("should return the challenge with 200 if all correct", async () => {
    let event = {
      queryStringParameters: {
        "hub.mode": "subscribe",
        "hub.verify_token": MESSENGER_VERIFY_TOKEN,
        "hub.challenge": challenge,
      },
    };
    const result = await app.webhookVerificationHandler(event, context);
    expect(result.statusCode).to.equal(200);

    const response = result.body;
    expect(response).to.be.an("string");
    expect(response).to.be.equal(challenge);
  });
});
