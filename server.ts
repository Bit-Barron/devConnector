import connectDB from './config/db';

import bodyParser from 'body-parser';
import express from 'express';

import users from './routes/api/users';
import profile from './routes/api/profile';
import posts from './routes/api/posts';
import auth from './routes/api/auth';

const app = express();

// configure the app to use bodyParser()

app.use(bodyParser.json());

connectDB();

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
