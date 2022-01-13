const User = require("../users/users-model");

function logger(req, res, next) {
 // DO YOUR MAGIC

 console.log(req.method, req.url, Date.now());
 next();
}
// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
 res.status(err.status || 500).json({
  message: err.message0,
 });
}

async function validateUserId(req, res, next) {
 // DO YOUR MAGIC
 try {
  const { id } = req.params;
  const actualUser = await User.getById(id);
  if (actualUser) {
   next();
  } else {
   next({ status: 404, message: "not found" });
  }
 } catch (err) {
  next(err);
 }
}

function validateUser(req, res, next) {
 try {
  const { name } = req.body;
  if (name) {
   next();
  } else {
   next({
    status: 400,
    message: "missing required name",
   });
  }
 } catch (err) {
  next(err);
 }
}

function validatePost(req, res, next) {
 try {
  const { text } = req.body;
  if (text) {
   next();
  } else {
   next({
    status: 400,
    message: "missing required text",
   });
  }
 } catch (err) {
  next(err);
 }
}

// do not forget to expose these functions to other modules
module.exports = {
 logger,
 validatePost,
 validateUser,
 validateUserId,
 handleError,
};
