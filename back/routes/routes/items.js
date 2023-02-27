const express = require('express');
const multer = require("multer");
const {
  getItems,
  countItems,
  getImages,
  postItem,
  finishItem,
  addImages,
  getMyItems,
  deleteImage,
  deleteItem,
  deleteUnsavedItem,
  getItem,
  getItemsBriefly,
} = require("../controllers/items");

const router = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

router.get("/api/items", getItems);
router.get("/api/count_items", countItems);
router.get("/api/images/:creationDate", getImages);
router.get("/api/item/:id", getItem);
router.get("/api/items/:userId", getMyItems);
router.get("/api/items-briefly", getItemsBriefly);
router.post("/api/item", upload.array("imagesInput", 4), postItem);
router.put("/api/item/:creationDate", finishItem);
router.put("/api/images", upload.array("imagesInput", 4), addImages);
router.put("/api/images/:id", deleteImage);
router.delete("/api/item/:creationDate", deleteItem);
router.delete("/api/unsaved_item/:creationDate", deleteUnsavedItem);

module.exports = router;