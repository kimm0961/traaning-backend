// require('dotenv').config()

var cors = require('cors')
const express = require('express')
const app = express()

// Mongoose og DB
const mongoose = require('mongoose')

// // Localhost-databasen:
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  })

// Atlas-databasen (remote)
mongoose.connect(process.env.DATABASE_URL_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))



// App use
app.use(cors({ credentials: true, origin: true }));
app.use(express.static('public')); // statiske filer - upload billder til backend
app.use(express.json()) // nødevndig når post data er i json
app.use(express.urlencoded({extended: true})) // ellers er req.body undefined eller tom

app.set('trust proxy', 1);

const session = require('express-session');

// for at bruge mongo som store for session - isf hukommelsen som ikke dur på fx heroku
const MongoStore = require('connect-mongo')(session);


const TWO_HOURS = 1000 * 60 * 60 * 2;

// const {
//     PORT = 3033,
//     NODE_ENV = 'development',
//     SESS_NAME = 'sid',
//     SESS_SECRET = 'ssh!quiet,it\'asecret!',
//     SESS_LIFETIME = TWO_HOURS
// } = process.env

const IN_PROD = process.env.NODE_ENV === 'production'



// Session
app.use(session({
    name: process.env.SESS_NAME,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: db}),
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: "none",
        secure: IN_PROD,
        httpOnly: true
    }
}))

//route indeholder ordet admin

app.use('*/admin*', (req, res, next) => {

    // hvis der ikke er en session
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Du har ikke adgang - skal være logget ind'})
    }

    // hvis der er en session... så bare fortsæt arbejdet
    next();
})

// Routes

const brugerRouter = require('./routes/bruger')
app.use('/admin/bruger', brugerRouter)

const oevelserRouter = require('./routes/oevelser')
app.use('/oevelser', oevelserRouter)

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

// PORT

app.listen(process.env.PORT, () => console.log('Server Started'))