const router = require("express").Router();
const Incident = require("../models/report");
const User = require("../models/user");
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dun28bky1',
  api_key: '872236769338254',
  api_secret: 'Nk82bw4rUBfOBp7geEVVgZNc1rc',
});

const fs = require('fs-extra');

router.post('/form', async (req, res) => {
  const { victim, incident, details, longitude, latitude, id } = req.body;
  const location = {latitude, longitude};
  const result = await cloudinary.v2.uploader.upload(req.file.path);

  const aux = await User.findById(id, function (err, result){
    if(err){
      console.log("3");
      res.status(500).json({ err: err.toString() });
    }else{
      console.log(result);
      return result;
    }
  })
  const{_id, emergencyContacts} = aux;
  author = {_id, emergencyContacts};

  const newReport = new Incident({
    victim,
    incident,
    details,
    location,
    author,
    fileURL: result.url,
    public_id: result.public_id,
    time: result.created_at,
    dateMs: result.original_filename,
  });

  await newReport.save();
  await fs.unlink(req.file.path);
  res.status(200).send();

});

router.get('/', async (req, res) => {
  const incident = await Incident.find();
  console.log(incident);
  res.status(200).send(JSON.stringify(incident));

});

router.get('/:id', async (req, res) => {
  const file_id = req.params.id;
  Incident.findById(file_id, function (err, result){
    if(err){
      res.status(500).json({ err: err.toString() });
    }else{
      res.status(200).send(JSON.stringify(result));
    }
  })
});

router.get('/duration/:time', async (req, res) => {
  const time = req.params.time;

  const dateNow = Date.now();

  const dateIni = dateNow - time * 3600000 ;

  const data = [];

  console.log("fecha inicial:",dateIni);

  const incident = await Incident.find()
                                  .catch((err) => res.status(500).json({ err: err.toString() }));
  incident.forEach(element => {

    if(element.dateMs != null){
      if(dateIni < element.dateMs && element.dateMs <dateNow){

        const timeElapsed = (dateNow - element.dateMs)/3600000;
        data.push( {victim: element.victim,
                  incident:element.incident,
                  details:element.details,
                  location:element.location,
                  fileURL:element.fileURL,
                  timeElapsed:timeElapsed});
      }
    }
  });
  res.status(200).send(JSON.stringify(data));
});

module.exports = router;
