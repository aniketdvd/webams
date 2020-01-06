if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./user-auth/passport-config');
const favicon = require('serve-favicon');
const userFunctions = require('./db-conf/userFunctions');
const clientTicketActions = require('./ticket-actions/ClientTicketActions');
// const supportTicketActions = require('./ticket-actions/SupportTicketActions');
const connection = require('./db-conf/connect');
const query = require('./db-conf/queries.json');
const webamsVersion = require('./package.json').version;
//serves the favicon
app.use(favicon(path.join(__dirname, 'public', 'webams.svg')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'tempsessionsecret',
    resave: false,
    saveUninitialized: false
}));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());

let installationStatus = () => {
    if(fs.existsSync('.env')) {
        return true;
    } else {
        console.error('WebAMS is not installed or configured!');
        return false;
    }
}

app.get('/install', (req, res) => {
    if(installationStatus() === true) {
        res.redirect('/');
    }
    res.render('INSTALL.ejs', {
        version: webamsVersion
    });
})

app.get('/', (req, res) => {
    if(installationStatus() === true) {
        initializePassport(
            passport,
            email => users.find(user => user.email === email),
            id => users.find(user => user.id === id)
        );
        refreshUserList();
        res.redirect('/dashboard');
    } else {
        res.redirect('/install');
    }
})

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

let users = new Object;

let userTickets = new Object;

let refreshUserList = () => {
    connection.query(query.sqlGetUser, function(err, result) {
        if(err) {
            throw console.warn(err);
        }
        users = result;
        console.log("::Updated users list::\n");
    });
}
<<<<<<< HEAD
=======

let refreshUserTicketList = (userid) => {
    connection.query(query.sqlGetTicketByUser, userid, function (err, result) {
        if (err) {
            throw console.warn(err);
        }
        userTickets = result;
        console.log("::Refreshed user ticket list::");
    })
}

let reportingDate = () => {
    let da = new Date();
    /* Custom Date Formatting */
    return da.getDate() + '-' + (da.getMonth()+1) + '-' + da.getFullYear();
}

let reportingTime = () => {
    let ti = new Date();
    /* Custom Time formatting */
    return ti.getHours() + ':' + ti.getMinutes();
}

let id = () => {
    return Date.now().toString();
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
>>>>>>> 9c496b39c102d5fe6478b5acff822973619d4ba4

app.get('/dashboard', checkAuthenticated, (req, res) => {
    if (req.user.role === "client") {
        refreshUserTicketList(req.user.id);
        res.render('Index.ejs', { 
            name: req.user.name,
            version: webamsVersion
        });
    } else if (req.user.role === "dev") {
        res.render('IndexDev.ejs', { 
            name: req.user.name,
            version: webamsVersion
        });
    }
})

app.get('/report', checkAuthenticated, (req, res) => {
    if (installationStatus() === true) {
        res.render('NewTicket.ejs', {
            name: req.user.name,
            email: req.user.email,
            version: webamsVersion
        });
    }
})

app.post('/newticket', checkAuthenticated, (req, res) => {
    try {
        clientTicketActions.pushTicket(
            id(),
            req.user.id,
            req.body.title,
            req.body.description,
            reportingDate(),
            reportingTime(),
            req.body.priority,
            'reported'
        );
        res.redirect('/');
    } catch (err) {
        console.warn(err);
        res.redirect('/report');
    }
})

app.post('/history', checkAuthenticated, (req, res) => {
    if(req.user.role === "client") {
        res.render('ViewTickets.ejs', {
            name: req.user.name,
            email: req.user.email,
            version: webamsVersion,
            tickets: userTickets
        });
    } else {
        res.render('AllTickets.ejs', {
            name: req.user.name,
            email: req.user.email,
            version: webamsVersion
            // tickets: userTickets
        })
    }
})

app.post('/feedback', checkAuthenticated, (req, res) => {
    if(req.user.role === "client") {
        res.render('Feedback.ejs', {
            name: req.user.name,
            email: req.user.email,
            version: webamsVersion
        });
    }
})

app.post('/issues', checkAuthenticated, (req, res) => {
    if(req.user.role === "dev") {
        res.render('ReviewTickets.ejs', {
            name: req.user.name,
            email: req.user.email,
            version: webamsVersion
            // tickets: allTickets
        });
    }
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    if (installationStatus() === true) {
        res.render('Login.ejs', {
            version: webamsVersion
        });
    }
    res.redirect('/install');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    if (installationStatus() === true) {
        res.render('Register.ejs', {
            version: webamsVersion
        });
    }
    res.redirect('/install');
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

app.use((req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.render('404.ejs', { 
            url: req.url,
            version: webamsVersion
        });
        return;
    }
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}

app.listen(3000);