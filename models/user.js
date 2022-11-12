const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Email: {
        type: String,
        unique: true,
    },
    Phone: {
        type: String,
    },
    Password: {
        type: String,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});
UsersSchema.pre("save", async function (next) {
    if (this.isModified("Password")) {
        this.Password = await bcrypt.hash(this.Password, 12);
        next();
    }
});
UsersSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        res.status(422).json({ msg: "Jwt not set" });
    }
};
const User = new mongoose.model("User", UsersSchema);
module.exports = User;
