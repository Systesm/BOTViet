import mongo from "mongodb";
import { MongoClient } from "mongodb";

class UserManager{
    
    async ifOdd(findJson,collectionName){
        let db = await MongoClient.connect(MongoUrl)
        let collection = db.collection(collectionName)
        let find = await collection
        .find(findJson)
        .limit(1)
        .count()
        db.close()
        return (find == 1) ? true : false
    }

    async addUser(dataJson,collectionName){
        let db = await MongoClient.connect(MongoUrl)
        let collection = db.collection(collectionName)
        let insert = await collection.insertOne(dataJson);
        db.close();
        return insert.acknowledged
    }
}


export default UserManager;

