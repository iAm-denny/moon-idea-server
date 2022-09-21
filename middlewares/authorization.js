const jwt = require('jsonwebtoken');
const User = require('../app/models/user.model');
const RFToken = require('../app/models/rftoken.model');

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, (err, decode) => {
      if (err) req.user = undefined;
      if (decode && decode.id) {
        User.findOne({
          _id: decode.id,
        })
          .exec((error, user) => {
            if (error) {
              return res.status(500)
                .send({
                  message: error,
                });
            }
            req.user = user;
            return next();
          });
      } else {
        RFToken.findOne({
          rftoken_id: req.headers.rftoken_id,
        })
          .exec((error, data) => {
            if (error) {
              res.status(500)
                .send({
                  message: error,
                });
            } else {
              // eslint-disable-next-line consistent-return
              jwt.verify(data.refresh_token, process.env.REFRESH_TOKEN_SECRET, (errS, decodeS) => {
                if (!decodeS) {
                  return res.status(200)
                    .send({
                      message: 'Session timeout.',
                    });
                }
                const accessToken = jwt.sign({
                  id: decodeS.id,
                }, process.env.API_SECRET, {
                  expiresIn: '15s',
                });
                req.accessToken = accessToken;
                User.findOne({
                  _id: decodeS.id,
                })
                  .exec((errorS, user) => {
                    if (errorS) {
                      return res.status(500)
                        .send({
                          message: error,
                        });
                    }
                    req.user = user;
                    return next();
                  });
              });
            }
          });
      }
    });
  } else {
    req.user = undefined;
    next();
  }
};
module.exports = verifyToken;
