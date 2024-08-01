const express = require('express');
const path = require('path');
const morgan = require('morgan');

const fs = require('firebase-admin');
const serviceAccount = require('./config/key.json');
const http = require('http');
const cors = require('cors');


// Inisialisasi Firebase
fs.initializeApp({
  credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
// Middleware
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');


const webRoute = require('./routes/webRoute');

app.use('/', webRoute); 


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
