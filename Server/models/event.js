const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema({
    

    name:{
        type: String, 
        required: true
    },
     userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     },

    phone: {
        type: String,
        required: true
    },

    eventName:{
        type:String,
        required: true,
    },

    eventType:{
        type:String,
        required: true
    },
    eventCity :{
        type : String,
        required: true
    },
    hotelName :{
        type: String,
        required: true,
    },

    eventDate:{
        type:String,
        required: true
    },
    numberOfPeople:{
        type: String
    },

    eventStatus:{
        type : String,
        default: 'Waiting'
    },

    eventComplete : {
        type: String,
        default: 'Incomplete'
    },
     
    createdAt :{
        type : Date,
        default: Date.now()

    }



});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;



// aggrigation pipeline in mongodb/
