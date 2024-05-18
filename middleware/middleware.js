const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    let token = req.body.token;
    if(!token){
        return res.status(401).json({message:"Unauthrized access..."})
    }
    let data = jwt.decode(token,"SeCreaTElkf2938jfhgfkdbj8")
    req.user = data.user
    next()
}