module.exports.isLoggedIn = (req, res, next)=>{
  if (req.isAuthenticated()) return next();
  req.session.returnTo = req.originalUrl; 
  req.flash("error" , "Login to access this feature");
  res.redirect("/login");
}

module.exports.saveRedirectUrl = (req, res, next)=>{
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};


module.exports.isOwner = async(req, res, next)=> {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      req.flash("error", "Post not found.");
      return res.redirect("/posts");
    }
    if (!post.owner.equals(req.user._id)) {
      req.flash("error", "You do not have permission!");
      return res.redirect(`/posts/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
}
