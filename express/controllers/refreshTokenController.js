const RefreshToken = require('./../models/refreshTokenModel');
const factory = require('./handlerFactory');



exports.getAllReviews = factory.getAll(RefreshToken);
exports.getReview = factory.getOne(RefreshToken);
exports.createReview = factory.createOne(RefreshToken);
exports.updateReview = factory.updateOne(RefreshToken);
exports.deleteReview = factory.deleteOne(RefreshToken);