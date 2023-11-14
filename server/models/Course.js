const mongoose=require('mongoose');

const courseSchema=new mongoose.Schema({
   courseName:{
    type:String,
    trim:true,
   },

   courseDescription:{
    type:String,
   },

   instructor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
   },

   whatYouWillLearn:{
    type:String
   },

   courseContent:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Section'
    }
   ],

  ratingAndReview:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'RatingAndReviews',
  }],

  price:{
    type:Number,
  },

  thumbnail:{
    type:String,
  },

  Category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
  },
  tag:{
    type:[String],
  },

  studentsEnrolled:[
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    }
  ],
  status: {
		type: String,
		enum: ["Draft", "Published"],
	},
  createdAt: {
		type:Date,
		default:Date.now
	},
  instructions: {
		type: [String],
	},

});

module.exports=mongoose.model("Course",courseSchema);