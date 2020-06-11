const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const keys = require('../config/keys')
const redisUrl = keys.redisUrl
const client = redis.createClient(redisUrl)
client.hget = util.promisify(client.hget);

// client.flushall()
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}){
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
};

mongoose.Query.prototype.exec = async function(){
    // console.log("I'M ABOUT TO RUN THE QUERY")
     if(!this.useCache){
         return exec.apply(this,arguments);
     }
    // to safetly copy one object properties to another
    const key =  JSON.stringify(
        Object.assign({},this.getQuery(),{
        collection:this.mongooseCollection.name
        }))

    // see if we have the value fo 'key in redis
    const cacheValue = await client.hget(this.hashKey,key)


    // If we do retun that 
    if (cacheValue){
        console.log("From cache")
        // console.log(cacheValue)
        // Since the value stored in the redis server can be array of object also hence we need to convert each object into the model instance
        const doc = JSON.parse(cacheValue)
        //hydrating values
        return Array.isArray(doc) ?    
                    doc.map(d => new this.model(d))   
                    :  new this.model(doc)
             
    }


    //Otherwise, issue the query and store the result


    const result = await exec.apply(this,arguments)
    // console.log(result)
    client.hset(this.hashKey,key,JSON.stringify(result))
    console.log("For MOngodb")

    return result
}


module.exports = {
    clearHash(hashKey){
        client.del(JSON.stringify(hashKey))
    }
}