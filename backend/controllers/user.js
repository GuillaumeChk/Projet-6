const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
    // console.log(req.body);
    const regexMail = new RegExp('(.+)@(.+){2,}\.(.+){2,}');
    const regexMdp = new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])([A-Za-z0-9]){8,}$');
    // console.log(regexMail.test(req.body.email));
    // console.log(regexMdp.test(req.body.password));
    if (regexMail.test(req.body.email) && regexMdp.test(req.body.password)) {
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé.' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
    else 
    {
      console.log("Mdp ou email incorrect");
      res.status(400).json({ message: 'Mot de passe et/ou email incorrect'});
    }
  };

  exports.login = (req, res, next) => {
    const regexMail = new RegExp('(.+)@(.+){2,}\.(.+){2,}');
    const regexMdp = new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])([A-Za-z0-9]){8,}$');
    if (regexMail.test(req.body.email) && regexMdp.test(req.body.password)) {
      User.findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
          }
          bcrypt.compare(req.body.password, user.password)
            .then(valid => {
              if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
              }
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  process.env.ACCESS_TOKEN_SECRET,
                  { expiresIn: '24h' }
                )
              });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
    else 
    {
      console.log("Mdp ou email incorrect");
      res.status(400).json({ message: 'Mot de passe et/ou email incorrect'});
    }
  };