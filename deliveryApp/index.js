const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const app = express();
const RedisStore = require("connect-redis")(session);
const { createClient } = require("redis")
const redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

const routesUser = require('./modules/UserModule/router.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: "keyboard cat",
      resave: false,
    })
);

app.use('/api', routesUser);

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'delivery';
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/';


(async () => {

    mongoose.connect(HostDb, {
        user: UserDB,
        pass: PasswordDB,
        dbName: NameDB,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        app.listen(PORT, () => {
            console.log(`=== start server PORT ${PORT} ===`);
        });
    })
    .catch ((e) => {
        console.log('Error', e);
    })

})();