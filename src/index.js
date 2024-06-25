"use strict"

const express = require('express')
const cors = require('cors');
const index = require("./routes/index");
const reviews = require("./routes/reviews");
const title = require("./routes/title");
const cache = require("./helpers/cache");
const search = require("./routes/search");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");

const app = express();

app.use("*", cors());
// app.use(cache);
app.use(bodyParser.urlencoded({extended: false}));
app.use("/search", search);
app.use("/title", title);
app.use("/reviews", reviews);
app.use("/user", userRoutes);
app.use("/", index);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
