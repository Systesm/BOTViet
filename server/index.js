'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const { MessengerClient } = require('messaging-api-messenger');

// get accessToken from facebook developers website
const client = MessengerClient.connect('EAAQvnj85ZBqUBACEwaGESxHaN1auZBAjZCLm0RDZCv2wXtQa1R5ZCuYIcD5zDp81fu7CDZBZCITyygNu4JXTaZARUu80e5ayETHp4sLbOXx8noVSmEHiSZAnWKed1HZBpLAu38W6gHbnJXlTuZCAKZCWt3WpJwTJUGJbLp9HPGjcg6QUtgZDZD');

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'SEND_NUDE') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	if(messaging_events) for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (sender != '1863165543925150' && event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			// sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
			client.sendText(sender,'Hi there')
			client.sendListTemplate(
				sender,
				[
					{
					  "title": "Classic T-Shirt Collection",
					  "subtitle": "See all our colors",
					  "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",          
					  "buttons": [
						{
						  "title": "View",
						  "type": "web_url",
						  "url": "https://peterssendreceiveapp.ngrok.io/collection",
						  "messenger_extensions": true,
						  "webview_height_ratio": "tall",
						  "fallback_url": "https://peterssendreceiveapp.ngrok.io/"            
						}
					  ]
					},
					{
					  "title": "Classic White T-Shirt",
					  "subtitle": "See all our colors",
					  "default_action": {
						"type": "web_url",
						"url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
						"messenger_extensions": true,
						"webview_height_ratio": "tall",
						"fallback_url": "https://peterssendreceiveapp.ngrok.io/"
					  }
					},
					{
					  "title": "Classic Blue T-Shirt",
					  "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
					  "subtitle": "100% Cotton, 200% Comfortable",
					  "default_action": {
						"type": "web_url",
						"url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
						"messenger_extensions": true,
						"webview_height_ratio": "tall",
						"fallback_url": "https://peterssendreceiveapp.ngrok.io/"
					  },
					  "buttons": [
						{
						  "title": "Shop Now",
						  "type": "web_url",
						  "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
						  "messenger_extensions": true,
						  "webview_height_ratio": "tall",
						  "fallback_url": "https://peterssendreceiveapp.ngrok.io/"            
						}
					  ]        
					}
				],
				[
					{
					  type: 'postback',
					  title: 'Start Chatting',
					  payload: 'USER_DEFINED_PAYLOAD',
					},
				],
				{ top_element_style: 'large' }
			  );
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			// sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			client.send(sender,{
				text: "Testing: " + text
			});
			continue
		}
	}
	res.sendStatus(200)
})

app.get('*', function(req, res){
	res.end('All');
})

// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
const token = "EAAQvnj85ZBqUBACZClF31l0NrocaxR0cwJ2KFxqc7GKMTZAekEeFF6lyopM92EDAw1cl9LnFoKmFqdhXZAxOtbJh6qN245CqxUOyAFENJoiMvnpxOyofiwV32YUSnTzh1V5fcXEU7PVdxTuvgZCarQynybGeO0rU1PavzNy89XgkVJEOrTwZAE"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
