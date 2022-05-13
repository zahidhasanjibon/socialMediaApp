const mongoose = require('mongoose');

const connectMongodb = () => {
    mongoose
        .connect(process.env.MONGO_CONNECTION_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        })
        .then((con) => console.log(`Database Connected with: ${con.connection.host}`))
        .catch((err) => {
            console.log(err);
        });
};

module.exports = connectMongodb;
