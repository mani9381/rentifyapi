const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    place:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    bedroomsCount:{
        type:Number,
        required:true
    },
    bathroomsCount:{
        type:Number,
        required:true
    },
    nearHospital:{
        type:String,
        required:true
    },
    nearCollege:{
        type:String,
        required:true
    },
    ownerId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    likes:{
        type:Number,
        required:true
    }
})

let postModel = mongoose.model('properties',schema)

module.exports = {
    postModel
}