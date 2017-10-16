const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const mail = require('./mail.js');
const User = mongoose.model('user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, 'Invalid credentials.');
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, 'Invalid credentials.');
      });
    });
  })
);

async function signup({ email, password, req }) {
  const user = await new User({ email, password });
  let token, host, tokenURL;
  if (!email || !password) {
    throw new Error('You must provide an email and password.');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered.');
  }
  await user.save();
  token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
    expiresIn: '12h'
  });
  console.log('headers', req.headers);
  host = req.headers['x-forwarded-host']
    ? req.headers['x-forwarded-host']
    : req.headers['host'];
  tokenURL = `http://${host}/token/${token}`;
  console.log('tokenURL ', tokenURL);
  await mail.send({
    user,
    filename: 'new-account',
    subject: 'New user Account',
    tokenURL,
  });
  return new Promise((resolve, reject) => {
    req.logIn(user, err => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

function login({ email, password, req }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (!user) {
        reject('Invalid credentials.');
      }

      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
}

async function loginWithLink({ token, req }) {
  let decodedToken, id;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    throw new Error('Invalid Token');
  }
  id = decodedToken.id;
  const user = await User.findById(id);
  return new Promise((resolve, reject) => {
    if (!user) {
      reject('Invalid credentials.');
    }

    req.login(user, () => resolve(user));
  });
}

async function updateAccount({ id, email, password }) {
  if (!email || email === '') {
    throw new Error('You must provide an email!');
  }
  const user = await User.findById(id);
  user.email = email;
  if (password !== '') {
    user.password = password;
  }
  return user.save();
}

module.exports = { signup, login, loginWithLink, updateAccount };
