const mongo = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

let MongoUrl = "mongodb://localhost:27017/chatbot";
let sender = '029934858';
if(sender){
    (async function(){
        try {
            let db = await MongoClient.connect(MongoUrl);
            let collection = db.collection('usersfb');
            let userCount = (await collection.find({
                    id: sender
                }).limit(1).count());
            if (userCount == 0) {
                await collection.insertOne({id:sender})
            }
            let listData = await collection.find({}).toArray();
            console.log(listData)
            db.close();
        } catch(err) {
            console.error(err);
        }
    }());
}
