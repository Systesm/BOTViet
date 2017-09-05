import { MessengerClient } from "messaging-api-messenger";
import express from "express";
import userController from "../controller/users.js";
import BotFrameWork from "fb-bot-framework";

const router = express.Router();
//Token Dynamic
const client = MessengerClient.connect(
  "EAAQvnj85ZBqUBAJWbPvxZAPjet0yAn20DT6ZB5XV7gLEa5rtZABLfyzNpQZCR3LF0P72jUYgy6ubYSnIFzaZBJ8rdIrQ69ycyHnGnDPgWnRvu65VRQUWFqKZCdra5irs8vvPWtplccmhxaB3eA8b3fVEBKOOADlMxG6omI9iZCxmSZBxmP6SfiUfa"
);
const bot = new BotFrameWork({
  verify_token: "SEND_NUDE"
});

router.use("/", bot.middleware());

//Normal
bot.on("message", function(userId, message) {
  // Send quick replies
  console.log("Userid: " + userId);
  console.log("Your message: " + message);
  client.sendText(userId, "Hi there");
});

//Khi click vao button
bot.on("postback", function(userId, payload) {
  // Send quick replies
  console.log("Userid: " + userId);
  console.log(payload);
  client.sendText(userId, "Hi there");
});

// Setup listener for quick reply messages
bot.on("quickreply", function(userId, payload) {
  // Send quick replies
  console.log("Userid: " + userId);
  console.log(payload);
  client.sendText(userId, "Hi there");
});

router.route("/dangtin").get((req, res) => {
  // let text = req.query.content;
  (async function() {
    let db = await MongoClient.connect(MongoUrl);
    let collection = db.collection("usersfb");
    let listUsers = await collection.find({}).toArray();
    for (var i = 0; i < listUsers.length; i++) {
      client.sendButtonTemplate(listUsers[i].id, "Bạn muốn làm gì tiếp theo?", [
        {
          type: "web_url",
          url: "https://petersapparel.parseapp.com",
          title: "Truy cập Viettech"
        },
        {
          type: "postback",
          title: "Hãy chat với tôi",
          payload: "USER_DEFINED_PAYLOAD"
        }
      ]);
    }

    db.close();
  })();
  res.sendStatus(200);
});

export default router;
