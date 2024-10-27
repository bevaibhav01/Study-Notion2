const Quiz = require('../models/Quiz');
const Section = require('../models/Section');
const User = require('../models/User');
const QuizAttempt = require('../models/quizAttempt');

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
        const { studentId, courseId, sectionId, quizId, responses } = req.body;
        console.log(studentId) 
        // Retrieve the quiz
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        const totalQuestions = quiz.questions.length;

        // Calculate attempted answers with correctness check
        const attemptedAnswers = responses.map((response) => {
            const question = quiz.questions.find(q => q._id.equals(response.questionId));
            
            if (!question) {
                return { questionId: response.questionId, selectedOption: response.selectedOption, isCorrect: false };
            }

            // Find the correct option in the question's options array
            const correctOption = question.options.find(option => option.isCorrect);
            const isCorrect = correctOption && correctOption.optionText === response.selectedOption;
            
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
        //const user1=await User.findById(studentId);
        //console.log(user1)

        // Link quizAttempt to the user
       const user= await User.findByIdAndUpdate(studentId, { $push: { quizAttempts: quizAttempt._id } });
       console.log(user) 
        res.status(201).json({ message: 'Quiz submitted successfully', quizAttempt });
    } catch (error) {
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




