require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const port = process.env.PORT || 5000

const connectDB = require('./db/connect');
const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.listen(port, async () => {
    console.log('Server is running on port 5000');
})