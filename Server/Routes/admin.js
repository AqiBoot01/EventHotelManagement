const express = require('express');
const router = express.Router();
const Event = require('../models/event.js') ;
const User = require('../models/user.js')
const OccuredEvent = require('../models/occuredEvent.js');
const City = require('../models/city.js');
const Hotel = require('../models/hotel.js');
const multer = require('multer')







// request to return all event from to admin
// get
router.get('/allevents', async (req, res)=>{
    try {
        const allEvents = await Event.find().sort({createdAt : -1});
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const Events ={}
        if(endIndex < allEvents.length){
          Events.next= {
            page:page+1 
          }
        }
        if(startIndex > 0){
          Events.prev ={
            page: page-1
          }
        } 

        Events.totalEvents = allEvents.length;
        Events.pageCount = Math.ceil(allEvents.length/limit); 

        Events.events = allEvents.slice(startIndex , endIndex)

        return res.json({message: 'Getting data ' , Events});
        
    } catch (error) {
      console.log(error)
        
    }
  })



  // request to return all user from to admin
// get
router.get('/allUsers', async (req, res)=>{
    try {
        const nofilteredusers = await User.find();
        const users = nofilteredusers.filter(user => user.role !== 'admin')
        return res.json({message: 'Getting data ' , users});
        
    } catch (error) {
      console.log(error)
        
    }
  })


  // request to update the status of user  from the admin
// put 
router.put('/updateUserStatus/:id' , async(req, res)=>{
  // console.log(req.body);
    try {

        const user = await User.findByIdAndUpdate(req.params.id , {
          isActive : req.body.status
        })
        // console.log(user)
        if(user){
          return res.json({message: ' User Status updated' , success: true} )
        }
        else{
          return res.json({message: 'failed' , success: false})
        }
       
    } catch (error) {
     console.log(error)
    }
  })
  



  // File handling uploads using multer and admin can upload the image

// defining multer storage for event images 

var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
  // destination is used to specify the path of the directory in which the files have to be stored
    cb(null, './uploads/eventImages');    
  }, 
  filename: function (req, file, cb) { 
  // It is the filename that is given to the saved file.
     const uniqueSuffix = Date.now()
     cb(null , uniqueSuffix + file.originalname);   
  }
  });
  
  // Configure storage engine instead of dest object.
  const upload = multer({ storage: storage })
  
  
  
  // request form admin to add new event 
  // post request
  
  router.post('/addEvent' , upload.single('image'),  async (req, res)=>{
    try {
      // console.log(req.file.filename);
      // console.log(req.body)
      try {
        const {name, eventHotel , eventCity} = req.body
        // console.log(name, eventHotel , eventCity)
        await OccuredEvent.create({name , eventHotel , eventCity , eventImage:req.file.filename});
        res.json({message:'Form Submitted' , success : true})
        
      } catch (error) {
        console.log(error)
      }
     
    } catch (error) {
      console.log(error)
      
    }
  })
  



  // request to register new hotel from hotel booking form 
// post 

router.post('/registerHotel',  async (req, res)=>{
    try {
      const city = await City.findOne({cityname: req.body.hotelCity})
      const cityId = city._id;
      const hotel = {name: req.body.name , location: req.body.location, hotelCapacity : req.body.hotelCapacity , hotelRating: req.body.hotelRating , hotelCityName: req.body.hotelCity , hotelCity: cityId }
      try {
        await Hotel.create(hotel);
      } catch (error) {
        console.log(error)
      }
      
      // const hotel = await Hotel.create({req.body.name , req.body.location , req.body})
      res.json({message:'Form submitted', success: true})
  
    } catch (error) {
      console.log(error)
    }
    
  })



  // request from the admin to accept an event 
// put 
router.put('/acceptEvent/:id' , async (req, res)=>{
    try {
       console.log(req.params.id)
       console.log(req.body.status)
       const updatedEvent = await Event.findByIdAndUpdate(req.params.id, {
        eventStatus : req.body.status 
       })
        
       return res.json({success: true})
      
    } catch (error) {
      return res.json({success: false})
      
    }
  })


    // request from the admin to complete an event 
// put 
router.put('/completeEvent/:id' , async (req, res)=>{
  try {
     console.log(req.params.id)
     console.log(req.body.status)
     const updatedEvent = await Event.findByIdAndUpdate(req.params.id, {
      eventComplete : req.body.status 
     })

     console.log(updatedEvent);
      
     return res.json({success: true})
    
  } catch (error) {
    return res.json({success: false})
    
  }
})

  

  // request from the admin to reject an event 
// put
router.put('/rejectEvent/:id' , async (req, res)=>{
    try {
       console.log(req.params.id)
       console.log(req.body.status)
       const updatedEvent = await Event.findByIdAndUpdate(req.params.id, {
        eventStatus : req.body.status 
       })
        
      return res.json({success: true})
      
    } catch (error) {
      return res.json({success: false})
      
    }
  })
  
  
  



  module.exports = router;