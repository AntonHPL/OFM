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

const signUp = async (req, res) => {
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
    .then(() => user.save())
    .then(() => sendMail(user))
    .then(data => res.json(data))
    .catch(error => {
      error.name === "MongoServerError" ?
        res.status(422).send("The Email is already registered.") :
        console.error(error)
    });
};

const sendMail = user => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: "ofm-api@yandex.ru",
      pass: "hgtldqioicvixckk",
    },
  });

  const mailOptions = {
    from: "ofm-api@yandex.ru",
    to: user.email,
    subject: "Please verify your email address on OFM.",
    html: `
      <h1 style="font-size: 2em">Dear ${user.name}!</h1>
      <p style="font-size: 1.5em">
        Thank you for joining OFM!
        <br />
        Please <a href="https://ofm-app.vercel.app/verify-email/${user.emailToken}">verify</a> your email address.
      </p>
      <p style="font-size: 1em">
        This is an automatic email, no reply is required.
      </p>
    `
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(`Verification email was sent to ${user.email}`);
        console.log(info);
      }
    })
  });
}

const verifyEmail = (req, res) => {
  const token = req.params.token;
  console.log("token", token)
  User
    .findOne({ emailToken: token })
    .then(user => {
      user.emailToken = null;
      user.isVerified = true;
      user.save();
    })
    .then(() => res.status(200).send({ message: "ok" }))
    .catch(error => res.status(500).send(error))
};

const logIn = (req, res) => {
  const { email, password, cookieAge } = req.body;
  const message = "The credentials are incorrect. Please try again.";
  let userFound;
  User
    .findOne({ email: email })
    .then(user => {
      userFound = user;
      if (!userFound.isVerified) throw new Error("The Email is not verified. Please verify your Email and try again.");
      return bcrypt.compare(password, user.password);
    })
    .then(passwordValidation => {
      if (passwordValidation) {
        const token = jwt.sign({ userId: userFound.id }, process.env.JWT_SECRET);
        // console.log("token:", token);
        res.cookie("access-token", token, { maxAge: cookieAge });
        res.json(true);
      } else throw new Error(message);
    })
    .catch(({ message }) => res.status(500).send({ message }));
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