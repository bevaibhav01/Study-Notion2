// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { fetchQuiz, submitQuizAnswers } from "../../../services/operations/courseDetailsAPI";
// import { updateQuizResults } from "../../../slices/viewCourseSlice";
// import IconBtn from "../../common/IconBtn";

// const QuizDetails = () => {
//   const { courseId, sectionId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { token } = useSelector((state) => state.auth);
//   const [quizData, setQuizData] = useState(null);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Fetch quiz data when the component mounts
//   useEffect(() => {
//     const fetchQuizData = async () => {
//       const quiz = await fetchQuiz(sectionId, token);
//       setQuizData(quiz);
//       setLoading(false);
//     };

//     fetchQuizData();
//   }, [sectionId, token]);

//   // Handle user answer selection
//   const handleAnswerChange = (questionId, answer) => {
//     setUserAnswers((prev) => ({
//       ...prev,
//       [questionId]: answer,
//     }));
//   };

//   // Submit answers and update results
//   const handleSubmit = async () => {
//     // setLoading(true);
//     // const result = await submitQuizAnswers({ courseId, sectionId, userAnswers }, token);
    
//     // if (result) {
//     //   dispatch(updateQuizResults(result));
//     //   toast.success("Quiz submitted successfully!");
//     //   navigate(`/dashboard/enrolled-courses`);
//     // } else {
//     //   toast.error("Failed to submit the quiz. Please try again.");
//     // }
//     // setLoading(false);
//   };

//   if (loading) {
//    // return <div className="text-white">Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col gap-5 text-white">
//       <h1 className="mt-4 text-3xl font-semibold">{quizData?.title}</h1>
//       <p className="pt-2 pb-6">{quizData?.description}</p>

//       {quizData?.questions.map((question) => (
//         <div key={question.id} className="border-b border-gray-700 pb-4">
//           <h2 className="text-xl">{question.questionText}</h2>
//           <div className="flex flex-col">
//             {question.options.map((option) => (
//               <label key={option.id} className="flex items-center">
//                 <input
//                   type="radio"
//                   name={question.id}
//                   value={option.id}
//                   checked={userAnswers[question.id] === option.id}
//                   onChange={() => handleAnswerChange(question.id, option.id)}
//                   className="mr-2"
//                 />
//                 {option.text}
//               </label>
//             ))}
//           </div>
//         </div>
//       ))}

//       <div className="mt-4">
//         <IconBtn
//           onclick={handleSubmit}
//           text={loading ? "Submitting..." : "Submit Quiz"}
//           customClasses="text-xl max-w-max px-4 mx-auto"
//           disabled={loading}
//         />
//       </div>
//     </div>
//   );
// };

// export default QuizDetailimport React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchQuiz, submitQuizAnswers } from "../../../services/operations/courseDetailsAPI"; // Ensure this includes the updated submitQuizAnswers function

import IconBtn from "../../common/IconBtn";
import { useState, useEffect } from "react";
import { updateQuizResults } from "../../../slices/courseSlice";
//import { submitQuizAnswers } from "../../../services/operations/courseDetailsAPI";

const QuizDetails = () => {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null); // New state to hold the score after submission

  // Fetch quiz data when the component mounts
  useEffect(() => {
    const fetchQuizData = async () => {
      const quiz = await fetchQuiz(sectionId, token);
      setQuizData(quiz);
      console.log("quiz", quiz);
      setLoading(false);
    };

    fetchQuizData();
  }, [sectionId, token]);

  // Handle user answer selection
  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    console.log(questionId, answer);
    console.log(userAnswers)
  };

  // Submit answers and update results
  const handleSubmit = async () => {
    console.log("Submitting quiz..."); // Debug log
    setLoading(true); // Indicate loading state during submission

    const responses = Object.entries(userAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
    }));

    // Get studentId from Redux state or another source
    //const studentId = useSelector((state) => state.auth.user.id); // Adjust this according to your state structure
    console.log("token",token) 
    const result = await submitQuizAnswers(
        { 
            courseId, 
            sectionId, 
            quizId: quizData._id, 
            responses, 
            //studentId // Include studentId in the payload
        }, 
        token
    );

    console.log(result,"result")

    if (result) {
        dispatch(updateQuizResults(result)); // Update Redux state with results
        setScore(result.quizAttempt.score); // Assuming the response contains a 'score' field
        toast.success("Quiz submitted successfully!");
       // navigate(`/dashboard/enrolled-courses`); // Optionally navigate after submission
    } else {
        console.error("Failed to submit the quiz."); // Log failure to submit
        toast.error("Failed to submit the quiz. Please try again.");
    }

    setLoading(false); // Reset loading state
};


  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 text-white p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="mt-4 text-4xl font-bold text-center">{quizData?.title}</h1>
      <p className="pt-2 pb-6 text-lg text-center">{quizData?.description}</p>

      {quizData?.questions.map((question) => (
        <div key={question.id} className="border-b border-gray-700 pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2">{question.questionText}</h2>
          <div className="flex flex-col mt-2">
            {question.options.map((option) => {
              const isSelected = userAnswers[question._id] === option._id;

              return (
                <label
                  key={option._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 
                    ${isSelected ? 'bg-yellow-400 text-black' : 'hover:bg-gray-700 text-gray-300'}`}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value={option._id}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(question._id, option._id)} // Update state on change
                    className="mr-2 cursor-pointer accent-transparent"
                  />
                  <span className={`${isSelected ? 'font-semibold' : ''}`}>
                    {option.optionText}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

<div className="mt-4">
  <button
    onClick={handleSubmit}
    className="text-xl max-w-max px-4 mx-auto bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-lg"
    disabled={loading}
    type="button" // Ensure this is set to prevent form submission
  >
    {loading ? "Submitting..." : "Submit Quiz"}
  </button>
</div>


      {score !== null && ( // Conditionally render the score if it exists
        <div className="mt-4 text-xl text-center">
          <p>Your Score: <span className="font-bold">{score}</span></p>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
