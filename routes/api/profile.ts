import express, { response } from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import { check, validationResult } from 'express-validator/check';

import Profile from '../../models/Profile';
import User from '../../models/User';
import Post from '../../models/Post';
import request from 'request';
import config from 'config';

router.get('/me', auth, async (req: any, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err: any) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
    }
    console.log(err);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ]as any,
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields: any = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills
        .split(', ')
        .map((skill: string) => skill.trim());
    }

    //build social onject
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.is },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err: any) {
    console.log(err);
    if (err.kid == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
  }
  // res.status(500).send('Server error');
});

router.delete('/', auth, async (req: any, res) => {
  try {
    // Remover user posts
    await Post.deleteMany({ user: req.user.id });

    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'user delete' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

router.put(
  '/experience',
  [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
  ],
  auth,
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, company, location, from, to, current, description } =
      req.body;
    const newExp = { title, company, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/education/:edu_id', auth, async (req: any, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item: { id: any }) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

router.put(
  '/education',
  [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Fild of study is required').not().isEmpty(),
  ],
  auth,
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/experience/:exp_id', auth, async (req: any, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item: { id: any }) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClienId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.log(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

export default router;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}

function setAlert(msg: any, arg1: string): any {
  throw new Error('Function not implemented.');
}
