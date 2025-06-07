const Cover = require('./../models/coverImgModel');
const factory = require('./handlerFactory');


// // split string to array
// exports.splitCoverString = (req, res, next) => {

//     next();
// }
  
exports.getAllReviews = factory.getAll(Cover);
exports.getReview = factory.getOne(Cover);
exports.createReview = factory.createOne(Cover);
exports.updateReview = factory.updateOne(Cover);
exports.deleteReview = factory.deleteOne(Cover);
  

