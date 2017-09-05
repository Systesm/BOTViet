import mongo from "mongodb";
import { MongoClient } from "mongodb";

const MongoUrl = "mongodb://localhost:27017/chatbot";

export const getInfo = async (iduser, collectionDb) => {
    try {
        let db = await MongoClient.connect(MongoUrl);
        let collection = db.collection(collectionDb);
        let userCount = await collection
        .find({
            id: iduser
        })
        .limit(1)
        .count();
        if (userCount == 0) {
            let profileInfo = await client.getUserProfile(iduser);
            await collection.insertOne(profileInfo);
        }
        db.close();
    } catch (err) {
        console.error(err);
    }
}

