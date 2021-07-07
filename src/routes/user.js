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
router.post("/register", (req, res) => {
  const { username, dni, phone, email, password } = req.body;
  User.register(
    new User({ username, dni, phone, email }),
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

// Post Emergency Contacts
// Parameters: -
// Req: User id, contact_name, contact_phone
// Returns: Array of emergency contacts of user
router.post("/emergencyContacts/", async (req, res) => {
  let user_id = req.body.id;
  let contact_name = req.body.contact_name;
  let contact_phone = req.body.contact_phone;
  let preexistent_contact = false;
  let newContact;
  await User.findById(user_id, "emergencyContacts")
    .then((result) => {
      let contacts = result.emergencyContacts;
      console.log(contacts);
      contacts.forEach((contact) => {
        if (contact.phone == contact_phone) preexistent_contact = true;
      });
      if (preexistent_contact) {
        res.status(200).json({ msg: "Contacto existente" });
      }
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
  if (!preexistent_contact) return;
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
// Returns: Array of emergency contacts of user
router.get("/emergencyContacts/:id", async (req, res) => {
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
router.put("/delete_emergencyContacts/:id", async (req, res) => {
  let user_id = req.params.id;
  let contact_phone = req.body.contact_phone;
  await User.findByIdAndUpdate(user_id, {$pull: {emergencyContacts:{ phone: contact_phone}}})
    .then((result) => {
      console.log(result)
      res.status(200).json({ msg: "Contacto eliminado" });
    })
    .catch((err) => res.status(500).json({ err: err.toString() }));
});

module.exports = router;
