/* eslint-disable */
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
const updateRelationship = util.promisify(usermodel.updateRelationship);
const addBlocksHistory = util.promisify(usermodel.addBlockHistory);
const addReportsHistory = util.promisify(usermodel.addReportHistory);

let gender = ['bisexual', 'male', 'female'];
let tags = ['#gamer', '#surfer', '#hacker', '#starwars', '#meditation', '#42', '#geek', '#fashion', '#hipster', '#horse', '#vegan', '#meat', '#', '#coding', '#C', '#python', '#anime', '#yachting', '#matcha', '#macron'];
const importSeed = util.promisify(usermodel.importSeed);

async function importUser(callback) {
  if (fs.existsSync('seed.json')) {
    let rawData = fs.readFileSync('./seed.json');
    let users = JSON.parse(rawData);
    let length = users.results.length;
    for (let index = 0; index < users.results.length; index += 1) {
      console.clear()
      console.log(`${(index/(length - 1)).toFixed(2)*100}%`);
      let id = uniqid();
      let bio = 'Lorem ipsum blablablalbla ski montagne netflix chat banalités';
      let gender_id = gender.indexOf(users.results[index].gender) + 1;
      let interested_in = Math.floor(Math.random() * (3 - 0) + 1);
      // PasswordPostman2a.
      let password = '$2b$04$WZbkYaN4typkz/nOlIHbselLvsa4syGKRQ65XrxcRGTiN/G2X4Oqm';
      let score = Math.floor(Math.random() * (200 - 0) + 0);
      let arrayTags = [tags[Math.floor(Math.random() * (19 - 0) + 0)], tags[Math.floor(Math.random() * (19 - 0) + 0)], tags[Math.floor(Math.random() * (19 - 0) + 0)]];
      let location = {};
      location.city = users.results[index].location.city;
      location.district = '';
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
      await importSeed(post).then((data) => data)
        .catch((err) => {
          console.log(err);

          return callback(err, null);
        });
      await addRelationship(id)
        .catch((err) => {
          console.log(err);

          return callback(err, null);
        });
      await addViewsHistory(id)
        .catch((err) => {
          console.log(err);

          return callback(err, null);
        });
      await addLikeHistory(id)
        .catch((err) => {
          console.log(err);

          return callback(err, null);
        });
      await addPhoto(id)
        .catch((err) => {
          console.log(err);

          return callback(err, null);
        });
      await updateRelationship(interested_in, id)
        .catch((err) => {
          console.log(err);

          return callback(err, null);
        });
        await addBlocksHistory(id).then((data) => data)
        .catch((err) => {
          console.log(err);

          return callback(err, null);
        });
      await addReportsHistory(id).then((data) => data)
        .catch((err) => {
          console.log(err);

          return callback(err, null);
        });
      arrayTags.forEach(async (tag) => {
        await addTags(id, tag).catch((err) => {
          console.log(err);

          return callback(err, null);
        });
      });
    }

    return callback(null, 'ok');
  } else {
    console.log('File not found');

    return callback('lol', null);
  }
}
const importUsers = util.promisify(importUser);

// async function getUser() {
//   let seeds = await fetch('https://randomuser.me/api/?results=500').then((data) => {
//     (data);

//     return data.json();
//   })
//     .catch((error) => (error));

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
