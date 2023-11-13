const mongoose = require('mongoose');
require('dotenv').config();

exports.databaseConnecter = async () => {
    mongoose.connect(process.env.MONGOURL, {
        useNewUrlParser: true,  // Fix the typo here
        useUnifiedTopology: true,
    }).then(
        () => {
            console.log('DB CONNECTED');
        }
    ).catch((e) => {
        console.log("DB UNSUCCESSFUL");
        console.log(e);
        process.exit(1);
    });
};
