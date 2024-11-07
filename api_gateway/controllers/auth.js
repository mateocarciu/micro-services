const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// Login
exports.login = (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Incorrect username/password' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Incorrect email/password' });
                    } else {
                        const token = jwt.sign(
                            { userId: user._id,
                              role:  user.role 
                             },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        );



                        res.status(200).json({
                            message: "User successfully logged in!",
                            data: {
                                userId: user._id,
                                email: user.email,
                                lastname: user.lastname,
                                firstname: user.firstname,
                                role: user.role,
                                auth_token: token
                            }
                        });
                    }
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// Signup
exports.signup = (req, res, next) => {
    if (!req.body.password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                adresse: req.body.adresse,
                phoneNumber: req.body.phoneNumber,
                role: req.body.role
            });
            user.save()
                .then(() => res.status(201).json({ message: 'User created successfully!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error: error }));
};



