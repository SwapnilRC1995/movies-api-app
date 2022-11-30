const mongoose = require('mongoose');
const Movie = require('./models/movie');

const initialize = (connectionUrl, res, next) => {
    mongoose.connect(connectionUrl).then(() => {
        next();
    }).catch((err) => {
        res.status(500).send({
            error: err
        })
    })
}

const addNewMovie = async(data) => {
    let result;
    await Movie.create(data).then((movie) => {
        result = movie;
        console.log("Movie has been added successfully!")
    }).catch((err) => {
        result = err;
    })
    return result;
}

const getAllMovies = async(page, perPage, title) => {
    let result = [];
    if(title && title.trim()){
        await Movie.findOne({title: title}).skip(perPage *(page - 1)).limit(perPage).lean().exec().then((movie) => {
            if(movie){
                result.push(movie)
            }
        }).catch((err) => {
            result = err;
        })
    }else{
        await Movie.find().sort({"_id": 1}).skip(perPage *(page - 1)).limit(perPage).lean().exec().then((movies) => {
            if(movies.length > 0){
                result.push(movies)
            }
        }).catch((err) => {
            result = err;
        })
    }
    return result;
}

const getMovieById = async(id) => {
    let result = []
    await Movie.findById(id).lean().exec().then((movie) => {
        if(movie){
            result.push(movie);
        }
    }).catch((err) => {
        result = err;
    })
    return result;
}

const updateMovieById = async(data, id) => {
    let result;
    await Movie.findByIdAndUpdate(id, data).exec().then((movie) => {
        result = getMovieById(movie._id);
        console.log("Movie has been updated successfully!");
    }).catch((err) => {
        result = err;
    })
    return result;
}

const deleteMovieById = async(id) => {
    let res = false;
    await Movie.findById(id).exec().then(async(movie) => {
        await Movie.deleteOne({"_id": id}).exec().then((result) => {
            if(result.deletedCount != 0)
                res = true;
        })
    })
    return res;
}

module.exports = {
    initialize,
    addNewMovie,
    getAllMovies,
    getMovieById,
    updateMovieById,
    deleteMovieById
};