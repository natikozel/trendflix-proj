const userInfo = require("./info");
const userRating = require("./rating");
const express = require("express");
const userRoutes = express.Router();

userRoutes.get("/:id", userInfo);
userRoutes.get("/:id/ratings", userRating);

module.exports = userRoutes;
