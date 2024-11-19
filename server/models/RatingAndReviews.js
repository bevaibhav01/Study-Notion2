const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    // New fields for sentiment analysis
    sentimentScore: {  // Numerical sentiment score, e.g., -1 (negative) to 1 (positive)
        type: Number,
        default: null,
    },
    sentimentCategory: { // e.g., 'positive', 'neutral', 'negative'
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        default: 'neutral',
    },
    keyPhrases: [{ // Array of key phrases extracted from the review
        type: String,
    }],
});

module.exports = mongoose.model("RatingAndReviews", ratingSchema);
