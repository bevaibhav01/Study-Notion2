const Quiz = require('../models/Quiz');
const Section = require('../models/Section');
const User = require('../models/User');
const QuizAttempt = require('../models/quizAttempt');
const jwt = require('jsonwebtoken');
const mailSender=require('../utils/mailSender')
const {quizScrollEmail, quizScoreEmail}=require('../mail/templates/quizTemplate')
const Course=require('../models/Course')

// POST /api/quiz/:subSectionId
exports.createQuiz=async (req,res) =>{
   // const  SectionId  = req.body;
    const { questions,sectionId } = req.body;
    console.log("iam running");
   // console.log(SectionId)

    try {
        // Create the quiz with questions
       // console.log("iam running1");
        const quiz = new Quiz({
            questions,
            relatedSection: sectionId
        });
        await quiz.save();
      //  console.log("iam running");

        // Update the SubSection to reference this quiz
       // console.log("iam running");
        await Section.findByIdAndUpdate(sectionId, { quiz: quiz._id });

        res.status(201).json({ 
            success:true,
            message: 'Quiz created successfully', quiz });
    }catch (error) {
       console.log(error.message);
        res.status(500).json({ error: 'Error creating quiz' });
    }
};




exports.submitQuiz = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Assumes the token is in the format "Bearer TOKEN"
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret
        const studentId = decoded.id; // Adjust this according to your token structure

        // Now use studentId from the decoded token
        const { courseId, sectionId, quizId, responses } = req.body;

        console.log(studentId); // Logs student ID from token
        console.log("quiz id", quizId);

        // Retrieve the quiz
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        const totalQuestions = quiz.questions.length;

        // Calculate attempted answers with correctness check
        console.log("response",responses)
        const attemptedAnswers = responses.map((response) => {
            const question = quiz.questions.find(q => q._id.equals(response.questionId));
            console.log(question)
            
            if (!question) {
                return { questionId: response.questionId, selectedOption: response.selectedOption, isCorrect: false };
            }

            // Find the correct option in the question's options array
            const correctOption = question.options.find(option => option.isCorrect);
            console.log(correctOption)
            console.log(correctOption._id,"id")
            const isCorrect = correctOption && correctOption._id.toString() === response.selectedOption;
            
            if (isCorrect) score++;
            
            return {
                questionId: response.questionId,
                selectedOption: response.selectedOption,
                isCorrect
            };
        });

        // Create the QuizAttempt document
        const quizAttempt = await QuizAttempt.create({
            student: studentId,
            course: courseId,
            section: sectionId,
            quiz: quizId,
            score,
            totalQuestions,
            correctAnswers: score,
            attemptedAnswers
        });

        // Link quizAttempt to the user
        await User.findByIdAndUpdate(studentId, { $push: { quizAttempts: quizAttempt._id } });

        const user = await User.findById(studentId);
        const course=await Course.findById(courseId);
        const courseName=course.courseName 
        if (user && user.email) {
            const emailBody = quizScoreEmail(courseName, user.name, score);
            await mailSender(user.email, "Your Quiz Score", emailBody);
        }
        res.status(201).json({ 
            success:true,
            message: 'Quiz submitted successfully', quizAttempt });
    } catch (error) {
        console.error("Error in submitQuiz:", error); // Log the error for debugging
        res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
};

exports.getQuizResults = async (req, res) => {
    try {
        const { studentId } = req.params;
        const user = await User.findById(studentId).populate({
            path: 'quizAttempts',
            populate: [
                { path: 'course', select: 'title' },
                { path: 'section', select: 'title' },
                { path: 'quiz', select: 'title' }
            ]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ quizAttempts: user.quizAttempts });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving quiz results', error: error.message });
    }
};

// Import necessary models
//const express = require('express');
//const router = express.Router();
//const Section = require('../models/Section'); // Adjust the path based on your project structure
//const Quiz = require('../models/Quiz'); // Import the Quiz model

// Endpoint to get quiz details by section ID
exports.getQuiz=async (req, res) => {
    try {
        const { sectionId } = req.body;

        // Fetch the section with quiz details
        const section = await Section.findById(sectionId).populate('quiz'); // Assuming `quiz` is a reference in your Section model
        
        if (!section || !section.quiz) {
            return res.status(404).json({ message: 'Quiz not found for this section' });
        }

        // Send the quiz data
        res.status(200).json({
            quiz:section.quiz,success:true
        }
        );
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};







