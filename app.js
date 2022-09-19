const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var path = require('path')
var session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session)
const app = express()

const route = require("./route/route");
const cors = require('cors')
const config = require('./config.json')
const db = require('./utils/database')

app.enable('trust proxy')
app.use(cors({
    origin: '*'
}));

app.disable('x-powered-by')

var dbUrl = db.dbNameUrl()

var store = new MongoDBStore({
  uri: dbUrl,
  collection: 'sessions',
})

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json({ limit: '50mb' }))

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/route', route)
//setup public folder

app.use(
  session({
    secret: config.encryption.session.secret,
    store: store,
    resave: false,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: parseInt(config.encryption.session.maxage),
      secure: config.encryption.session.secure,
    },
  })
)

db.mongoConnect((db) => {
  app.db = db
  app.listen(config.port || 5120)
  console.log("connected database")
})
