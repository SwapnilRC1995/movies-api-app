const mongoose = require('mongoose');
const User = require('./models/user');

const initialize = (connectionUrl, res, next) => {
    mongoose.connect(connectionUrl).then(() => {
        next();
    }).catch((err) => {
        res.status(500).send({
            error: err
        })
    })
}

const addNewUser = async (data) => {
    let result;
    await User.create(data).then((movie) => {
        result = movie;
        console.log("User has been successfully registered!")
    }).catch((err) => {
        result = err;
    })
    return result;
}

const getUserByEmail = async (email) => {
    let result = [];
    await User.find({"email" : email}).lean().exec().then((user) => {
        if(user.length > 0 ){
            result = user
        }
    })
    return result[0];
}

const getUserByApiKey = async (key) => {
    let result = [];
    await User.find({"apiKey" : key}).lean().exec().then((user) => {
        if(user.length > 0 ){
            result = user
        }
    })
    return result[0];
}

module.exports = {
    initialize,
    addNewUser,
    getUserByEmail,
    getUserByApiKey
};

/******************************************************************************
***
* ITE5315 – Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Group member Name:Swapnil Roy Chowdhury, Sayani Pal Student IDs: N01469281, N01469469 Date: 12/06/2022
******************************************************************************
***/