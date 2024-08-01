const express = require('express');
const router = express.Router();
const fs = require('firebase-admin');
const axios = require('axios');
const db = fs.firestore();

router.get('/', async (req, res) => {
  try {
    // Lakukan permintaan HTTP menggunakan Axios
    const response = await axios.get('https://goldenrod-careful-lettuce.glitch.me/health/stat'); // Ganti URL_API_HEALTH dengan URL sebenarnya

    // Ambil data health dari respons
    const health = response.data;
    console.log(health);
    // Kirim data health ke view index
    res.render('index', { health });
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).send('Error fetching health data: ' + error.message);
  }
});

router.get('/users', async (req, res) => {
    try {
      const usersSnapshot = await db.collection('users').get();
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.render('pages/users', { users });
    } catch (error) {
      res.status(500).send('Error fetching users: ' + error.message);
    }
  });

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      res.render('user', { user: { id: userDoc.id, ...userDoc.data() } });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching user: ' + error.message);
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const usersSnapshot = await db.collection('users').where('name', '>=', q).where('name', '<=', q + '\uf8ff').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.render('users', { users });
  } catch (error) {
    res.status(500).send('Error searching users: ' + error.message);
  }
});

module.exports = router;
