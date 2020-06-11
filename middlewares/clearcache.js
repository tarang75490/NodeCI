const { clearHash} = require('../services/cache')


module.exports = async (req,res,next) =>{
    await next();
    // to make the route handler to run first




    clearHash(req.user.id)
}