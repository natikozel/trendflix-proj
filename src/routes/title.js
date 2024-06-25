const express = require("express");
const title = express.Router();
const {
    getSeason: getSeason
} = require("../helpers/seriesFetcher");

const getTitle = require("../helpers/getTitle");


title.get("/:id", async (req, res, next) => {
    const id = req.params.id;

    try {
        const result = await getTitle(id);

        return res.json(result);
    } catch (error) {
        res.status(500);
        return res.json({
            message: error.message,
        });
    }
});

title.get("/:id/season/:seasonId", async (req, res, next) => {

    const {id, seasonId} = req.params;

    try {
        const result = await getSeason({id, seasonId});

        const response = Object.assign(
            {
                id,
                title_api_path: `/title/${id}`,
                imdb: `https://www.imdb.com/title/${id}/episodes?season=${seasonId}`,
                season_id: seasonId,
            },
            result
        );

        return res.json(response);
    } catch (error) {
        res.status(500);
        return res.json({
            message: error.message,
        });
    }
});


function getNode(dom, tag, id) {
    return dom
        .getElementsByTagName(tag)
        .find((e) => e.attributes.find((e) => e.value === id));
}

module.exports = title