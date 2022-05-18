const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const UserModule = require('./service')

const salt = 'f844b09ff50c';

passport.use('local', new LocalStrategy(
    {
		usernameField: 'email',
		passwordField: 'password'
	},
	async function(email, password, done) {
        const user = await UserModule.findByEmail(email)

        if (!user) { return done(null, false); }
        const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, `sha256`).toString(`hex`)
        if (user.passwordHash !== hash) { return done(null, false); }
        return done(null, user);
	}
));

passport.serializeUser(function(user, cb) {
	process.nextTick(function() {
	    cb(null, { id: user._id });
	});
});
  
passport.deserializeUser(function(user, cb) {
	process.nextTick(function() {
		return cb(null, user);
	});
});

router.post('/signup', async function(req, res) {
    const user = await UserModule.create(req)
    if(!user) {
        res.json({
            error: "email занят",
            status: "error"
        })
    }
    if (user) {
        const {_id, email, name, contactPhone} = user
        console.log('user', user);
        res.json({
            data: {
                id: _id, email, name, contactPhone
            },
            status: 'ok'
        })
    }  
});

router.post('/signin', function(req,res,next) {
    passport.authenticate('local', function(err, user) {
            if(!user) {
                res.json({
                    "error": "Неверный логин или пароль",
                    "status": "error"
                });
            } 
            if(user) {
                const {_id, email, name, contactPhone} = user

                res.json({
                    data: {id: _id, email, name, contactPhone},
                    status: 'ok'
                })
            };
    })(req,res,next);
});

module.exports = router;