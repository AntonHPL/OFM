const fs = require("fs");
const Ad = require("../../models/ad");

const countItems = (req, res) => {
  const subString = req.query.subString;
  const categoryId = req.query.categoryId;
  const subCategoryId = req.query.subCategoryId;
  const userId = req.query.userId;
  const countOptions = {};
  if (subString) {
    countOptions["textInfo.title"] = new RegExp(subString, "gi");
  };
  if (categoryId) {
    countOptions["textInfo.category"] = categoryId;
  };
  if (subCategoryId) {
    countOptions["textInfo.subCategory"] = subCategoryId;
  };
  if (userId) {
    countOptions["textInfo.sellerId"] = userId;
  }
  Ad
    .count(countOptions)
    .then(number => res.status(200).json(number))
    .catch(error => console.error("The error occured: ", error.message));
};

const getItems = (req, res) => {
  const page = +req.query.page;
  const perPage = +req.query.perPage;
  const order = req.query.order === "asc" ? 1 : -1;
  const field = req.query.field === "price" ? "textInfo.price" : "creationDate";
  const subString = req.query.subString;
  const subCategoryId = req.query.subCategoryId;
  const categoryId = req.query.categoryId;
  const sortingOptions = new Object();
  sortingOptions[field] = order;
  const regExp = new RegExp(subString, "gi");
  const searchOptions = () => {
    if (subString) {
      if (categoryId) {
        return { "textInfo.title": regExp, "textInfo.category": categoryId };
      } else if (subCategoryId) {
        return { "textInfo.title": regExp, "textInfo.subCategory": subCategoryId };
      } else {
        return { "textInfo.title": regExp };
      };
    } else if (!subString) {
      if (categoryId) {
        return { "textInfo.category": categoryId };
      } else if (subCategoryId) {
        return { "textInfo.subCategory": subCategoryId };
      } else {
        return {}
      };
    };
  };

  Ad
    .find(searchOptions(), { textInfo: true, images: { $elemMatch: { main: true } } })
    .limit(perPage).skip((page - 1) * perPage)
    .sort(sortingOptions).collation({ locale: "en_US", numericOrdering: true })
    .then(ads => res.status(200).json(ads))
    .catch(error => console.error("The error occured: ", error.message));
};

const deleteItem = (req, res) => {
  Ad
    .findOneAndDelete({ creationDate: req.params.creationDate })
    .then(() => res.json("The ad is deleted."))
    .catch(error => console.error("The error occured: ", error.message));
};

const postItem = (req, res) => {
  new Ad({
    images: req.files && req.files.map((el, i) => {
      return {
        id: `${el.filename}_${el.size}_${i}`,
        data: fs.readFileSync(el.path),
        contentType: "image/jpg"
      };
    }) || [],
    textInfo: req.body.ad || {},
    price: req.body.price || 0,
    creationDate: req.body.creationDate,
  })
    .save()
    .then(() => res.status(200).json("The ad is posted."))
    .catch(error => console.error("The error occured: ", error.message));
};

const deleteUnsavedItem = (req, res) => {
  Ad
    .findOneAndDelete({ creationDate: req.params.creationDate, textInfo: {} })
    .then(() => res.status(200).json("The unsaved Ad is deleted."))
    .catch(error => console.error("The error occured: ", error.message));
};

const addImages = (req, res) => {
  Ad
    .updateOne({ creationDate: req.body.creationDate }, {
      $push: {
        images: {
          $each: req.files.map((el, i) => {
            return {
              id: `${el.filename}_${el.size}_${i}`,
              data: fs.readFileSync(el.path),
              contentType: "image/jpg"
            };
          }),
        }
      }
    })
    .then(() => res.status(200).json("The images are added."))
    .catch(error => console.error("The error occured: ", error.message));
};

const getImages = (req, res) => {
  Ad
    .find({ creationDate: req.params.creationDate }, { images: true })
    .then(images => res.status(200).json(images))
    .catch(error => console.error("The error occured: ", error.message));
};

const deleteImage = (req, res) => {
  Ad
    .updateOne({ creationDate: req.body.creationDate }, {
      $pull: {
        images: {
          id: req.params.id
        }
      }
    })
    .then(() => res.status(200).json("The image is deleted."))
    .catch(error => console.error("The error occured: ", error.message));
};

const finishItem = (req, res) => {
  Ad
    .updateOne({
      creationDate: req.params.creationDate
    }, {
      $set: {
        textInfo: req.body.ad,
      }
    })
    .then(() =>
      Ad.updateOne({
        creationDate: req.params.creationDate,
        "images.id": req.body.mainPictureId,
      }, {
        $set: {
          "images.$.main": true
        }
      })
    )
    .then(() => res.status(200).json("The ad is finished."))
    .catch(error => console.error("The error occured: ", error.message));
};

const getItem = (req, res) => {
  Ad
    .findOne({ _id: req.params.id })
    .then(ad => res.status(200).json(ad))
    .catch(error => console.error("The error occured: ", error.message));
};

const getMyItems = (req, res) => {
  const page = +req.query.page;
  const perPage = +req.query.perPage;

  Ad
    .find({ "textInfo.sellerId": req.params.userId })
    .limit(perPage).skip((page - 1) * perPage)
    .then(ads => res.status(200).json(ads))
    .catch(error => console.error("The error occured: ", error.message));
};

const getItemsBriefly = (req, res) => {
  Ad
    .find(
      { _id: { $in: JSON.parse(req.query.adsIds) } },
      {
        images: { $elemMatch: { main: true } },
        "textInfo.title": true
      }
    )
    .then(ads => res.status(200).json(ads))
    .catch(error => console.error("The error occured: ", error.message));
};

module.exports = {
  getItems,
  countItems,
  getImages,
  getMyItems,
  postItem,
  finishItem,
  addImages,
  deleteImage,
  deleteItem,
  deleteUnsavedItem,
  getItem,
  getItemsBriefly,
};