const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const Report = require("../models/report");

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
//   attending_locations: {
//     type: Array,
//     default: []
// }
// });

/*
Perform basic register
Parameters: username,dni,phone,email,password
Return: if is correct return code 200, else return 400;
*/
router.post("/register", (req, res) => {
  const {  dni, phone, email, password, name, } = req.body;
  const username = email
  User.register(
    new User({ username, dni, phone, name ,email}),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.status(400).send();
      } else {
        passport.authenticate("local");
        console.log("usuario registrado");
        res.status(200).send();
      }
    }
  );
});
/*
Perform login
Paramters:username, password
if correct perform callback and return code 200 and all the user information
else on error return by default code 401
*/

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("login correcto");
  res.status(200).send(JSON.stringify(req.user));
});


// Get info of user
// Parameters: Id of user
// Req: -
// Returns: Info of user
router.get("/info/:id", async (req, res) => {
  let user_id = req.params.id;
  await User.findOne({ _id: user_id }, "name email phone")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
});


// Update User's Profile
// Parameters: Id of user
// Body: User's profile changes (username - email - phone)
// Returns: Message of the process
router.put("/profile/:id", async (req, res) => {
  let user_id = req.params.id;
  let new_profile_info = req.body;
  let flag = false;
  await User.findOne({phone: new_profile_info.phone}).then(result => {
    if(result === null) return;
    if(result._id != user_id) {
      console.log(result._id, user_id);
      res.status(200).json({ err: "Ya existe un perfil con este número" });
      flag = true;
    }
  }).catch((err) => res.status(500).json({ err: err.toString() }));
  if(!flag) {
    await User.findOne({email: new_profile_info.email}).then(result => {
      if(result === null) return;
      if(result._id != user_id) {
        console.log(result._id, user_id);
        res.status(200).json({ err: "Ya existe un perfil con este correo electrónico" });
        flag = true;
      }
    }).catch((err) => res.status(500).json({ err: err.toString() }));
  }
  if(!flag) {
    await User.findByIdAndUpdate(user_id, {...new_profile_info, username: new_profile_info.email})
    .then((result) => {
      res.status(200).json({ msg: "Perfil actualizado" });
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
  }
});

// Post Emergency Contacts
// Parameters: -
// Req: User id, contact_name, contact_phone
// Returns: Array of emergency contacts of user
router.post("/emergency_contacts/", async (req, res) => {
  let user_id = req.body.id;
  let contact_name = req.body.contact_name;
  let contact_phone = req.body.contact_phone;
  let newContact = {
    name: contact_name,
    phone: contact_phone
  };
  await User.findByIdAndUpdate(user_id, {
    $push: { emergencyContacts: newContact },
  })
    .then((user) => res.status(200).json({ msg: "Contacto agregado" }))
    .catch((err) => res.status(500).json({ err: err.toString() }));
});

// Get Emergency Contacts
// Parameters: Id of user
// Req: -
// Returns: Array of emergency contacts of user
router.get("/emergency_contacts/:id", async (req, res) => {
  let user_id = req.params.id;
  await User.findOne({ _id: user_id }, "emergencyContacts")
    .then((result) => {
      res.status(200).json({ emergencyContacts: result.emergencyContacts });
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
});

// Delete Emergency Contact
// Parameters: Id of user
// Body: Phone of emergency contact to be dropped
// Returns: Message of the process
router.put("/delete_emergency_contacts/:id", async (req, res) => {
  let user_id = req.params.id;
  let contact_phone = req.body.contact_phone;
  await User.findByIdAndUpdate(user_id, {
    $pull: { emergencyContacts: { phone: contact_phone } },
  })
    .then((result) => {
      res.status(200).json({ msg: "Contacto eliminado" });
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
});

// Get reports sent to the user
// Parameters: Id of user
// Body: -
// Returns: Array with the last 20 reports sent to the user within last 7 days
router.get("/received_reports/:id", async (req, res) => {
  let user_id = req.params.id;
  let received_reports = [];
  await User.findById(user_id)
    .then((user) => {
      received_reports = user.reports;
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
  await Report.find({ _id: { $in: received_reports } })
    .then((result) => res.status(200).json({ received_reports: result }))
    .catch((err) => res.status(500).json({ err: err.toString() }));
});

// Put attending incident
// Parameters: -
// Req: User id, report id
// Returns: Message of the process
router.put("/attend/", async (req, res) => {
  let user_id = req.body.id;
  let report_id = req.body.report_id;
  //agregar ubicacion del reporte
  // await User.findByIdAndUpdate(user_id, {
  //   $push: {attending: user_id}
  // }).then((user) => {}).catch((err) => res.status(500).json({ err: err.toString() }));
  await Report.findByIdAndUpdate(report_id, {
    $push: { attending: user_id },
  })
    .then((report) => res.status(200).json({ msg: "Atendiendo incidente" }))
    .catch((err) => res.status(500).json({ err: err.toString() }));
});

// Get attending locations
// Parameters: Id of user
// Req: -
// Returns: Message of the process
router.get("/attending_locations/:id", async (req, res) => {
  let user_id = req.params.id;
  await User.findById(user_id)
    .then((user) =>
      res.status(200).json({ attending_locations: user.attending_locations })
    )
    .catch((err) => res.status(500).json({ err: err.toString() }));
});


router.post("/request_new_password", async(req,res)=>{
  const {dni , email} = req.body;
  await User.findOne(
    {$or: [{dni:dni},{username:email}]}
  ).then((user)=> {
    const {phone, _id} = user
    console.log(phone,_id)
    res.status(200).send(JSON.stringify({phone,_id}))
  })
  .catch((err)=>{
    res.status(400).send()
  })

})

router.post("/new_password",async(req,res)=>{
  const {id ,password} = req.body;
  await User.findById(id, (err,user)=>{
    user.setPassword(password, (err)=>{
      if(err){
        res.status(400).send()
      }
      user.save()
      res.status(200).send()
    })

  })
})
/*
yourSchemaName.findById(id, function(err, user) {
  user.setPassword(req.body.password, function(err) {
      if (err) //handle error
      user.save(function(err) {
          if (err) //handle error
          else //handle success
      });
  });
});
*/

module.exports = router;
