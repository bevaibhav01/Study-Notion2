// import { useEffect, useState } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { toast } from "react-hot-toast"
// import { RxCross2 } from "react-icons/rx"
// import { useDispatch, useSelector } from "react-redux"

// import { createQuiz } from "../../../../../services/operations/courseDetailsAPI"
// import { setCourse, addQuiz } from "../../../../../slices/courseSlice"
// import IconBtn from "../../../../common/IconBtn"

// export default function QuizModal({
//   sectionId,
//   modalData,
//   setModalData,
//   add = false,
//   edit = false,
// }) {
//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     formState: { errors },
//   } = useForm()

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "questions",
//   })

//   const dispatch = useDispatch()
//   const [loading, setLoading] = useState(false)
//   const { token } = useSelector((state) => state.auth)
//   const { course } = useSelector((state) => state.course)

//   useEffect(() => {
//     if (edit) {
//       setValue("quizTitle", modalData.title)
//       setValue("quizDescription", modalData.description)
//       // Assuming modalData.questions is an array of questions
//       modalData.questions.forEach((question, index) => {
//         append(question)
//       })
//     }
//   }, [edit, modalData, setValue, append])



//   // Inside your form handling logic in the Quiz Modal
//   const onSubmit = async (data) => {
//     const formattedData = {
//       sectionId: sectionId,
//       quizTitle: data.quizTitle,
//       questions: data.questions.map((q, index) => {
//         // Ensure options exist and at least one option is correct
//         const correctOption = q.options?.find(option => option.isCorrect);
        
//         return {
//           questionText: q.questionText,
//           options: q.options || [], // Default to an empty array if options is undefined
//           feedback: correctOption
//             ? `The correct answer is ${correctOption.optionText}.`
//             : "No correct answer provided.", // Handle case where no correct answer is found
//         };
//       }),
//     };
  
//     // Proceed with API call
//     const result = await createQuiz(formattedData, token);
//     // Handle result...
//   };
  
  

//   return (
//     <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
//       <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
//           <p className="text-xl font-semibold text-richblack-5">
//             {add ? "Adding" : "Editing"} Quiz
//           </p>
//           <button onClick={() => (!loading ? setModalData(null) : {})}>
//             <RxCross2 className="text-2xl text-richblack-5" />
//           </button>
//         </div>
//         {/* Modal Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
//           {/* Quiz Title */}
//           <div className="flex flex-col space-y-2">
//             <label className="text-sm text-richblack-5" htmlFor="quizTitle">
//               Quiz Title <sup className="text-pink-200">*</sup>
//             </label>
//             <input
//               disabled={loading}
//               id="quizTitle"
//               placeholder="Enter Quiz Title"
//               {...register("quizTitle", { required: true })}
//               className="form-style w-full"
//             />
//             {errors.quizTitle && (
//               <span className="ml-2 text-xs tracking-wide text-pink-200">
//                 Quiz title is required
//               </span>
//             )}
//           </div>

//           {/* Quiz Description */}
//           <div className="flex flex-col space-y-2">
//             <label className="text-sm text-richblack-5" htmlFor="quizDescription">
//               Quiz Description <sup className="text-pink-200">*</sup>
//             </label>
//             <textarea
//               disabled={loading}
//               id="quizDescription"
//               placeholder="Enter Quiz Description"
//               {...register("quizDescription", { required: true })}
//               className="form-style resize-x-none min-h-[130px] w-full"
//             />
//             {errors.quizDescription && (
//               <span className="ml-2 text-xs tracking-wide text-pink-200">
//                 Quiz Description is required
//               </span>
//             )}
//           </div>

//           {/* Questions Section */}
//           <div className="flex flex-col space-y-4">
//             <label className="text-sm text-richblack-5">Questions</label>
//             {fields.map((item, index) => (
//               <div key={item.id} className="border p-4 rounded-md bg-gray-800">
//                 <div className="flex flex-col space-y-2">
//                   <label className="text-sm text-richblack-5" htmlFor={`questions.${index}.questionText`}>
//                     Question <sup className="text-pink-200">*</sup>
//                   </label>
//                   <input
//                     {...register(`questions.${index}.questionText`, { required: true })}
//                     className="form-style w-full"
//                     placeholder="Enter Question"
//                   />
//                   {errors.questions?.[index]?.questionText && (
//                     <span className="ml-2 text-xs tracking-wide text-pink-200">
//                       Question is required
//                     </span>
//                   )}

//                   {/* Options */}
//                   <label className="text-sm text-richblack-5">Options</label>
//                   {["optionA", "optionB", "optionC", "optionD"].map((option, idx) => (
//                     <div key={idx} className="flex items-center space-x-2">
//                       <input
//                         type="text"
//                         placeholder={`Option ${String.fromCharCode(65 + idx)}`}
//                         {...register(`questions.${index}.${option}`, { required: true })}
//                         className="form-style flex-1"
//                       />
//                       <input
//                         type="radio"
//                         value={option}
//                         {...register(`questions.${index}.correctOption`)}
//                       />
//                       <label className="text-sm text-richblack-5">Correct</label>
//                     </div>
//                   ))}
//                   {errors.questions?.[index]?.optionA && (
//                     <span className="ml-2 text-xs tracking-wide text-pink-200">
//                       All options are required
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   type="button"
//                   className="mt-2 text-red-500"
//                   onClick={() => remove(index)}
//                 >
//                   Remove Question
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => append({ questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "" })}
//               className="mt-4 bg-blue-600 text-white rounded px-4 py-2"
//             >
//               Add Question
//             </button>
//           </div>

//           <div className="flex justify-end">
//             <IconBtn
//               disabled={loading}
//               text={loading ? "Loading.." : add ? "Add Quiz" : "Save Changes"}
//             />
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import { createQuiz } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, addQuiz } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"

export default function QuizModal({
  sectionId,
  modalData,
  setModalData,
  add = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (edit) {
      setValue("quizTitle", modalData.title)
      setValue("quizDescription", modalData.description)
      // Assuming modalData.questions is an array of questions
      modalData.questions.forEach((question) => {
        append(question)
      })
    }
  }, [edit, modalData, setValue, append])

//   const onSubmit = async (data) => {
//     const formattedData = {
//       sectionId: sectionId,
//       quizTitle: data.quizTitle,
//       questions: data.questions.map((q) => {
//         // Determine the correct option based on the selected radio button
//         const correctOptionIndex = Object.values(q).indexOf(q.correctOption);
//         const options = [
//           { optionText: q.optionA, isCorrect: correctOptionIndex === 0 },
//           { optionText: q.optionB, isCorrect: correctOptionIndex === 1 },
//           { optionText: q.optionC, isCorrect: correctOptionIndex === 2 },
//           { optionText: q.optionD, isCorrect: correctOptionIndex === 3 },
//         ];

//         const correctOption = options.find(option => option.isCorrect);
//         console.log("Corrected option",correctOption)
//         return {
//           questionText: q.questionText,
//           options: options,
//           feedback: correctOption
//             ? `The correct answer is ${correctOption.optionText}.`
//             : "No correct answer provided.", // Handle case where no correct answer is found
//         };
//       }),
//     };
  
//     // Proceed with API call
//     const result = await createQuiz(formattedData, token);
//     // Handle result...
//     if (result) {
//       dispatch(addQuiz(result)); // Assuming you want to add the quiz to your course state
//       setModalData(null); // Close the modal
//       toast.success("Quiz created successfully!"); // Success message
//     }
//   };

const onSubmit = async (data) => {
    console.log('Form Data:', data); // Log form data for debugging
    const formattedData = {
        sectionId: sectionId,
        quizTitle: data.quizTitle,
        questions: data.questions.map((q) => {
            // Check if the correct option is set correctly
            console.log('Question Data:', q); // Log each question data for debugging
            const correctOptionIndex = ["optionA", "optionB", "optionC", "optionD"].indexOf(q.correctOption);

            // Set the options array with the correct identification of the correct option
            const options = [
                { optionText: q.optionA, isCorrect: correctOptionIndex === 0 },
                { optionText: q.optionB, isCorrect: correctOptionIndex === 1 },
                { optionText: q.optionC, isCorrect: correctOptionIndex === 2 },
                { optionText: q.optionD, isCorrect: correctOptionIndex === 3 },
            ];

            const correctOption = options.find(option => option.isCorrect);
            
            return {
                questionText: q.questionText,
                options: options,
                feedback: correctOption
                    ? `The correct answer is ${correctOption.optionText}.`
                    : "No correct answer provided.",
            };
        }),
    };

    // Proceed with API call
    const result = await createQuiz(formattedData, token);
    // Handle result...
    if (result) {
        dispatch(addQuiz(result));
        setModalData(null);
        toast.success("Quiz created successfully!");
    }
};

  
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {add ? "Adding" : "Editing"} Quiz
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          {/* Quiz Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="quizTitle">
              Quiz Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              disabled={loading}
              id="quizTitle"
              placeholder="Enter Quiz Title"
              {...register("quizTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.quizTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Quiz title is required
              </span>
            )}
          </div>

          {/* Quiz Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="quizDescription">
              Quiz Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              disabled={loading}
              id="quizDescription"
              placeholder="Enter Quiz Description"
              {...register("quizDescription", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.quizDescription && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Quiz Description is required
              </span>
            )}
          </div>

          {/* Questions Section */}
          <div className="flex flex-col space-y-4">
            <label className="text-sm text-richblack-5">Questions</label>
            {fields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md bg-gray-800">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-richblack-5" htmlFor={`questions.${index}.questionText`}>
                    Question <sup className="text-pink-200">*</sup>
                  </label>
                  <input
                    {...register(`questions.${index}.questionText`, { required: true })}
                    className="form-style w-full"
                    placeholder="Enter Question"
                  />
                  {errors.questions?.[index]?.questionText && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                      Question is required
                    </span>
                  )}

                  {/* Options */}
                  <label className="text-sm text-richblack-5">Options</label>
                  {["optionA", "optionB", "optionC", "optionD"].map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        {...register(`questions.${index}.${option}`, { required: true })}
                        className="form-style flex-1"
                      />
                      <input
                        type="radio"
                        value={option}
                        {...register(`questions.${index}.correctOption`, { required: true })} // Ensure correct option is captured
                      />
                      <label className="text-sm text-richblack-5">Correct</label>
                    </div>
                  ))}
                  {errors.questions?.[index]?.optionA && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                      All options are required
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-2 text-red-500"
                  onClick={() => remove(index)}
                >
                  Remove Question
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "" })}
              className="mt-4 bg-blue-600 text-white rounded px-4 py-2"
            >
              Add Question
            </button>
          </div>

          <div className="flex justify-end">
            <IconBtn
              disabled={loading}
              text={loading ? "Loading.." : add ? "Add Quiz" : "Save Changes"}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
