const { MongoClient } = require('mongodb')


let dbConnection
let url = "mongodb+srv://necros240:452006Ian@directed-clusters.nycvtr8.mongodb.net/?retryWrites=true&w=majority&appName=Directed-Clusters"

module.exports = {
    connectToDb:(cb)=>{
        MongoClient.connect(url)
        .then((client)=>{
            dbConnection = client.db()
            return cb()
        })
        .catch(err =>{
            console.log(err)
            return cb(err)
        })
    },
    getDb:()=>dbConnection
}