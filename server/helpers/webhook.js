import { MessengerClient } from "messaging-api-messenger";
import {
  userfb,
  users as userManager,
  messages as MessagesModel,
  roles as RolesModel
} from "../models";
class Webhook {
  switchMethod(data, userId) {
    try {
      switch (data.method) {
        case "text":
          this.send2Fb.sendText(userId, data.text);
          break;
        case "button":
          this.send2Fb.sendButtonTemplate(userId, data.text, data.payload); //Editing...
          break;
        case "image":
          this.send2Fb.sendImage(userId, data.image);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
  methodSend(data, userId) {
    try {
      data.forEach(function(text) {
        this.switchMethod(text, userId);
      }, this);
    } catch (error) {
      console.log(error);
    }
  }
  async setToken(fanpageId) {
    try {
      let data = await userManager.findOne({ fanpageId }).exec();
      return (this.send2Fb = MessengerClient.connect(data.token));
    } catch (error) {
      console.log(error);
    }
  }
  async sendMessage(receivelowcase, userId, fanpageId, type = null) {
    try {
      if (receivelowcase === null) {
        let data = await MessagesModel.find({
          fanpageId,
          type
        }).exec();
        this.methodSend(data, userId);
      } else {
        let data = await MessagesModel.find({
          fanpageId,
          receivelowcase,
          type
        }).exec();
        this.methodSend(data, userId);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async addUser(fanpageId, userId) {
    try {
      let check = await userfb
        .findOne({
          userId
        })
        .count();
      if (check === 0) {
        let ProfileUser = await this.send2Fb.getUserProfile(userId);
        let Data = {
          firstName: ProfileUser.first_name,
          lastName: ProfileUser.last_name,
          avatar: ProfileUser.profile_pic,
          locale: ProfileUser.locale,
          gender: ProfileUser.gender,
          userId,
          fanpageId
        };
        let insert = await new userfb(Data).save();
        console.log("We have a new User!");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Webhook();
