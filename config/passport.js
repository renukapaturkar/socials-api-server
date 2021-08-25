const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const {User} = require('../models/user.model')


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = "kpnnvM1f/Vu0KRA1SWjGMGNwk0Hx2VAjsUTg+WQAEv7DrWbJsqzXMNg1dSPCwGbrNuVZvAysWO7vUf3BIRRMoWvhXa7ojwJ4zhaCCwCLUkF2o80MKs7cdVC3nuIs1JRnUA1ouarlYe+IT7pzPcRiQevm4gYvx/s6MX42yJwxayJndINJg/X6EzkCls67znxEThsrotMIBsD+BUqZuESE3i51SXEuVxqWjdbOMWROeHy8UKuCz4TFwlIj0/27BHqN1qf7x5NG59rZzEpQtAgG/70KSopDUsXu9WG6IwXzLdClZ4+CkUXUaz7yeUshZq3ukag64Szv/UX/CHacw5kH1A=="

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.userId}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));