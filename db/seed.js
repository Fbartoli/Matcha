const fetch = require('node-fetch');
// include the model (aka DB connection)
const uniqid = require('uniqid');
const usermodel = require('../models/usermodel');
const util = require('util');
const fs = require('fs');

const addPhoto = util.promisify(usermodel.addPhoto);
const addTags = util.promisify(usermodel.addInterest);
const addRelationship = util.promisify(usermodel.addRelationship);
const addLikeHistory = util.promisify(usermodel.addLikeHistory);
const addViewsHistory = util.promisify(usermodel.addViewHistory);

let gender = ['male', 'female', 'bisexual'];
let tags = ['#coding', '#cheval', '#got', '#pullrequest', '#travel', '#TV', '#chat', '#luxury', '#cars', '#videogames', '#chill', '#netflix'];
const importSeed = util.promisify(usermodel.importSeed);

async function importUser(callback) {
  if (fs.existsSync('./db/seed.json')) {
    let rawData = fs.readFileSync('./db/seed.json');
    let users = JSON.parse(rawData);
    console.log(users.results.length);
    for (let index = 0; index < users.results.length; index++) {
      let id = uniqid();
      let bio = 'Lorem ipsum blablablalbla ski montagne netflix chat banalités';
      let gender_id = gender.indexOf(users.results[index].gender) + 1;
      // PasswordPostman2a.
      let password = '$2b$04$WZbkYaN4typkz/nOlIHbselLvsa4syGKRQ65XrxcRGTiN/G2X4Oqm';
      let score = Math.floor(Math.random() * (200 - 0) + 0);
      let arrayTags = [tags[Math.floor(Math.random() * (11 - 0) + 0)], tags[Math.floor(Math.random() * (11 - 0) + 0)], tags[Math.floor(Math.random() * (11 - 0) + 0)]];
      let location = {};
      location.city = users.results[index].location.city;
      location.country = users.results[index].location.country;
      location.lat = users.results[index].location.coordinates.latitude;
      location.lng = users.results[index].location.coordinates.longitude;

      let post = [
        id,
        users.results[index].login.username,
        users.results[index].name.first,
        users.results[index].name.last,
        bio,
        users.results[index].dob.age,
        new Date(users.results[index].dob.date),
        gender_id,
        users.results[index].email,
        password,
        JSON.stringify(location),
        1,
        score,
        1
      ];
      let data = await importSeed(post).then((data) => data)
        .catch((error) => {
          console.log(error);

          return callback('oups', null);
        });
      await addRelationship(id)
        .catch((err) => {
          console.log(err);

          return callback('oups', null);
        });
      await addViewsHistory(id)
        .catch((err) => {
          console.log(err);

          return callback('oups', null);
        });
      await addLikeHistory(id)
        .catch((err) => {
          console.log(err);

          return callback('oups', null);
        });
      await addPhoto(id)
        .catch((err) => {
          console.log(err);

          return callback('oups', null);
        });
      arrayTags.forEach(async (tag) => {
        await addTags(id, tag).catch((error) => {
          console.log(error);

          return callback('oups', null);
        });
      });
    }

    return callback(null, 'ok');
  } else {
    console.log('blyat');

    return callback('oups', null);
  }
}
const importUsers = util.promisify(importUser);

// async function getUser() {
//   let seeds = await fetch('https://randomuser.me/api/?results=500').then((data) => {
//     console.log(data);

//     return data.json();
//   })
//     .catch((error) => console.log(error));

//   return seeds;
// }


importUsers().then((data) => {
  console.log(data);
  process.exit();
})
  .catch((error) => {
    console.log(error);

    process.exit();
  });

