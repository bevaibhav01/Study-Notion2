const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    questions: [
        {
            questionText: {
                type: String,
                required: true
            },
            options: [
                {
                    optionText: String,
                    isCorrect: Boolean
                }
            ],
            feedback: {
                type: String, // Feedback message for correct/incorrect answers
                required: true
            }
        }
    ],
    relatedSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    }
});

module.exports = mongoose.model("Quiz", quizSchema);
