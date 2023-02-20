const fs = require("fs");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const addAccountImage = (req, res) => {
  User
    .updateOne({ _id: req.body.userId }, {
      $set: {
        image: {
          id: `${req.file.filename}_${req.file.size}`,
          data: fs.readFileSync(req.file.path),
          contentType: "image/jpg"
        }
      }
    })
    .then(() => res.json("Ok"))
    .catch(error => console.error(error));
};

const getAccountImage = (req, res) => {
  User
    .findOne({ _id: req.params.userId }, { "image.data": true })
    .then(image => res.json(image));
};

const signUp = (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password,
    emailToken: crypto.randomBytes(64).toString("hex"),
    isVerified: false,
  })
  bcrypt
    .genSalt(10)
    .then(salt => {
      return bcrypt.hash(user.password, salt);
    })
    .then(hash => {
      user.password = hash
    })
    .then(() => {
      return user.save()
    })
    .then(() => res.json("Ok"))
    .catch(error => {
      error.name === "MongoServerError" ?
        res.status(422).send("The Email is already registered.") :
        console.error(error)
    });

  const transporter = nodemailer.createTransport({
    // service: "gmail",
    // host: 'smtp.mail.ru',
    // port: 465,
    // secure: true,
    // auth: {
    //   user: "antonhpl@mail.ru",
    //   pass: "3AuUMoTLYuR7Gwjv9SHQ",
    // },
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "antosha.dashko@gmail.com",
      pass: "axvqagcxlocnwedx",
    },
    // tls: {
    //   rejectUnauthorized: false,
    // }
  });

  const mailOptions = {
    from: "OFM",
    to: user.email,
    subject: "Please verify your email address on OFM.",
    html: `
      <h4>Dear ${user.name}!</h4>
      <p>Thank you for joining OFM!</p>
      <p>Please cerify your email address by clicking the link below:</p>
      <a href = "https://ofm-api.vercel.app/api/verify-email?token=${user.emailToken}">Verify the Email</a>
    `
  };

  new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(`Verification email was sent to ${user.email}`);
        resolve(info)
      }
    })
  });
};

const verifyEmail = (req, res) => {
  const token = req.query.token;
  User
    .findOne({ emailToken: token })
    .then(user => {
      user.emailToken = null;
      user.isVerified = true;
      return user.save();
    })
    .then(() => res.json("Ok"))
    .catch(error => console.error(error))
};

const logIn = (req, res) => {
  const { email, password, cookieAge } = req.body;
  const throwError = (res) => res.status(500).send({ message: "The credentials are incorrect. Please try again." });
  let userFound;
  User
    .findOne({ email: email })
    .then(user => {
      userFound = user;
      return bcrypt.compare(password, user.password);
    })
    .then(passwordValidation => {
      if (passwordValidation) {
        const token = jwt.sign({ userId: userFound.id }, process.env.JWT_SECRET);
        // console.log("token:", token);
        res.cookie("access-token", token, { maxAge: cookieAge });
        res.json(true);
      } else {
        throwError(res);
      }
    })
    .catch(() => throwError(res));
};

const getUser = (req, res) => {
  User
    .find({ _id: req.params.id }, { name: true, registrationDate: true, email: true, "image.data": true })
    .then(user => res.json(user))
    .catch(error => console.error(error));
};

const getSellers = (req, res) => {
  User
    .find(
      { _id: { $in: JSON.parse(req.query.sellersIds) } },
      { "image.data": true, name: true }
    )
    .then(sellers => res.json(sellers));
};

const getSeller = (req, res) => {
  User
    .find({ _id: req.params.id }, { "image.data": true, name: true, registrationDate: true })
    .then(seller => res.json(seller));
};

module.exports = {
  verifyEmail,
  addAccountImage,
  logIn,
  signUp,
  getUser,
  getAccountImage,
  getSeller,
  getSellers,
};