const router = require("express").Router();
const Incident = require("../models/report");
const User = require("../models/user");

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.API_KEY_V,
  apiSecret: process.env.API_SECRET,
})

const fs = require('fs-extra');

router.post('/form', async (req, res) => {
  const { victim, incident, details, longitude, latitude, id } = req.body;
  const location = {latitude, longitude};
  const result = await cloudinary.v2.uploader.upload(req.file.path);

console.log("1");
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
console.log("2");
  author = {_id, emergencyContacts};

  const newReport = new Incident({
    victim,
    incident,
    details,
    location,
    author,
    fileURL: result.secure_url,
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
  console.log(time);
  const timeNow =  Date.now();

  const timeIni = timeNow - time * 86400000 ;

  const data = [];

  const incident = await Incident.find()
                                  .catch((err) => res.status(500).json({ err: err.toString() }));

  incident.forEach(element => {

    if(element.dateMs != null){

      if(timeIni <= element.dateMs ){

        const daysAgo = (timeNow - element.dateMs)/86400000;
        // console.log(element);
        data.push( {id : element._id,
                  victimId: element.author._id,
                  victim: element.victim,
                  incident:element.incident,
                  details:element.details,
                  locationLatitude:element.location.latitude,
                  locationLongitude:element.location.longitude,
                  fileURL:element.fileURL,
                  daysAgo:daysAgo});
      }
    }
  });

  res.status(200).json({recentReports: data.reverse()});
});

router.post('/message/:id', async (req, res) => {
  const id = req.params.id;

  const { message } = req.body;
  var auxLoc = new Array();
  auxLoc = message.split("=")[1].split(",")
  const latitude = auxLoc[0];
  const longitude = auxLoc[1];
  const location = { latitude, longitude};

  const time =  new Date();

  const aux = await User.findById(id, function (err, result){
    if(err){
      res.status(500).json({ err: err.toString() });
    }else{
      return result;
    }
  });


  const{_id, emergencyContacts, name} = aux;
  //Envio la url maps

  emergencyContacts.forEach(element => {

    const from = "Vonage APIs"
    const to = `51${element.phone}`
    const text = message

    if (element != null){
      vonage.message.sendSms(from, to, text, (err, responseData) => {
          if (err) {
              console.log(err);
          } else {
              if(responseData.messages[0]['status'] === "0") {
                  console.log("Message sent successfully.");
              } else {
                  console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
              }
          }
      })}
  });

  //guardar la incidencia
  const newReport = new Incident({
    victim : name,
    incident : "Pedido de ayuda",
    details : `${name} presion?? el boton de SOS de la aplicaci??n`,
    location,
    author: _id,
    time
  });

  await newReport.save();
  res.status(200).send();
});

module.exports = router;
