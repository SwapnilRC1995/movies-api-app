const express = require('express');
const {body, query, validationResult} = require('express-validator');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

// Create router
let app = express();

// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' })); 

app.use(express.static(path.join(__dirname, 'public')));

// Handle cors [allow all access]
const cors = require('cors');
app.use(cors());


const db = require('./movieDAO.js');
const init = (req, res, next) => {
    db.initialize(process.env.CONNECTION_STRING, res, next);
}

const exphbs = require('express-handlebars');

const HBS = exphbs.create({
    //Create custom HELPER
    extname: '.hbs',
    helpers:{
        dateConvert: function(options){
            let date = new Date(options.fn.this);
            return date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
        },
       change: function(options){
        if(!options.fn(this) && !options.fn(this).trim())
            return `<p style='color:red'>No Data</p>`;
        else
            return options.fn(this);
}
       } 
});

app.engine('.hbs', HBS.engine)

// setting up express handlebars as a view engine for the express app
app.set('view engine', 'hbs');


// Configuring routes
app.post('/api/movies',
init,
body('title').trim().escape().notEmpty().withMessage('Field cannot be empty'), 
body('plot').trim().escape().optional().default(""),
body('genres').trim().escape().optional().default(""),
body('runtime').trim().escape().optional().isInt().default(0),
body('cast').trim().escape().optional().default(""),
body('num_mflix_comments').trim().escape().notEmpty().withMessage('Field cannot be empty').isInt().withMessage('Field must be integer'),
body('poster').trim().optional().isURL().withMessage('Must be an URL').default(""),
body('fullplot').trim().escape().optional().default(""),
body('languages').trim().escape().optional().default(""),
body('released').trim().escape().optional().isISO8601().withMessage("Field must be of date type"),
body('directors').trim().escape().optional().default(""),
body('writers').trim().escape().optional().default(""),
body('lastupdated').trim().escape().default(new Date().toISOString()).isISO8601().withMessage("Field has to have a valid date"),
body('year').trim().escape().notEmpty().isInt().withMessage('Field has to be a valid integer'),
body('countries').trim().escape().notEmpty().withMessage("Field cannot be empty"),
body('type').trim().escape().notEmpty().withMessage("Field cannot be empty"),
body('metacritic').trim().escape().optional().default(""),
body('rated').trim().escape().optional().default(""),
body('rating').trim().escape().optional().default(0.0).isDecimal().withMessage("Field has to be a valid decimal"),
body('votes').trim().escape().optional().default(0).isInt().withMessage("Field has to be a valid integer"),
body('id').trim().escape().optional().default(0).isInt().withMessage("Field has to be a valid integer"),
body('wins').trim().escape().notEmpty().withMessage("Field cannot be empty").isInt().withMessage("Field has to be an integer"),
body('nominations').escape().trim().notEmpty().withMessage("Field cannot be empty").isInt().withMessage("Field has to be an integer"),
body('text').trim().escape().notEmpty().withMessage("Field cannot be empty"),
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    let data = {
        title: req.body.title.trim(),
        plot: req.body.plot.trim(),
        genres: splitMultipleFields(req.body.genres),
        runtime: req.body.runtime.trim(),
        cast: splitMultipleFields(req.body.cast),
        num_mflix_comments: req.body.num_mflix_comments.trim(),
        poster: req.body.poster,
        fullplot: req.body.fullplot.trim(),
        languages: splitMultipleFields(req.body.languages),
        released: req.body.released,
        directors: splitMultipleFields(req.body.directors),
        writers: splitMultipleFields(req.body.writers),
        lastupdated: req.body.lastupdated,
        year: req.body.year.trim(),
        countries: splitMultipleFields(req.body.countries),
        type: req.body.type.trim(),
        metacritic: req.body.metacritic.trim(),
        rated: req.body.rated.trim(),
        imdb: {
            id: req.body.id.trim(),
            rating: req.body.rating.trim(),
            votes: req.body.votes.trim()
        },
        awards: {
            wins: req.body.wins.trim(),
            nominations: req.body.nominations.trim(),
            text: req.body.text.trim()
        }
    };
    let result = await db.addNewMovie(data);
    res.status(201).send(result);
})

app.get('/api/moviesForm', (req, res) => {
    res.render('movies-form',{});
});

app.get('/api/movies', 
init,
query('page').trim().escape().notEmpty().withMessage('Page number cannot be left blank'),
query('perPage').trim().escape().notEmpty().withMessage('Movies per page cannot be left blank'),
query('title').trim().escape().optional().default(""),
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    let page = req.query.page;
    let perPage = req.query.perPage;
    let title = req.query.title || "";
    if(page && page.trim() && perPage && perPage.trim()){
        let movies = await db.getAllMovies(page, perPage, title)
        if(req.query.view === "true"){
            res.render('data', {title: 'Movies', movies: movies});
        }else{
            res.send(movies)
        }
    }else{

    }
})

app.get('/api/movies/:movie_id', init, async(req, res) => {
    let id = req.params.movie_id;
    if(id && id.trim()){
        let movie = await db.getMovieById(id);
        res.send(movie);
    }else{

    }
})

app.put('/api/movies/:movie_id', 
init,
body('title').trim().escape().notEmpty().withMessage('Field cannot be empty'), 
body('plot').trim().escape().optional().default(""),
body('genres').trim().escape().optional().default(""),
body('runtime').trim().escape().optional().isInt().default(0),
body('cast').trim().escape().optional().default(""),
body('num_mflix_comments').trim().escape().notEmpty().withMessage('Field cannot be empty').isInt().withMessage('Field must be integer'),
body('poster').trim().optional().isURL().withMessage('Must be an URL').default(""),
body('fullplot').trim().escape().optional().default(""),
body('languages').trim().escape().optional().default(""),
body('released').trim().escape().optional().isISO8601().withMessage("Field must be of date type"),
body('directors').trim().escape().optional().default(""),
body('writers').trim().escape().optional().default(""),
body('lastupdated').trim().escape().default(new Date().toISOString()).isISO8601().withMessage("Field has to have a valid date"),
body('year').trim().escape().notEmpty().isInt().withMessage('Field has to be a valid integer'),
body('countries').trim().escape().notEmpty().withMessage("Field cannot be empty"),
body('type').trim().escape().notEmpty().withMessage("Field cannot be empty"),
body('metacritic').trim().escape().optional().default(""),
body('rated').trim().escape().optional().default(""),
body('rating').trim().escape().optional().default(0.0).isDecimal().withMessage("Field has to be a valid decimal"),
body('votes').trim().escape().optional().default(0).isInt().withMessage("Field has to be a valid integer"),
body('id').trim().escape().optional().default(0).isInt().withMessage("Field has to be a valid integer"),
body('wins').trim().escape().notEmpty().withMessage("Field cannot be empty").isInt().withMessage("Field has to be an integer"),
body('nominations').escape().trim().notEmpty().withMessage("Field cannot be empty").isInt().withMessage("Field has to be an integer"),
body('text').trim().escape().notEmpty().withMessage("Field cannot be empty"),
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    let id = req.params.movie_id;
    if(id && id.trim()){
        let data = {
            title: req.body.title.trim(),
            plot: req.body.plot.trim(),
            genres: splitMultipleFields(req.body.genres),
            runtime: req.body.runtime.trim(),
            cast: splitMultipleFields(req.body.cast),
            num_mflix_comments: req.body.num_mflix_comments.trim(),
            poster: req.body.poster,
            fullplot: req.body.fullplot.trim(),
            languages: splitMultipleFields(req.body.languages),
            released: req.body.released,
            directors: splitMultipleFields(req.body.directors),
            writers: splitMultipleFields(req.body.writers),
            lastupdated: req.body.lastupdated,
            year: req.body.year.trim(),
            countries: splitMultipleFields(req.body.countries),
            type: req.body.type.trim(),
            metacritic: req.body.metacritic.trim(),
            rated: req.body.rated.trim(),
            imdb: {
                id: req.body.id.trim(),
                rating: req.body.rating.trim(),
                votes: req.body.votes.trim()
            },
            awards: {
                wins: req.body.wins.trim(),
                nominations: req.body.nominations.trim(),
                text: req.body.text.trim()
            }
        };
        let movie = await db.updateMovieById(data, id);
        res.status(204).send(movie);
    }
    
})

app.delete('/api/movies/:movie_id', init, async(req, res) => {
    let id = req.params.movie_id;
    if(id && id.trim()){
        let movie = await db.deleteMovieById(id);
        res.status(202).send(movie);
    }else{

    }
})

app.all('*', (req, res) => {
    res.status(404).send({
        error: "Oops! Route not found"
    })
})

const splitMultipleFields = (entries) => {
    if(entries){
        let result = entries.split(',')
        result = result.map(r => {
            return r.trim();
        });
        return result;
    }else{
        return [];
    }
    
}
// Export router
module.exports = app;