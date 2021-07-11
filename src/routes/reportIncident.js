const router = require("express").Router();
const Incident = require("../models/report");
const cloudinary = require('cloudinary');
// cloudinary.config({
//   cloud_name: 'dun28bky1',
//   api_key: '872236769338254',
//   api_secret: 'Nk82bw4rUBfOBp7geEVVgZNc1rc',
// });
cloudinary.config({
  cloud_name: 'dun28bky1',
  api_key: '872236769338254',
  api_secret: 'Nk82bw4rUBfOBp7geEVVgZNc1rc',
});

const fs = require('fs-extra');

router.post('/form', async (req, res) => {
  const { victim, incident, details, longitude, latitude } = req.body;
  const location = {latitude, longitude};
  const result = await cloudinary.v2.uploader.upload(req.file.path);

  const newReport = new Incident({
    victim,
    incident,
    details,
    location,
    fileURL: result.url,
    public_id: result.public_id,
    time: result.created_at,
  });

  await newReport.save();
  await fs.unlink(req.file.path);
  res.send('OK');

});

router.get('/', async (req, res) => {
  const incident = await Incident.find();
  console.log(incident);
  res.send(incident);

});

router.get('/:id', async (req, res) => {
  const file_id = req.params.id;
  Incident.findById(file_id, function (err, result){
    if(err){
      res.status(500).json({ err: err.toString() });
    }else{
      console.log(result);
      res.send(result);
    }
  })
});
module.exports = router;
