const View = require('./../models/viewModel');
const factory = require('./handlerFactory');


// 更改他的ip address middleware 
exports.setCountryPlatform = (req, res, next) => {

    next();
}
  
exports.getAllReviews = factory.getAll(View);
exports.getReview = factory.getOne(View);
exports.createReview = factory.createOne(View);
exports.updateReview = factory.updateOne(View);
exports.deleteReview = factory.deleteOne(View);
  








