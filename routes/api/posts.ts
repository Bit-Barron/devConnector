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
    [check('text', 'Text is required').not().isEmpty()] as any,
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user?.name,
        avatar: user?.avatar,

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
    const post: any = await Post.findById(req.params.id);

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

router.delete('/:id', auth, async (req: any, res) => {
  try {
    const post: any = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
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

router.put('/like/:id', auth, async (req: any, res) => {
  try {
    const post: any = await Post.findById(req.params.id);
    // Check if the post has already been liked
    if (
      post.likes.filter(
        (like: { user: { toString: () => any } }) =>
          like.user.toString() === req.user.id
      ).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/unlike/:id', auth, async (req: any, res) => {
  try {
    const post: any = await Post.findById(req.params.id);

    // Check if the post has already been liked

    if (
      post.likes.filter(
        (like: { user: { toString: () => any } }) =>
          like.user.toString() === req.user.id
      ).length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    // Get rempce index
    const removeIndex = post.likes.map(
      (like: { user: { toString: () => string | any[] } }) => {
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

    [check('text', 'Text is required').not().isEmpty()] as any,
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user: any = await User.findById(req.user.id).select('-password');
      const post: any = await Post.findById(req.params.id);

      const newComment: any = {
        text: req.body.text,

        name: user.name,

        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

router.delete('/comment/:id/:comment_id', auth, async (req: any, res) => {
  try {
    const post: any = await Post.findById(req.params.id);

    //pull out comment
    const comment = post?.comments.find(
      (comment: any) => (comment.id = req.params.comment_id)
    );

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user?.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized ' });
    }
    const removeIndex: any = post?.comments.map((comment: any) =>
      comment.user?.toString().indexOf(req.user.id)
    );

    post?.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post?.comments);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

export default router;
