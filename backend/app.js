const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const myGredditRoutes = require('./routes/myGredditRoutes');
const savedPostsRoutes = require('./routes/savedPostsRoutes');
const subGredditRoutes = require('./routes/subGredditRoutes');

const app = express();
const dbURI = 'mongodb+srv://drbean:dass1234@assignment.twcj1fc.mongodb.net/?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(5000))
    .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', authRoutes);
app.use('/api', homeRoutes);
app.use('/api', profileRoutes);
app.use('/api', myGredditRoutes);
app.use('/api', savedPostsRoutes);
app.use('/api', subGredditRoutes);