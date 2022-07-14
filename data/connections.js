const mongoose = require('mongoose');

//uri: Uniform Resource Identifier: string som identificer en resurse

let uri = 'mongodb+srv://Martin:' + process.env.PW + '@cluster0.vpoqhy0.mongodb.net/' + process.env.DBname +'?retryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
