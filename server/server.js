const express = require('express');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

const models = require('./models');
const schema = require('./schema/schema');

require('dotenv').config();

const app = express();

const MONGO_URI = process.env.MONGO_URI;

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI, { useMongoClient: true });
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'aaabbbccc',
    store: new MongoStore({
      url: MONGO_URI,
      autoReconnect: true,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
