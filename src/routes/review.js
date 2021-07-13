const router = require("express").Router();
const Review = require("../models/review")

/*
const review = new Schema({
    calification:{
        type: Number,
        required: True,
    },
    content:{
        type: String,
        required: True
    }
})
*/

router.post("/new", async(req,res)=>{
    const {calification, content} = req.body
    const review = new Review({calification,content})
    console.log(review)
    await review.save()
    res.status(200).send()
})

module.exports = router;
