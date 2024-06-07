const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Event = require("../models/event");
const City = require("../models/city");
const Hotel = require("../models/hotel");
const OccuredEvent = require("../models/occuredEvent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer')


// request to handle signUp from
// post

router.post("/signup", async (req, res) => {
  try {
    // console.log(req.body)
    const { firstname, lastname, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
       return res
        .status(201)
        .json({ message: "User Created Successfully", success: true });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "User Already Exits", success: false });
      }
       return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  } catch (error) {
    console.log(error);
  }
});

// request to handle login from
// post
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Invalid Credentials", success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({ message: "Invalid Credentails", seccess: false });
    }

    if (user.isActive === "Disactive") {
      return res
        .status(200)
        .json({ message: "Account is Deavtivted by Admin", seccess: false });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    return res.json({
      message: "you provided right details",
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

// request to handle event registration form user
// post

router.post("/registerEvent", async (req, res) => {
  try {
    const {
      name,
      phone,
      eventName,
      eventType,
      eventCity,
      hotelName,
      eventDate,
      numberOfPeople,
    } = req.body;
    try {
      const user = await User.findOne({ firstname: name });
      const event = await Event.create({
        name,
        userId: user._id,
        phone,
        eventName,
        eventType,
        eventCity,
        hotelName,
        eventDate,
        numberOfPeople,
      });
      return res.json({ message: "Successful" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

// request to return a single user event for user
// get

router.get("/user/:id", async (req, res) => {
  try {
    const { _id, firstname, lastname, email, userImage } = await User.findById(
      req.params.id
    );
    return res.json({ _id, firstname, lastname, email, userImage });
  } catch (error) {
    console.log(error);
  }
});

// request to return all specific user event from database
// get
router.get("/userEvents/:id", async (req, res) => {
  try {
    // console.log(req.params.id)
    // console.log("page", req.query.page, "limit", req.query.limit);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const eventsWoPagination = await Event.find({ userId: req.params.id }).sort({ createdAt: 1});
    // console.log(eventsWoPagination);

    const events = {};
    events.totalEvents = eventsWoPagination.length;

    events.pageCount = Math.ceil(eventsWoPagination.length / limit);

    if (endIndex < eventsWoPagination.length) {
      events.next = {
        page: page + 1,
      };
    }

    if (startIndex > 0) {
      events.previous = {
        page: page - 1,
      };
    }

    events.event = eventsWoPagination.slice(startIndex, endIndex);
    return res.json({ events });
  } catch (error) {
    console.log(error);
  }
});

// request to return all event from database that will be show on the homepage
// get

router.post("/occuredEvents", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const {eventCity , hotelName} = req.body;

  let dataObject = {}
  if(eventCity.length!=0){
    dataObject.eventCity = eventCity
    if(hotelName.length!=0){
      dataObject.eventHotel = hotelName
    }
    
  }
  const AllEvents = await OccuredEvent.find(dataObject).sort({createdAt : -1});

  const Events = {};
  if (endIndex < AllEvents.length) {
    Events.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    Events.previous = {
      page: page - 1,
    };
  }

  Events.totalEvents = AllEvents.length;
  Events.pageCount = Math.ceil(AllEvents.length / limit);

  Events.event = AllEvents.slice(startIndex, endIndex);

  return res.json({ message: "Getting data ", Events });
});



// request to return a single event from database that will be show on the NewEvent page
// get
 router.get('/eventDetails/:id' , async (req, res)=>{
  try {
    
    const _id = req.params.id;
    const Event = await OccuredEvent.findById(_id);
    return res.json({Event})
    
    
  } catch (error) {
    
    console.log(error)
  }
 })




// get request to send all the cities to user event form
// get
router.get("/allCities", async (req, res) => {
  try {
    const cities = await City.find();
    const hotels = await Hotel.find();
    return res.json({ cities, hotels });
  } catch (error) {
    console.log(error);
  }
});




// get request to send all the hotels to user event form based on city name
// get
router.post("/allHotels", async (req, res) => {
  try {
    const cityname = req.body.value;
    const hotelCity = await City.findOne({ cityname });
    console.log(hotelCity._id);
    const hotels = await Hotel.findOne({ hotelCity: hotelCity._id });
    console.log(hotels);
    return res.json({ hotels });
  } catch (error) {
    console.log(error);
  }
});



var storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
// destination is used to specify the path of the directory in which the files have to be stored
  cb(null, './uploads/userImages');    
}, 
filename: function (req, file, cb) { 
// It is the filename that is given to the saved file.
   const uniqueSuffix = Date.now()
   cb(null , uniqueSuffix + file.originalname);   
}
});

// Configure storage engine instead of dest object.
const upload = multer({ storage: storage })





// request to update the user clientInformation

router.put('/updateUser/:id' ,upload.single('image'), async(req, res)=>{
  try {

      //  console.log(req.body)
      //  console.log(req.file.filename);

      const hashedPassword = await bcrypt.hash(req.body.password, 10);


      const user = await User.findByIdAndUpdate(req.params.id , {
        firstname : req.body.firstname,
        lastname:req.body.lastname,
        password : hashedPassword,
        userImage: req.file.filename
    
      })

      // console.log(user)
      if(user){
        return res.json({message: 'Profile updated' , success: true} )
      }
      else{
        return res.json({message: 'failed to Update' , success: false})
      }
     
  } catch (error) {
    
  }
})



module.exports = router;
