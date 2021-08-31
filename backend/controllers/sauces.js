const Thing = require('../models/Things');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// name: req.body.name,
// manufacturer: req.body.manufacturer,
// description: req.body.description,
// imageUrl: req.body.imageUrl,
// mainPepper: req.body.mainPepper,
// heat: req.body.heat,
// userId: req.body.userId

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  thing.save()
  .then(() => { res.status(201).json({
        message: 'Post saved successfully!'
  });})
  .catch((error) => { res.status(400).json({ error: error });});
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  // console.log(req.body);
  Thing.findOne({ _id: req.params.id })
  .then((sauce) => { 
    console.log("sauce: " + sauce);
    if (req.body.like === 1) { /// like
      // console.log(sauce.userId + req.body.userId);
      // console.log(sauce.usersLiked.includes(req.body.userId));
      if (!sauce.usersLiked.includes(req.body.userId)) {
        console.log("like ajout");
        sauce.usersLiked.push(req.body.userId);
        sauce.likes++;
        sauce.save()
          .then(() => res.status(200).json({ message: 'Sauce like'}))
          .catch(error => res.status(400).json({ error }));
        // const sauce2 = sauce;
        // console.log("sauce2: " + sauce2);
        // Thing.updateOne({ _id: req.params.id }, { ...sauce2, _id: req.params.id })
        //   .then(() => res.status(200).json({ message: 'Sauce like'}))
        //   .catch(error => res.status(400).json({ error }));
      }
      else { // inutile ?
        console.log("déjà like");
        res.status(200).json({ message: 'Sauce deja like'})
      }
    }
    else if (req.body.like === -1) { // dislike
      if (!sauce.usersDisliked.includes(req.body.userId)) {
        console.log("dislike ajout");
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes++;
        sauce.save()
          .then(() => res.status(200).json({ message: 'Sauce dislike'}))
          .catch(error => res.status(400).json({ error }));
      }
      else { // inutile ?
        console.log("déjà dislike");
        res.status(200).json({ message: 'Sauce deja dislike'})
      }
    }
    else { // annulation de dis/like
      if (sauce.usersLiked.includes(req.body.userId)) { // like
        console.log("annulation de like");
        sauce.likes--;
        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId),1);
        sauce.save()
          .then(() => res.status(200).json({ message: 'Sauce like annulé'}))
          .catch(error => res.status(400).json({ error }));
      }
      else { // dislike
        console.log("annulation de dislike");
        sauce.dislikes--;
        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId),1);
        sauce.save()
          .then(() => res.status(200).json({ message: 'Sauce dislike annulé'}))
          .catch(error => res.status(400).json({ error }));
      }
    }
  }, reason => {
    console.log(reason);
  })
  .catch((error) => { res.status(400).json({ error: error });});
};