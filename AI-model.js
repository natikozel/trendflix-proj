// const {Ollama} = require("ollama");
//
//
// const ollama = new Ollama({host: 'http://localhost:11434'});
//
// module.exports = {
//     AI: {
//         model: ollama,
//         chat: async (prompt) => await ollama.chat({model: 'mistral', messages: [{role: 'user', content: prompt}]})
//     }
// }

// const Groq = require( "groq-sdk");
// const punycode = require('punycode');
// const groq = new Groq({ apiKey: KEY });

// async function main() {
//     const chatCompletion = await getGroqChatCompletion();
//     // Print the completion returned by the LLM.
//     console.log(chatCompletion.choices[0]?.message?.content || "");
// }
//
// async function getGroqChatCompletion() {
//     return groq.chat.completions.create({
//         messages: [
//             {
//                 role: "user",
//                 content: "What is 2+2?",
//             },
//         ],
//         model: "llama3-8b-8192",
//     });
// }

const KEY = "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"
const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film-Noir",
    "History",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Sport",
    "Thriller",
    "War",
    "Western",
    "Short",
    "Reality-TV",
    "Talk-Show",
    "Game-Show",
    "News",
    "Music",
    "Experimental",
    "Martial Arts",
    "Epic",
    "Superhero",
    "Psychological",
    "Disaster",
    "Silent",
    "Black Comedy",
    "Road",
    "Heist",
    "Parody",
    "Satire",
    "Teen",
    "LGBTQ",
    "Gothic",
    "Mockumentary",
    "Space Opera",
    "Sword and Sandal",
    "Swashbuckler",
    "Zombie",
    "Cyberpunk",
    "Steampunk",
    "Time Travel",
    "Legal",
    "Political",
    "Survival",
    "Slasher",
    "Splatter",
    "Monster",
    "Kaiju",
    "Vampire",
    "Werewolf",
    "Alien",
    "Supernatural"
]
const analyzePrompt = async (prompt) => {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${KEY}`
        },
        body: JSON.stringify({
            messages: [
                {
                    role: 'system',
                    content:
                        `
                     You are a great movies critic and you're good at summarizing reviews of movies and through them - classify the reviewed movie to genres.
                     If you're unable to summarize the review and/or classify them to genres, please return an empty JSON as {}.
                     If you're unable to return a valid JSON, please return an empty JSON as {}.
                     You summarize the review and build a histogram that sums up to 1.0 and divides the review of the movie to weights of genres from the following list: ${genres + "\n"}
                     You ONLY return valid JSON according to the following example: { "genres" : [ {"name" : "weight"} ] } 
                     when name is one of the genre names from the list above and weight is a number from 0.0 to 1.0 that this genre classifies the movie with without any further data.
                     Don't return genre classification that are stacked upon the same json object, always make sure the genres array consists of an objects array with a single genre classification per object.
                     Make sure the sum of all weights is 1.0 exactly.
                     Please only return valid JSON and no other text. This is a very critical rule! Never return anything aside of JSON.
                     `
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama3-8b-8192',
            temperature: 1,
            // max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        })
    })
    const data = await r.json();
    // console.log(data.choices[0].message?.content);
    // console.log(data, data.choices[0].message?.content)
    const returnValue = JSON.parse(data.choices[0].message?.content);
    return Object.keys(returnValue).length !== 0 ? returnValue : null
    // return data.choices[0].message?.content

}

module.exports = analyzePrompt