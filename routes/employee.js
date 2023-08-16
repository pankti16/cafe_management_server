const express = require("express");
const router = express.Router();
const employee = require("../services/employee");

// // middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log("Time: ", Date.now());
//   next();
// });

/* GET employee */
router.get("/", async function (req, res) {
  try {
    res.json(await employee.getMultiple(req.query.cafe));
  } catch (err) {
    console.error(`Error while getting employee `, err.message);
  }
});

/* GET specific employee */
router.get("/:emp", async function (req, res) {
  try {
    res.json(await employee.getSingle(req.params.emp));
  } catch (err) {
    console.error(`Error while getting employee `, err.message);
  }
});

/* POST employee */
router.post('/', async function(req, res) {
  try {
    res.json(await employee.create(req.body.name, req.body.email_address, req.body.phone_number, req.body.gender, req.body.cafe_id, req.body.joining_date));
  } catch (err) {
    console.error(`Error while creating employee`, err.message);
  }
});

/* PUT employee */
router.put('/:id', async function(req, res) {
  try {
    res.json(await employee.update(req.params.id, req.body.name, req.body.phone_number, req.body.gender, req.body.cafe_id, req.body.joining_date));
  } catch (err) {
    console.error(`Error while creating employee`, err.message);
  }
});

/* DELETE employee */
router.delete('/:id', async function(req, res) {
  try {
    res.json(await employee.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting employee`, err.message);
  }
});

module.exports = router;
