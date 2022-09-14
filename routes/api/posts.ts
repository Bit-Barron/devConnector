import express from 'express';
const router = express.Router();
import { check, validationResult } from 'express-validator';
import auth from '../../middleware/auth';
import Post from '../../models/Post';
import Profile from '../../models/Profile';
import User from '../../models/User';

router.post(
  '/',

  [
    auth,
    // @ts-ignore
    [check('text', 'Text is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // @ts-ignore
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user?.name,
        avatar: user?.avatar,
        // @ts-ignore

        user: req.user?.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error ');
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error ');
  }
});
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    if (err === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    console.log(err);
    res.status(500).send('Server Error ');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    // @ts-ignore
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err);

    res.status(500).send('Server Error');
  }
});

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post: any = await Post.findById(req.params.id);
    // Check if the post has already been liked
    if (
      post.likes.filter(
        (like: { user: { toString: () => any } }) =>
          // @ts-ignore
          like.user.toString() === req.user.id
      ).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    // @ts-ignore
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post: any = await Post.findById(req.params.id);

    // Check if the post has already been liked

    if (
      post.likes.filter(
        (like: { user: { toString: () => any } }) =>
          // @ts-ignore

          like.user.toString() === req.user.id
      ).length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    // Get rempce index
    const removeIndex = post.likes.map(
      (like: { user: { toString: () => string | any[] } }) => {
        // @ts-ignore
        like.user.toString().indexOf(req.user.id);
      }
    );

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/comment/:id',

  [
    auth,
    // @ts-ignore
    [check('text', 'Text is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // @ts-ignore
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user?.name,
        avatar: user?.avatar,
        // @ts-ignore

        user: req.user?.id,
      };

      // @ts-ignore

      post?.comments.unshift(newComment);

      // @ts-ignore

      await newComment.save();

      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error ');
    }
  }
);

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post?.comments.find(
      // @ts-ignore
      (comment) => (comment.id = req.params.comment_id)
    );

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    // @ts-ignore
    if (comment.user?.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized ' });
    }
    const removeIndex: any = post?.comments.map((comment) =>
      // @ts-ignore
      comment.user?.toString().indexOf(req.user.id)
    );

    post?.comments.splice(removeIndex, 1);
    // @ts-ignore

    await post.save();

    res.json(post?.comments);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

export default router;
