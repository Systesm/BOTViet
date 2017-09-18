import util from "util";
import { EventEmitter } from "events";
import request from "request";
import { Webhook as WebhookHelper, Charters } from "../helpers";

class FBBotFramework {
  constructor(options, cb) {
    if (!options) {
      const error = new Error(
        "Page Access Token missing. See FB documentation for details: https://developers.facebook.com/docs/messenger-platform/quickstart"
      );

      if (typeof cb === "function") {
        return cb(error);
      }

      throw error;
    }

    this.verify_token = options.verify_token;
    this.commands = [];

    if (cb) cb(null);

    //Normal
    this.on("message", async (userId, message, fanpageId) => {
      try {
        let receivelowcase = Charters.findVietChart(message);
        await WebhookHelper.setToken(fanpageId);
        await WebhookHelper.sendMessage(receivelowcase, userId, fanpageId);
        await WebhookHelper.addUser(fanpageId, userId);
      } catch (error) {
        console.log(error);
      }
    });

    //Khi click vao 'Send to messenger'
    this.on("sendtomessenger", async (userId, fanpageId) => {
      try {
        await WebhookHelper.setToken(fanpageId);
        await WebhookHelper.sendMessage(null, userId, fanpageId, "getstarted");
        await WebhookHelper.addUser(fanpageId, userId);
      } catch (error) {
        console.log(error);
      }
    });

    //Khi click vao button
    this.on("postback", async (userId, payload, fanpageId) => {
      try {
        await WebhookHelper.setToken(fanpageId);
        await WebhookHelper.sendMessage(payload, userId, fanpageId, "postback");
      } catch (error) {
        console.log(error);
      }
    });

    // Setup listener for quick reply messages
    this.on("quickreply", async (userId, payload) => {});
  }

  verify(req, res) {
    if (req.query["hub.verify_token"] === this.verify_token) {
      res.send(req.query["hub.challenge"]);
    } else {
      res.status(500).send("Error, wrong validation token");
    }
  }

  // Middleware
  middleware() {
    const bot = this;
    return (req, res) => {
      if (req.method === "GET") {
        return bot.verify(req, res);
      }

      if (req.method === "POST") {
        // Read data from the request
        req.setEncoding("utf8");

        // Always return HTTP200 to Facebook's POST Request
        res.send({});

        const messagingEvent = req.body.entry[0].messaging;
        if (messagingEvent)
          messagingEvent.forEach(event => {
            // Extract senderID, i.e. recipient
            const sender = event.sender.id;
            const fanpageId = event.recipient.id;

            // Trigger onEcho Listener
            if (event.message && event.message.is_echo) {
              return bot.emit("echo", event.recipient.id, event.message.text);
            }

            // Trigger 'Send to Messenger'
            if (event.optin && event.optin.ref) {
              return bot.emit("sendtomessenger", sender, fanpageId); //Or GET STARTED BUTTON
            }

            // Trigger quickyReply Listener
            if (event.message && event.message.quick_reply) {
              return bot.emit(
                "quickreply",
                sender,
                event.message.quick_reply.payload,
                fanpageId
              );
            }

            // Trigger onMessage Listener
            if (event.message && event.message.text) {
              return bot.emit("message", sender, event.message.text, fanpageId);
            }

            // Trigger onPostback Listener
            if (event.postback && event.postback.payload) {
              return bot.emit(
                "postback",
                sender,
                event.postback.payload,
                fanpageId
              );
            }

            // Trigger onAttachment Listener
            if (event.message && event.message.attachments) {
              return bot.emit(
                "attachment",
                sender,
                event.message.attachments,
                fanpageId
              );
            }
          });
      }
    };
  }
}
util.inherits(FBBotFramework, EventEmitter);

export default FBBotFramework;
