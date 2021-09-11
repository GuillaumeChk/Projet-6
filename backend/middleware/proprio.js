const jwt = require('jsonwebtoken');
const Thing = require('../models/Things');

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decodedToken.userId;
      Thing.findOne({
            _id: req.params.id
        }).then(
            (thing) => {
                if (thing.userId !== userId) {
                    throw 'user ID non proprietaire';
                } else {
                    next();
                }
            }
        ).catch(
            (error) => {
            res.status(403).json({
                error: error
            });
            }
        );
    } catch {
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  };