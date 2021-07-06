const router = require("express").Router();
const Report = require("../models/report");
const User = require("../models/user");

/*
const report = new Schema({
    victim: {
        type: Object,
        required: true
    },
    incident: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    details: String,
    attending: {
        type: Object,
        default: null
    },
    location: {
        type: Object,
        required: true
    },
    photos: {
        type: Object,
        default: null
    },
    voiceMessages: {
        type: Object,
        default: null
    },
    videos: {
        type: Object,
        default: null
    }
});
*/
router.post('/new',async(req,res)=>{
    const {username,incident,time,details,location} = req.body
    const user =  await User.findOne({username:username})
    const newReport = new Report({victim:user,incident,time,details,location})
    console.log(newReport)
    await newReport.save()
    res.status(200).send()
})


module.exports = router;

