import express from "express";
const router = express.Router();
import auth from "../../middleware/auth";
import User from "../../models/User";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";

router.get("/", auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select("--password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    check("email", "Please incluse a valid email").isEmail(),
    check("password", "password is required").isLength({}).exists(),
  ],

  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // See if user exist

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

export default router;
