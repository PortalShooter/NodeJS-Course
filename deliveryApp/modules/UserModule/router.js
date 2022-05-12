const express = require('express');
const router = express.Router();
const User = require('./model');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const salt = 'f844b09ff50c';

passport.use(new LocalStrategy(
	function(email, password, done) {
		User.findOne({ email }, (err, user) => {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			if (user.password !== crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`)) { return done(null, false); }
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, cb) {
	process.nextTick(function() {
        passport.authenticate('local'),
        console.log('user', user);
	    cb(null, { id: user.id, emai: user.email });
	});
});
  
passport.deserializeUser(function(user, cb) {
	process.nextTick(function() {
		return cb(null, user);
	});
});

router.post('/signup', async (req, res) => {
    const {email, password, name, contactPhone} = req.body

    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

    const newUser = new User({
        email, passwordHash, name, contactPhone
    })

    try {
        await newUser.save();
        const {_id, email, name, contactPhone} = newUser
        res.json({
            data: {
                id: _id, email, name, contactPhone
            },
            status: 'ok'
        })
    } catch (e) {
        console.error(e);
        res.json({
            "error": "email занят",
            "status": "error"
        })
    }
})

// router.post('/signin', (req, res) => {

//     const {email, password} = req.body

//     User.findOne({
//         email,
//         password: crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`)
//     }).then(user => {
//         const {_id, email, name, contactPhone} = user


//         res.json({
//             data: {id: _id, email, name, contactPhone},
//             status: 'ok'
//         })
//     }).catch(err => {
//         res.json({
//             "error": "Неверный логин или пароль",
//             "status": "error"
//         })
//     })


// })

router.post('/signin', 
    passport.authenticate('local'),
    function(req, res) {
        console.log(req.body);
        res.json(req.body)
    }
)




module.exports = router;