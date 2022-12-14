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

const addNewMovie = async (data) => {
    let result;
    await Movie.create(data).then((movie) => {
        result = movie;
        console.log("Movie has been added successfully!")
    }).catch((err) => {
        result = err;
    })
    return result;
}

const getAllMovies = async (page, perPage, title) => {
    let result = [];
    await Movie.find().sort({ "_id": 1 }).skip(perPage * (page - 1)).limit(perPage).lean().exec().then((movies) => {
        if (title && title.trim()) {
            movies.forEach((movie) => {
                if(movie.title === title){
                    result.push(movie);
                }
            })
        }else{
            if (movies.length > 0) {
                result = movies;
            }
        }
    }).catch((err) => {
        result = err;
    })
    return result;
}

const getMovieById = async (id) => {
    let result = []
    await Movie.findById(id).lean().exec().then((movie) => {
        if (movie) {
            result.push(movie);
        }
    }).catch((err) => {
        result = err;
    })
    return result;
}

const updateMovieById = async (data, id) => {
    let result;
    await Movie.findByIdAndUpdate(id, data).exec().then((movie) => {
        result = getMovieById(movie._id);
        console.log("Movie has been updated successfully!");
    }).catch((err) => {
        result = err;
    })
    return result;
}

const deleteMovieById = async (id) => {
    let res = false;
    await Movie.findById(id).exec().then(async (movie) => {
        await Movie.deleteOne({ "_id": id }).exec().then((result) => {
            if (result.deletedCount != 0)
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

/******************************************************************************
***
* ITE5315 ??? Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Group member Name:Swapnil Roy Chowdhury, Sayani Pal Student IDs: N01469281, N01469469 Date: 12/06/2022
******************************************************************************
***/