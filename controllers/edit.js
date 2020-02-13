// include the model (aka DB connection)
const usermodel = require('../models/usermodel');
const sanitize = require('sanitize-html');
const util = require('util');
const fs = require('fs');
// const handlers = require('../middleware/handlers');

const getUser = util.promisify(usermodel.findOneUser);
// const getAllUsers = util.promisify(usermodel.getAllusers);


const updatePhoto = util.promisify(usermodel.updatePhoto);
const getPhoto = util.promisify(usermodel.getPhoto);

const updateFieldUser = util.promisify(usermodel.updateFieldUser);
const updateRelationsip = util.promisify(usermodel.updateRelationship);

const MAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

function response (status, message, res) {
  return res.status(status).json({client: message});
}

module.exports = {
  checkEmail: async(email, user_id, callback) => {
    if (!(email && user_id)) {
      let error = "Missing informations, fill the form";

      return callback(error, null);
    }
    if (!MAIL_REGEX.test(email)) {
      let error = "Invalid Email";

      return callback(error, null);
    }
    let user = await getUser('email', email).then((data) => data)
      .catch((err) => {
        console.log(err);
        let error = 'Internal error; MYSQL';

        return callback(error, null);
      });
    if (user[0] && !(user[0].email === email)) {
      let error = "Email aready used";

      return callback(error, null);
    }
    user = await getUser('id', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);
        let error = 'Internal error; MYSQL';

        return callback(error, null);
      });
    if (!user[0]) {
      let error = "User doesn't exist";

      return callback(error, null);
    }
    // await updateFieldUser(email, 'email', user_id).then((data) => data)
    //   .catch((err) => {
    //     console.log(err);
    //     let error = 'Internal error; MYSQL';

    //     return callback(error, null);
    //   });
    let error;

    return callback(error, 'Email updated');
  },
  editBio: async(req, res, payload) => {
    const bio = sanitize(req.body.bio);
    const user_id = payload.user_id;
    if (!(bio || user_id)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    let user = await getUser('id', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });
    if (!user[0]) {
      response(400, 'Unknown user', res);
    }
    await updateFieldUser(bio, 'bio', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });

    return res.status(200);
  },
  editGender: async(req, res, payload) => {
    const gender_id = req.body.gender_id;
    const user_id = payload.user_id;
    if (!(gender_id || user_id)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    if (!GENDER_REGEX.test(gender_id)) {
      return res.status(400).json({error: 'Invalid input.'});
    }
    let user = await getUser('id', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        response(500, 'Internal error', res);
      });
    if (!user[0]) {
      response(400, 'Unknown user', res);
    }
    await updateFieldUser(gender_id, 'gender_id', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });

    return res.status(200);
  },
  editRelationship: async(req, res, payload) => {
    const gender = req.body.gender_id;
    const user_id = payload.user_id;
    if (!(gender || user_id)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    if (!GENDER_REGEX.test(gender)) {
      return res.status(400).json({error: 'Invalid input.'});
    }
    let user = await getUser('id', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        response(500, 'Internal error', res);
      });
    if (!user[0]) {
      response(400, 'Unknown user', res);
    }
    await updateRelationsip(user_id, gender).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });

    return res.status(200);
  },
  editPhoto: async(req, res, payload) => {
    const user_id = payload.user_id;
    try {
      console.log(req.files);
      if (!req.files) {
        return response(400, `No pictures received`, res);
      }
      if (req.files.length <= 0) {
        return response(400, `You must select at least 1 file.`, res);
      }
      let links = [req.files[0].path, req.files[1].path, req.files[2].path, req.files[3].path, req.files[4].path];
      await updatePhoto(user_id, links).then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error', res);
        });

      return response(200, `Files has been uploaded.`, res);
    } catch (error) {
      console.log(error);

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return response(400, "Too many files to upload.", res);
      }

      return response(500, `Error when trying upload many files: ${error}`, res);
    }
  },
  getPhoto: async(req, res, payload) => {
    let user_id = payload.user_id;
    let photos = await getPhoto(user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    console.log(photos.length);
    for (let index = 0; index < photos.length; index++) {
      photos[index].link = Buffer.from(fs.readFileSync(photos[index].link)).toString('base64');
    }

    return response(200, photos, res);
  }
};
