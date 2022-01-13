const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const {
 handleError,
 validatePost,
 validateUserId,
 validateUser,
} = require("../middleware/middleware");

const router = express.Router();

router.get("/", async (req, res, next) => {
 // RETURN AN ARRAY WITH ALL THE USERS
 try {
  const users = await Users.get();
  res.status(200).json(users);
 } catch (err) {
  next();
 }
});

router.get("/:id", validateUserId, async (req, res, next) => {
 // RETURN THE USER OBJECT
 // this needs a middleware to verify user id
 try {
  const { id } = req.params;
  const user = await Users.getById(id);
  res.status(200).json(user);
 } catch (err) {
  next();
 }
});

router.post("/", validateUser, async (req, res, next) => {
 // RETURN THE NEWLY CREATED USER OBJECT
 // this needs a middleware to check that the request body is valid
 try {
  const { name } = req.body;
  const newUser = await Users.insert({ name });
  res.status(201).json(newUser);
 } catch (err) {
  next(err);
 }
});

router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
 // RETURN THE FRESHLY UPDATED USER OBJECT
 // this needs a middleware to verify user id
 // and another middleware to check that the request body is valid
 try {
  const { id } = req.params;
  const { name } = req.body;
  const updatedUser = await Users.update(id, { name });
  res.status(200).json(updatedUser);
 } catch (err) {
  next(err);
 }
});

router.delete("/:id", validateUserId, async (req, res, next) => {
 // RETURN THE FRESHLY DELETED USER OBJECT
 // this needs a middleware to verify user id
 try {
  const { id } = req.params;
  const deletedUser = await Users.getById(id);
  await Users.remove(id);
  res.status(200).json(deletedUser);
 } catch (err) {
  next(err);
 }
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
 // RETURN THE ARRAY OF USER POSTS
 // this needs a middleware to verify user id
 try {
  const { id } = req.params;
  const posts = await Users.getUserPosts(id);
  res.status(200).json(posts);
 } catch (err) {
  next(err);
 }
});

router.post(
 "/:id/posts",
 validateUserId,
 validatePost,
 async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
   const { id } = req.params;
   const { text } = req.body;
   const newPost = await Posts.insert({ text, user_id: id });
   res.status(201).json(newPost);
  } catch (err) {
   next(err);
  }
 }
);

router.use(handleError);
// do not forget to export the router
module.exports = router;
