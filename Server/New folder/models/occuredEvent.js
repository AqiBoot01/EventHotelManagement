const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const occuredEventSchema = new Schema({

    name:{
        type: String,
        required: true
    },
    eventHotel:{
        type : String,
        required: true

    },
    eventCity:{
        type: String,
        required:true

    },
    eventImage: {
        type : String 
      },

    createdAt :{
        type : Date,
        default: Date.now()

    }

})


const OCCUREDEVENT = mongoose.model('OCCUREDEVENT' , occuredEventSchema)
module.exports = OCCUREDEVENT;
