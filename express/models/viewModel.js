
const mongoose = require('mongoose');


const viewSchema = new mongoose.Schema(
  {
    ip: {
        type: String,
        // required: [true, 'ip can not be empty!']
    },
    userAgent:{
        type: String,
        // required: [true, 'ip can not be empty!']
    },
    platform:{ // after proccess and save
        type: String
    },
    country: { // after proccess and save
        type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 不要再controller 的原因是因為會透過factory create所以就在這邊用了
// 對platform 跟  country 進行加工
// viewSchema.pre('save', function(next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });
  

// viewSchema.post('save', function() {
//     // this points to current review
//     //this.constructor.sumView + 1
//     this.constructor.calcAverageRatings(this.tour);
//   });
// post save 執行 sumView+1 function 


const View = mongoose.model('View', viewSchema);
module.exports = View;