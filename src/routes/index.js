const express = require("express");
const index = express.Router();
const packageJson = require("../../package.json");

index.get("/", async (req, res, next) => {
    return res.json({
        status: "Running",
        name: packageJson.name,
        description: packageJson.description,
        version: packageJson.version,
        repository: packageJson.homepage,
        author: packageJson.author,
        license: packageJson.license,
        postman:
            "https://www.postman.com/tuhin-pal/workspace/imdb-api/collection/12162111-12f08f8e-a76b-4cf4-a7b9-17cb9f95dd82?action=share&creator=12162111",
        postman_collection_json:
            "https://www.getpostman.com/collections/c261b9abc6b2a4b5f1c8",
    });
});

module.exports = index;


