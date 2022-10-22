const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const RFToken = require("../models/rftoken.model");
const { cloudinary } = require("../../utils/cloudinary");

const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.API_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const rftoken_id = v4();
  return RFToken.findOneAndUpdate(
    { user_id: user.id },
    { rftoken_id, user_id: user.id, refresh_token: refreshToken },
    { new: true, upsert: true }
  )
    .then(() => ({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullname: user.fullname,
        profile: user.profile,
      },
      rftoken_id,
      accessToken,
      message: "Login successfully",
      success: true,
    }))
    .catch((err) => ({
      message: err,
      success: false,
    }));
};

exports.signup = (req, res) => {
  const user = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save(async (err, data) => {
    if (err) {
      return res.status(302).send({ message: err });
    }
    const responseData = await generateToken(data);
    return res.status(200).send(responseData);
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      res.status(404).send({ message: "User Not found.", success: false });
      return;
    }

    // comparing passwords
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
      res.status(401).send({
        accessToken: null,
        message: "User Not found.",
        success: false,
      });
      return;
    }
    const responseData = await generateToken(user);
    res.status(200).send(responseData);
  });
};

exports.updateprofile = async (req, res) => {
  try {
    const { fullname, profile, profile_public_id } = req.body;
    const data = {
      fullname,
    };
    if (profile_public_id) {
      await cloudinary.uploader.destroy(profile_public_id);
    }
    if (profile) {
      const uploadImage = await cloudinary.uploader.upload(profile, {
        upload_preset: "moon_dev",
      });
      data.profile = uploadImage.secure_url;
      data.profile_public_id = uploadImage.public_id;
    }
    const user = await User.findOneAndUpdate({ _id: req.user.id }, data, {
      returnDocument: "after",
    }).select("fullname profile profile_public_id");
    return res
      .status(200)
      .json({ message: "success", success: true, data: user });
  } catch (err) {
    console.log("err", err);
    return res.json({ message: "failed", success: false });
  }
};

exports.getinfo = (req, res) => {
  const { user, accessToken } = req;
  if (user) {
    return res.json({
      message: "ok",
      user,
      accessToken,
      success: true,
    });
  }
  return res.json({ message: "not ok" });
};
