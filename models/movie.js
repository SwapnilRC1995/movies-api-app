// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
MovieSchema = new Schema({
    plot: { type: String },
    genres: [{ type: String }],
    runtime: { type: Number },
    cast: [{ type: String }],
    num_mflix_comments: { type: Number },
    poster: { type: String },
    title: { type: String },
    fullplot: { type: String },
    languages: [{ type: String }],
    released: { type: Date },
    directors: [{ type: String }],
    writers: [{ type: String }],
    lastupdated: { type: String },
    year: { type: Number },
    countries: [{ type: String }],
    type: { type: String },
    metacritic: { type: Number },
    rated: { type: String },
    imdb: {
        rating: { type: Number },
        votes: { type: Number },
        id: { type: Number }
    },
    awards: {
        wins: { type: Number },
        nominations: { type: Number },
        text: { type: String }
    },
    tomatoes: {
        boxOffice: { type: String },
        consensus: { type: String },
        critic: {
            rating: { type: Number },
            numReviews: { type: Number },
            meter: { type: Number }
        },
        dvd: { type: Date },
        fresh: { type: Number },
        rotten: { type: Number },
        production: { type: String },
        website: { type: String },
        viewer: {
            rating: { type: Number },
            numReviews: { type: Number },
            meter: { type: Number }
        },
        lastUpdated: { type: Date }
    },
});
module.exports = mongoose.model('Movie', MovieSchema);