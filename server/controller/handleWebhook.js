import { MessengerClient } from "messaging-api-messenger";
import util from "util";
import { EventEmitter } from "events";
import request from "request";
import UserFbModel from "../models/userfb";
import MessagesModel from "../models/messages";
import Helpers from "../helpers"

//Token Dynamic - Len Mongodb se doi
const client = MessengerClient.connect(
  "EAAQvnj85ZBqUBAAlFoWpC4EE3YRqaYEInDKtMwgK2Edl4oWDEPVaC20F1PWVTRZCzwyjUWablReuuGYuxKZCEwWDSpGfyXyxuSyrZCfzbA8SEAyQPAjCBdTKF6SvZCgM25jUIZBoVpFeerE4quZAJcIkj0WKLljuRtwwCepdffBdAZDZD"
);
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

    const getstarted = [
      {
        content: "Chào mừng bạn đã trò chuyện cùng tôi :D",
      },
      {
        content: "Bạn cần tôi giúp gì không?"
      }
    ]
    
    //Normal
    this.on("message", function(userId, message, fanpageId) {
      (async () => {
        try {
          let convertVi = Helpers.findVietChart(message)
          console.log(convertVi)
          let theText = await MessagesModel.find({
            pageId: fanpageId,
            message: message
          }).exec();
          if (theText.length === 0) {
            client.sendRawBody({
              recipient: {
                id: userId,
              },
              message: {
                attachment:{
                  type: "template",
                  payload:{
                    template_type:"button",
                    text: "Câu lệnh chưa thiết lập",
                    buttons:[
                      {
                        type: 'postback',
                        title: 'Tìm hiểu BOTViet',
                        payload: 'WHAT_IS_BOTVIET',
                      }
                    ]
                  }
                }
              }
            })
          } else {
            theText.forEach(function(text) {
              client.sendText(userId, text.content);
            }, this);
          }

          let check = await UserFbModel.findOne({
            userId: userId
          }).count();
          if (check === 0) {
            let ProfileUser = await client.getUserProfile(userId);
            let Data = {
              firstName: ProfileUser.first_name,
              lastName: ProfileUser.last_name,
              avatar: ProfileUser.profile_pic,
              locale: ProfileUser.locale,
              gender: ProfileUser.gender,
              userId: userId,
              fanpageId: fanpageId
            };
            let insert = await new UserFbModel(Data).save();
            console.log("We have a new User!");
          }
        } catch (error) {
          console.log(error);
        }
      })();
    });

    //Khi click vao 'Send to messenger'
    this.on("sendtomessenger", function(userId,fanpageId) {
      
      (async () => {
        try {
          await client.sendRawBody({
            recipient: {
              id: userId,
            },
            message: {
              attachment:{
                type: "template",
                payload:{
                  template_type:"button",
                  text: "Chào bạn, bạn có thể click button dưới đây để sử dụng BOT",
                  buttons:[
                    {
                      type: 'postback',
                      title: 'BOTViet là gì?',
                      payload: 'WHAT_IS_BOTVIET',
                    }
                  ]
                }
              }
            }
          })

          let check = await UserFbModel.findOne({
            userId: userId
          }).count();
          if (check === 0) {
            let ProfileUser = await client.getUserProfile(userId);
            let Data = {
              firstName: ProfileUser.first_name,
              lastName: ProfileUser.last_name,
              avatar: ProfileUser.profile_pic,
              locale: ProfileUser.locale,
              gender: ProfileUser.gender,
              userId: userId,
              fanpageId: fanpageId
            };
            let insert = await new UserFbModel(Data).save();
            console.log("We have a new User!");
          }
        } catch (error) {
          console.log(error);
        }
      })();
    });

    //Khi click vao button
    this.on("postback", function(userId, payload) {
      // Send quick replies
      console.log("Userid: " + userId);
      console.log(payload);
      let postpack = [
        {
          payload: "WHAT_IS_BOTVIET",
          message: {
            text: "BOTViet được thành lập vào năm 2017, bởi Viettech Solutions, lý do BOTViet được sinh ra là để giúp các doanh nghiệp quản lý khách hàng dể hơn."
          }
        },
        {
          payload: "WHAT_IS_BOTVIET",
          message: {
            attachment:{
              type: "template",
              payload:{
                template_type:"button",
                text: "Ví dụ: Khi doanh nghiệp của bạn đang bận hợp, không ai quản lý Fanpage. Thì lúc đó BOTViet sẽ 'chat' với khách hàng giúp cho bạn.",
                buttons:[
                  {
                    type: 'postback',
                    title: 'Tại sao sử dụng BOTViet?',
                    payload: '5454',
                  }
                ]
              }
            }
          }
        },
        {
          payload: "5454",
          message: {
            text: "BOTViet sẽ làm giúp những công việc của bạn, và mau sớm đạt được thành công theo ý nguyện của bạn."
          }
        }
      ];
      let thepayload = payload

      postpack.forEach(function(payload) {

        if(payload.payload == thepayload){
          client.sendRawBody({
              recipient: {
                id: userId
              },
              message: payload.message
          })
        }

      }, this);

    });

    // Setup listener for quick reply messages
    this.on("quickreply", function(userId, payload) {
      // Send quick replies
      console.log("Userid: " + userId);
      console.log(payload);
      client.sendText(userId, "Hi there");
      (async () => {
        try {
          let check = await userManager.ifOdd({ id: userId }, "usersfb");
          if (check === false) {
            let ProfileUser = await client.getUserProfile(userId);
            await userManager.addUser(ProfileUser, "usersfb");
          }
        } catch (error) {
          console.log("Error: " + error);
        }
      })();
    });
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
