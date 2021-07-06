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

/*
Perform basic register
Parameters: username,dni,phone,email,password
Return: if is correct return code 200, else return 400; 
*/
router.post("/register",(req,res)=>{
  
  const {username,dni,phone,email,password} = req.body
  User.register(new User({username,dni,phone,email}),password,
  function(err,user){
    if(err){
      console.log(err)
      res.status(400).send()
    }
    else{
      passport.authenticate("local")
      console.log("usuario registrado")
      res.status(200).send()
    }
  })
})
/* 
Perform login
Paramters:username, password
if correct perform callback and return code 200 and all the user information
else on error return by default code 401
*/

router.post("/login", passport.authenticate("local"),(req,res)=>{
  console.log("login correcto")
  res.status(200).send(JSON.stringify(req.user))
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
