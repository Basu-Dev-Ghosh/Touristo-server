const mongoose = require("mongoose");
const ToursSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    desc: {
        type: String,
    },
    background: {
        type: String,
    },
    userid: {
        type: mongoose.SchemaTypes.ObjectId,
    }
});

const Tour = new mongoose.model("Tour", ToursSchema);
module.exports = Tour;
