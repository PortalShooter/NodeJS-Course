const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');


const app = express();
const { createClient } = require("redis")
const redisClient = createClient({ url: process.env.REDIS_URL, legacyMode: true })
const RedisStore = require("connect-redis")(session);
redisClient.connect().catch(console.error)

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const routesUser = require('./modules/UserModule/router');
const routesAdvertisements = require('./modules/Advertisement/router');
const routesMessage = require('./modules/Chat/Message/route');
const routesChat = require('./modules/Chat/router');

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

app.use('/api/chat', routesChat);
app.use('/api/message', routesMessage);
app.use('/api/advertisements', routesAdvertisements);
app.use('/api', routesUser);


io.on('connection', (socket) => {
    console.log('a user connected');
});

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
        server.listen(PORT, () => {
            console.log(`=== start server PORT ${PORT} ===`);
        });
    })
    .catch ((e) => {
        console.log('Error', e);
    })

})();