const express = require("express");
const router = express.Router();
const cafe = require("../services/cafe");
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer');
//Get field name from secrets
const myFieldName = process.env['UPLOAD_FIELD_NAME'] || "logo";
//Upload variable for handling uploading of files with above name
const DIR = 'uploads/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// // middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log("Time: ", Date.now());
//   next();
// });

/* GET cafe */
router.get("/", async function (req, res) {
  try {
    res.json(await cafe.getMultiple(req.query.location));
  } catch (err) {
    console.log(`Error while getting cafe `, err.message);
  }
});

/* POST cafe */
router.post(
  "/",
  upload.single(myFieldName), async function (req, res) {
    //If file is there extract inform and return json
    if (req.file) {
      res.json(
        await cafe.create(
          req.body.name,
          req.body.description,
          req.body.location,
          req.file.filename
        )
      );
    } else {
      res.json(
        await cafe.create(
          req.body.name,
          req.body.description,
          req.body.location
        )
      );
    }
  }
);

/* PUT cafe */
router.put(
  "/:id",
  upload.single(myFieldName),
  async function (req, res) {
    //If file is there extract inform and return json
    if (req.file) {
      res.json(
        await cafe.update(
          req.params.id,
          req.body.name,
          req.body.description,
          req.body.location,
          req.file.filename
        )
      );
    } else {
      res.json(
        await cafe.update(
          req.params.id,
          req.body.name,
          req.body.description,
          req.body.location
        )
      );
    }
  }
);
/* DELETE cafe */
router.delete('/:id', async function(req, res) {
  try {
    res.json(await cafe.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting cafe`, err.message);
  }
});

module.exports = router;
