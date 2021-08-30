const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://Gui:motdepasse@cluster0.2klb8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB : réussie.'))
  .catch(() => console.log('Connexion à MongoDB : échouée.'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

// app.use('/api/sauces', (req, res, next) => {
//   const sauces = [
//     {
//       _id: 'oeihfzeoi',
//       name: 'Mon premier objet',
//       description: 'Les infos de mon premier objet',
//       manufacturer: 'Les infos de mon premier objet',
//       imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//       heat: 4,
//       mainPepper: 'piment',
//       userId: 'qsomihvqios',
//     },
//     {
//       _id: 'oeihfzeomoihi',
//       name: 'Mon deuxième objet',
//       description: 'Les infos de mon deuxième objet',
//       manufacturer: 'Les infos de mon deuxième objet',
//       imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//       heat: 2,
//       mainPepper: 'tomate',
//       userId: 'qsomihvqios',
//     },
//   ];
//   res.status(200).json(sauces);
// });

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;