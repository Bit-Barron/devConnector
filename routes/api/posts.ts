import express from "express";
const router = express.Router();
import { check, validationResult } from "express-validator/check";
import auth from "../../middleware/auth";
import Post from '../../models/Post'
import Profile from '../../models/Profile'
import User from '../../models/User'


router.post(
  "/",

  [
    auth,
    // @ts-ignore
    [check("text", "Text is required").not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const user = await User
  }
);

export default router;
