const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    attemptedAnswers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question', // Assuming each question has its own ObjectId
                required: true
            },
            selectedOption: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }
    ],
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
