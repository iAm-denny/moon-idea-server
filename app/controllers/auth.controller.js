const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const RFToken = require('../models/rftoken.model');

exports.signup = (req, res) => {
  const user = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    return res.status(200)
      .send({
        message: 'User Registered successfully',
        success: true,
      });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        res.status(404).send({ message: 'User Not found.', success: false });
        return;
      }

      // comparing passwords
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
      );
      // checking if password was valid and send response accordingly
      if (!passwordIsValid) {
        res.status(401)
          .send({
            accessToken: null,
            message: 'User Not found.',
            success: false,
          });
        return;
      }
      // signing token with user id
      const accessToken = jwt.sign({
        id: user.id,
      }, process.env.API_SECRET, {
        expiresIn: '15s',
      });
      const refreshToken = jwt.sign({
        id: user.id,
      }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
      });

      const rftoken_id = v4();
      RFToken.findOneAndUpdate(
        { user_id: user.id },
        { rftoken_id, user_id: user.id, refresh_token: refreshToken },
        { new: true, upsert: true },
        // eslint-disable-next-line consistent-return
        (rferr) => {
          if (rferr) return res.status(500).send({ message: rferr });
          res.status(200)
            .send({
              user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                profile: user.profile,
              },
              rftoken_id,
              accessToken,
              message: 'Login successfully',
              success: true,
            });
        },
      );
    });
};

exports.getinfo = (req, res) => {
  const { user, accessToken } = req;
  if (user) {
    return res.json({ message: 'ok', user, accessToken });
  }
  return res.json({ message: 'not ok' });
};
