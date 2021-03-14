const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://amaldev:amaldevm19@cluster0.bqtbp.mongodb.net/alfain?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DB"))
    .catch (console.error);

module.exports = mongoose;