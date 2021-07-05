const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//Initializations
const app = express();
require('./database');

//Settings
app.set('port', process.env.PORT || 8080);

//Importing routes
const incidentRouter = require('./routes/incident');
const reportRouter = require('./routes/report');
const userRouter = require('./routes/user');

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.use('/incident', userRouter);
app.use('/report', userRouter);
app.use('/user', userRouter);

//Start the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});