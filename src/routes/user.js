const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const Report = require("../models/report");

//require('../app')

// const user = new Schema({
//   name: {
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
Parameters: name,dni,phone,email,password
Return: if is correct return code 200, else return 400; 
*/
router.post("/register", (req, res) => {
  const { name, dni, phone, email, password } = req.body;
  User.register(
    new User({ name, dni, phone, email }),
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
Paramters:name, password
if correct perform callback and return code 200 and all the user information
else on error return by default code 401
*/

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("login correcto");
  res.status(200).send(JSON.stringify(req.user));
});

// Update User's Profile
// Parameters: Id of user
// Body: User's profile changes
// Returns: Message of the process
router.put("/profile/:id", async (req, res) => {
  let user_id = req.params.id;
  let new_profile_info = req.body;
  await User.findByIdAndUpdate(user_id, new_profile_info)
    .then((result) => {
      res.status(200).json({ msg: "Perfil actualizado" });
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
});

// Post Emergency Contacts
// Parameters: -
// Req: User id, contact_name, contact_phone
// Returns: Array of emergency contacts of user
router.post("/emergency_contacts/", async (req, res) => {
  let user_id = req.body.id;
  let contact_name = req.body.contact_name;
  let contact_phone = req.body.contact_phone;
  let newContact;
  await User.findOne({ phone: contact_name }, "photo")
    .then((contact_photo) => {
      newContact = {
        name: contact_name,
        phone: contact_phone,
        photo: contact_photo,
      };
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
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

module.exports = router;