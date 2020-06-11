// Using query builder
const query = Person
  .find({ occupation: /host/ })
  .where('name.last').equals('Ghost')
  .where('age').gt(17).lt(66)
  .where('likes').in(['vaporizing', 'talking'])
  .limit(10)
  .sort('-occupation')
  .select('name occupation');

query.findOptions();
// {find : {occupation:"host"},where:[{'name.last':"Ghost"},]}



  //CHECH TO SEE IF THIS QUERY HAS ALREDY BEEN FETCHED IN REDIS
// overwritting the the mongoose origonl exec function to work in our own way
query.exec = function(){
    // to check to see if thids query has been already been executed]
    // and if it has return the query result right away
    const result = client.get('query key')
    if(result){
        return result
    }


    //otherwise issue the query *as normal*
    const result = runTheOrriginalExecFunction();


    //then save the value in redis
    client.set('query key',result);

    return result;
}

query.exec((err,result)=> { console.log(result) })
// same as .. 
query.then((result)=> {console.log(result)})
// same as ..
const result = await query
