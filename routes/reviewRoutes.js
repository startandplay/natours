const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//mergeParams allow tis router receive other routes
//POST /tour/4r4r4r4grg/reviews
//POST /reviews
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(reviewController.deleleteReview);

module.exports = router;
