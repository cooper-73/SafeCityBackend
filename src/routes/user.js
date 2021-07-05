const router = require("express").Router();
const User = require("../models/user");

// const user = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     dni: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     password:  {
//         type: String,
//         required: true
//     },
//     currentLocation: {
//         type: Object,
//         default: null
//     },
//     emergencyContacts: {
//         type: Object,
//         default: null
//     },
//     photo: {
//         type: Object,
//         default: null
//     },
//     reports: {
//         type: Object,
//         default: null
//     },
// });

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
