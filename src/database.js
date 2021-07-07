const mongoose = require('mongoose');

const url = `mongodb+srv://cooper73:cooper73@cluster0.ma4no.mongodb.net/SafeCity?retryWrites=true&w=majority`;

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

mongoose.connect(url,connectionParams)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

