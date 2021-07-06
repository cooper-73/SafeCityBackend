const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");

//require('../app')


// const user = new Schema({
//   username: {
//       type: String,
//       required: true
//   },
//   dni: {
//       type: String,
//       required: true,
//       unique: true
//   },
//   phone: {
//       type: String,
//       required: true,
//       unique: true
//   },
//   email: {
//       type: String,
//       required: true,
//       unique: true
//   },
//   currentLocation: {
//       type: Object,
//       default: null
//   },
//   emergencyContacts: {
//       type: Object,
//       default: null,
//       ref: 'user'
//   },
//   photo: {
//       type: Object,
//       default: null
//   },
//   reports: {
//       type: Object,
//       default: null
//   },
// });


router.post("/register",(req,res)=>{
  
  const {username,dni,phone,email,password} = req.body
  User.register(new User({username,dni,phone,email}),password,
  function(err,user){
    if(err){
      console.log(err)
    }
    else{
      passport.authenticate("local")
      console.log("usuario registrado")
    }
  })
})

router.post("/login", passport.authenticate("local"),(req,res)=>{
  console.log("login correcto")
})

// Get Emergency Contacts
// Parameters: Id of user
// Returns: Array of emergency contacts of user
router.get("/:id", async (req, res) => {
  const user_id = req.params.id;
  await User.findOne({ _id: user_id })
    .then((user) => {
      console.log(user);
      res.json(user);
    })
    .catch((err) => res.status(500).json("Error: " + err));
});





module.exports = router;
