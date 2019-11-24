if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
  
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const favicon = require('serve-favicon');
const path = require('path');
const userFunctions = require('./db-conf/userFunctions');
const connection = require('./db-conf/connect');

//serves the favicon
app.use(favicon(path.join(__dirname, 'public', 'webams.svg')));
app.use('/static', express.static(path.join(__dirname, 'public')));

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

let users = new Object;
const sqlGetUser = "SELECT * FROM customers";
let refreshUserList = () => {
    connection.query(sqlGetUser, function(err, result) {
        if(err) {
            throw console.warn(err);
        }
        users = result;
        console.log("::Updated users list::\n", users);
    });
}
refreshUserList();

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
    if (req.user.role === "client") {
        res.render('Index.ejs', { name: req.user.name });
    } else if (req.user.role === "dev") {
        res.render('IndexDev.js', { name: req.user.name });
    }
})

app.get('/report', checkAuthenticated, (req, res) => {
    res.render('NewTicket.ejs', {
        name: req.user.name
    }); 
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('Login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('Register.ejs');
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        userFunctions.addUser(Date.now().toString(), req.body.email, req.body.name, hashedPassword, "client");
        refreshUserList();
        res.redirect('/login');
    } catch(err) {
        res.redirect('/register');
    }
})

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000);