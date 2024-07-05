const fs = require('fs');
const moviesData = require('./movie-data')
const {exec} = require('child_process')
const path = require('path')
const analyzeReview = require('./AI-model')

const getReviewsPage = async (amountOfReviews, titleId) => {

    const resultData = [];
    let nextKey = "";
    while (resultData.length !== amountOfReviews) {
        const r = await fetch(`http://localhost:3000/reviews/${titleId}?option=score&sortOrder=desc&nextKey=${nextKey}`);
        const data = await r.json();
        nextKey = data.next_api_path;
        const reviewsNeeded = amountOfReviews - resultData.length;
        if (reviewsNeeded > data.reviews.length)
            resultData.push(...data.reviews.map((review => review.content)));
        else
            resultData.push(...data.reviews.map((review => review.content)).slice(0, reviewsNeeded));
    }
    return resultData;
}


// const scrapeReviewsIntoFile = async (moviesData) => {
//     await moviesData.movies.forEach(movie => {
//         getReviewsPage(40, movie.titleId).then(async (data) => {
//             const hist = [];
//             for (const review of data) {
//
//                 await fs.appendFile("Output.txt", index + 1 + ") " + piece + "\n", err => {
//                 })
//             }
//         });
//     })
// }

let amount = 30;
moviesData.movies.forEach(movie => {
    getReviewsPage(amount, movie.titleId).then(async (data) => {
        let hist = [];
        let final = {}
        for (let i = 0; i < data.length; i++) {
            try {
                const json = await analyzeReview(data[i]);
                if (json) {
                    console.log(json)
                    hist.push(...json.genres);
                } else
                    amount--;
            } catch (e) {
                i--;
            }
        }
        hist.forEach((genre) => {
            // const [key, value] = Object.entries(genre)[0];
            // final[key.trim().toLowerCase()] = final[key.trim().toLowerCase()] ? +((value / amount + final[key.trim().toLowerCase()])).toFixed(6) : +(value / amount).toFixed(6)
            if (genre.weight)
                final[genre.name.trim().toLowerCase()] = final[genre.name.trim().toLowerCase()] ? +((genre.weight / amount + final[genre.name.trim().toLowerCase()])).toFixed(6) : +(genre.weight / amount).toFixed(6)
        });
        final.sum = Object.values(final).reduce((a, b) => a + b, 0)
        console.log(final)
        fs.appendFile(`${movie.title}.txt`, JSON.stringify(final), err => {
        });
    })
});