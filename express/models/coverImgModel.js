const mongoose = require('mongoose');


const coverImgSchema = new mongoose.Schema(
  {
    __v:{
      type:Number,
      select:false
    }
  },
  {
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 不要再controller 的原因是因為會透過factory create所以就在這邊用了
// 對platform 跟  country 進行加工


const cover = mongoose.model('Cover', coverImgSchema);
module.exports = cover;