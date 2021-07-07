const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const expressSession = require('express-session')
const passport = require('passport')
const user = require("./models/user")
const LocalStrategy   = require('passport-local');


//Initializations
const app = express();
require('./database');

//Settings
app.set('port', process.env.PORT || 8080);

//Importing routes
const incidentRouter = require('./routes/incident');
const reportRouter = require('./routes/report');
const userRouter = require('./routes/user');

//PassportConfiguracion
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
passport.use(new LocalStrategy(user.authenticate()))



//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}))
app.use(expressSession({secret:"llama",resave:false,saveUninitialized:false}))
app.use(passport.initialize());
app.use(passport.session());



//Routes
app.use('/incident', incidentRouter);
app.use('/report', reportRouter);
app.use('/user', userRouter);

//Start the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});