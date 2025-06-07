const Content = require('./../models/contentImgModel');
const factory = require('./handlerFactory');


// // split string to array
// exports.splitContentString = (req, res, next) => {

//     next();
// }
  
exports.getAllReviews = factory.getAll(Content);
exports.getReview = factory.getOne(Content);
exports.createReview = factory.createOne(Content);
exports.updateReview = factory.updateOne(Content);
exports.deleteReview = factory.deleteOne(Content);
  

