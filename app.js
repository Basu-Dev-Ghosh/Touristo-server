require("dotenv").config();
const express = require("express");
require("./db/conn");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routers/router");
const port = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);



app.listen(port, () => console.log(`Server Starts on port ${port}`));