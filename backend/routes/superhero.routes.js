const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/superhero.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", upload.array("images", 10), controller.create);
router.patch("/:id", upload.array("images", 10), controller.update);
router.patch('/:id/images', upload.array('images'), controller.addImages);
router.patch('/:id/images/delete', controller.deleteImage);

router.delete("/:id", controller.remove);

module.exports = router;
