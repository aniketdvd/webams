if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log("WEBAMS has started!\n");

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./user-auth/passport-config');
const favicon = require('serve-favicon');
const path = require('path');
const userFunctions = require('./db-conf/userFunctions');
const clientTicketActions = require('./ticket-actions/ClientTicketActions');
// const supportTicketActions = require('./ticket-actions/SupportTicketActions');
const connection = require('./db-conf/connect');
const query = require('./db-conf/queries.json');
const webamsVersion = require('./package.json').version;
//serves the favicon
app.use(favicon(path.join(__dirname, 'public', 'webams.svg')));
app.use('/static', express.static(path.join(__dirname, 'public')));

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

let users = new Object;

let userTickets = new Object;

// let thisTicket = new Object;

let refreshUserList = () => {
    connection.query(query.sqlGetUser, function(err, result) {
        if(err) {
            throw console.warn(err);
        }
        users = result;
        console.log("::Updated users list::\n");
    });
}

let refreshUserTicketList = (userid) => {
    connection.query(query.sqlGetTicketByUser, userid, function (err, result) {
        if (err) {
            throw console.warn(err);
        }
        userTickets = result;
        console.log("::Refreshed user ticket list::");
    })
}

let refreshUnresolvedTicketList = (userid) => {
    connection.query(query.sqlGetUnresolvedTickets, function (err, result) {
        if (err) {
            throw console.warn(err);
        }
        allTickets = result;
        console.log("::Refreshed all tickets list::");
    })
}

let refreshResolvedTicketList = (userid) => {
    connection.query(query.sqlGetResolvedTickets, function (err, result) {
        if (err) {
            throw console.warn(err);
        }
        resolvedTickets = result;
        console.log("::Refreshed all tickets list::");
    })
}

// let getCurrentTicket = (tid, callback) => {
//     connection.query(query.sqlGetTicket, tid, function(err, result) {
//         if(err) {
//             throw console.warn(err);
//         }
        
//         return result;
//     });
// }


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

refreshUnresolvedTicketList();
refreshResolvedTicketList();
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
        refreshUserTicketList(req.user.id);
        res.render('Index.ejs', { 
            name: req.user.name,
            version: webamsVersion
        });
    } else if (req.user.role === "dev") {
        refreshUnresolvedTicketList();
        res.render('IndexDev.ejs', { 
            name: req.user.name,
            version: webamsVersion
        });
    }
})

app.get('/report', checkAuthenticated && checkClientUserRole, (req, res) => {
    res.render('NewTicket.ejs', {
        name: req.user.name,
        email: req.user.email,
        version: webamsVersion
    });
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
        refreshUnresolvedTicketList();
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
        res.render('ResolvedTickets.ejs', {
            name: req.user.name,
            email: req.user.email,
            version: webamsVersion,
            tickets: resolvedTickets
        })
    }
})

app.post('/feedback', checkAuthenticated && checkClientUserRole, (req, res) => {
    if(req.user.role === "client") {
        res.render('Feedback.ejs', {
            name: req.user.name,
            email: req.user.email,
            version: webamsVersion
        });
    }
})

app.post('/issues', checkAuthenticated, (req, res) => {
    refreshUnresolvedTicketList();
    if(req.user.role === "dev") {
        res.render('ReviewTickets.ejs', {
            name: req.user.name,
            email: req.user.email,
            version: webamsVersion,
            tickets: allTickets,
            ulist: users
        });
    }
})

app.post('/ticket', checkAuthenticated, (req, res) => {
    if(req.user.role === "dev") {
        let tid = req.query.tid;
        var ticketIndex = allTickets.findIndex(p => p.ticketid == tid);
        res.render('Ticket.ejs', {
            version: webamsVersion,
            tickets: allTickets,
            eth: ticketIndex
        });
    }
})

app.post('/updateTicket', checkAuthenticated && checkSupportUserRole, (req, res) => {
    connection.query(query.sqlUpdateTicket, 
        [
            req.body.changePriority,
            req.body.changeStatus,
            req.query.tid
        ], (err, res) => {
            if (err) {
                throw err;
            }
            console.log("::Ticket updation successful::");
        }        
    );
    refreshUnresolvedTicketList(),
    res.redirect('/');
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('Login.ejs', {
        version: webamsVersion
    });
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('Register.ejs', {
        version: webamsVersion
    });
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

function checkClientUserRole(req, res, next) {
    if(req.user.role === 'client') {
        return next();
    }
    res.redirect('/lost');
}

function checkSupportUserRole(req, res, next) {
    if(req.user.role === 'dev') {
        return next();
    }
    res.redirect('/404');
}

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