const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const hotelSchema = new Schema({

    name:{
        type:String,
        required: true,
    },

    location:{
        type:String,
        required: true
    },

    hotelCapacity:{
        type:String,
        required: true
    },
    hotelRating :{
        type: String ,
        required: true 
    },
    hotelCityName:{
        type:String,
        required : true
    },
    hotelCity:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }
});


const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;