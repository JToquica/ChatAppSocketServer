const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("DB Online");
    } catch (error) {
        console.log(error);
        throw new Error("Error en la base de datos");
    }
}

module.exports = {
    dbConnection
};