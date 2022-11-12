const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");
const Tour = require("../models/tour");

router.get("/", (req, res) => {
    res.send("Hello server")
})
router.post("/api/signup", async (req, res) => {
    const { Name, Email, Phone, Password } = req.body;
    const user = await User.findOne({ Email });
    if (user) {
        res.status(422).json({ msg: "User already Exist!" });
    } else {
        try {
            const user = new User({ Name, Email, Phone, Password });
            await user.save();
            const token = await user.generateAuthToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 50000000),
                sameSite: "None",
                secure: true,
                httpOnly: true,
            });
            res.status(200).json({ msg: "User Created Please Log in Now" });
        } catch (err) {
            res.status(422).json({ error: "Something Went Wrong" });
        }
    }
});

router.post("/api/login", async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const user = await User.findOne({ Email });
        if (user) {
            const bool = await bcrypt.compare(Password, user.Password);
            if (!bool) {
                res.status(422).json({ err: "Username or password incorrect" });
            } else {
                const token = await user.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 50000000),
                    sameSite: "None",
                    secure: true,
                    httpOnly: true,
                });
                res.status(200).json({ msg: "Log in succesfull" });
            }
        } else {
            res.status(422).json({ err: "No Account Found" });
        }
    } catch (err) {
        res.status(422).json({ error: "Something Went wrong" });
    }
});

router.get("/api/islogin", auth, (req, res) => {
    res.status(200).json({ msg: "User is logged in" });
});

router.get("/api/logout", (req, res) => {
    res.clearCookie("jwt", {
        sameSite: "None",
        secure: true,
    });
    res.status(200).json({ msg: "Log out" });
});


router.post("/api/savetour", auth, async (req, res) => {
    const { title, desc, background } = req.body;
    try {
        const tour = new Tour({ title, desc, background, userid: req.user_id });
        await tour.save();
        res.status(200).json({ msg: "Tour Added" });
    } catch (err) {
        res.status(422).json({ error: "Something Went Wrong" });
    }
});

router.get('/api/gettours', auth, async (req, res) => {
    try {
        const tours = await Tour.find({ userid: req.user_id });
        res.status(200).json(tours);
    } catch (err) {
        res.status(422).json({ error: "Something Went Wrong" });
    }
})

router.post('/api/gettourbytitle', async (req, res) => {
    const { tourname } = req.body;
    console.log(tourname);
    try {
        const tours = await Tour.findOne({ title: tourname });
        console.log(tours);
        res.status(200).json(tours);
    } catch (err) {
        res.status(422).json({ error: "Something Went Wrong" });
    }
})

router.post("/api/deletetour", async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
        const isDeleted = await Tour.deleteOne({ _id: id });
        console.log(isDeleted);
        res.status(200).json({ msg: "Tour Deleted" });
    } catch (err) {
        res.status(422).json({ error: "Something Went Wrong" });
    }
});

module.exports = router;