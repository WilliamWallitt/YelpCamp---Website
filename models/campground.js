var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   author: {
      username: 'String',
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      }
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema);