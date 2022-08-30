const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

router.post("/", [], (req, res) => {
    check('name', 'Name is required').not().isEmpty()
  console.log(req.body);
  res.send("User route");
});

module.exports = router;
