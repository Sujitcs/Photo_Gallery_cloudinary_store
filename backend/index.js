const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const userRouter = require('./routes/user.route');
const imageRouter = require('./routes/image.route');
const categoryRouter = require('./routes/category.route');

dotenv.config();

const app = express();

// CORS configuration to allow requests from your frontend
const allowedOrigins = ['https://srijani-bandyopadhya.vercel.app'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', userRouter, imageRouter, categoryRouter);

app.get('/', (req, res) => {
    res.send('welcome');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
