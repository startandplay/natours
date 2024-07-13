const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleleteReview = factory.deleteOne(Review);
exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review);
