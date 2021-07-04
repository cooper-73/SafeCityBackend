const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//Initializations
const app = express();
require('./database');

//Settings
app.set('port', process.env.PORT || 8080);

//Importing routes
// const termsRouter = require('./routes/terms');
// const coursesRouter = require('./routes/courses');
// const escuelasRouter = require('./routes/escuelas');
// const gradesRouter = require('./routes/grades');
// const questionRouter = require('./routes/questions');
// const taskRouter = require('./routes/agenda');
// const resourcesRouter = require('./routes/resources');
const userRouter = require('./routes/user');

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Routes
// app.use('/resources',resourcesRouter);
// app.use('/terms', termsRouter);
// app.use('/courses', coursesRouter);
// app.use('/escuelas', escuelasRouter);
// app.use('/grades', gradesRouter);
// app.use('/question', questionRouter);
// app.use('/agenda',taskRouter);
app.use('/user', userRouter);

//Start the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});