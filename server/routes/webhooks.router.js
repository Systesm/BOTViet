import {MessengerClient} from 'messaging-api-messenger';
//Token Dynamic
const client = MessengerClient.connect('EAAQvnj85ZBqUBACwtiL4AZCZBKY97GnYDNnRJFainUTRc4kxJKjf7mAG3QOB9OPMMQpieVLZCOocp8zvU85uRuXe6Q9aiUXhydZCgT3lZCPK9KxTLMd05A3kQ8iPUOxcHrTYiQ5A5TT41ZCvlhKuFFZB838sf9eRyU1tch3vecuZArAN46Odk1EAi');
import express from 'express';
const router = express.Router();

import mongo from 'mongodb';
import {MongoClient} from 'mongodb';

let MongoUrl = "mongodb://localhost:27017/chatbot";

//Verify Webhook && Webhook response to Facebook
router.route('/')
.get((req, res) => {
	if (req.query['hub.verify_token'] === 'SEND_NUDE') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})
.post((req, res) => {
	let messaging_events = req.body.entry[0].messaging
	if(messaging_events) for (let i = 0; i < messaging_events.length; i++) {

		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (sender != '1863165543925150' && event.message && event.message.text) {
			const addUserToDb = async (sender) => {
				try {
					let db = await MongoClient.connect(MongoUrl);
					let collection = db.collection('usersfb');
					let userCount = (await collection.find({
							id: sender
						}).limit(1).count());
					if (userCount == 0) {
						let profileInfo = await client.getUserProfile(sender);
						await collection.insertOne(profileInfo)
					}
					db.close();
				} catch(err) {
					console.error(err);
				}
			}
			let text = event.message.text
			client.sendText(sender,`Đây là tin nhắn của bạn: ${text}`)
			addUserToDb(sender);
		}

		if (event.postback) { // Click button

			let text = JSON.stringify(event.postback)
			client.send(sender,{
				text: `Testing: ${text}`
			});
			continue

		}
	}

	res.sendStatus(200)
})

router.route('/dangtin')
.get((req,res) => {
	// let text = req.query.content;
	(async function() {
		let db = await MongoClient.connect(MongoUrl);
		let collection = db.collection('usersfb');
		let listUsers = (await collection.find({}).toArray());
		for (var i = 0; i < listUsers.length; i++) {
			client.sendButtonTemplate(listUsers[i].id, 'Bạn muốn làm gì tiếp theo?', [
				{
				type: 'web_url',
				url: 'https://petersapparel.parseapp.com',
				title: 'Truy cập Viettech',
				},
				{
				type: 'postback',
				title: 'Hãy chat với tôi',
				payload: 'USER_DEFINED_PAYLOAD',
				},
			]);
		}

		db.close();
	}());
	res.sendStatus(200)
})

export default router;