const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path')

const app = express();
const { createClient } = require("redis")
const redisClient = createClient({ url: process.env.REDIS_URL, legacyMode: true })
const RedisStore = require("connect-redis")(session);
redisClient.connect().catch(console.error)

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const Message = require('./modules/Chat/Message/service')

const routesUser = require('./modules/UserModule/router');
const routesAdvertisements = require('./modules/Advertisement/router');
const routesMessage = require('./modules/Chat/Message/route');
const routesChat = require('./modules/Chat/router');

app.use(bodyParser.json());
// app.use(cookieParser());
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

app.get('/', (req, res) => {
    console.log('reqUser', req.user);
    console.log('session', req.session);
    if(!req.session.passport.user) {return res.sendFile(path.resolve(__dirname, './client/home.html'))}
    else {return res.sendFile(path.resolve(__dirname, './client/chat.html'))}
})
app.get('/signin', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/signin.html'))
})
app.get('/signup', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/signup.html'))
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('sendMessage', async (msg) => {
        console.log(msg);
        const newMessage = await Message.sendMessage(msg)
        console.log(newMessage);
        if (newMessage.status === 'ok') {
            msg.type = 'newMessage';
            socket.emit('newMessage', msg);
        }
    })

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