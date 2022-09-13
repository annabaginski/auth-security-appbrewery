//jshint esversion:6

//SET UP AND REQUIRE PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
require('dotenv').config();

const app = express();

//SET UP MIDDLEWARE

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true})

//SCHEMAS

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

//GETS

app.get('/', (req, res) => {
    res.render("home")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.get('/register', (req, res) => {
    res.render("register")
})

//POSTS

app.post('/register', (req,res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save( (err) => {
        if (err) {
            console.log(err);
        }else {
            res.render('secrets')
        }
    })
})

app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err,foundUser) => {
        if (err) {
            console.log(err);
        }else {
            if (foundUser) {
                if (foundUser.password === password){
                    res.render('secrets')
                }
            }
        }

    })
})

//CREATE LISTENING PORT

app.listen(3000, () => {
    console.log('App running on port 3000');
})