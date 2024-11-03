// import { createSlice } from "@reduxjs/toolkit"

// const initialState = {
//   step: 1,
//   course: null,
//   editCourse: false,
//   paymentLoading: false,
// }

// const courseSlice = createSlice({
//   name: "course",
//   initialState,
//   reducers: {
//     setStep: (state, action) => {
//       state.step = action.payload
//     },
//     setCourse: (state, action) => {
//       state.course = action.payload
//     },
//     setEditCourse: (state, action) => {
//       state.editCourse = action.payload
//     },
//     setPaymentLoading: (state, action) => {
//       state.paymentLoading = action.payload
//     },
//     resetCourseState: (state) => {
//       state.step = 1
//       state.course = null
//       state.editCourse = false
//     },
//   },
// })

// export const {
//   setStep,
//   setCourse,
//   setEditCourse,
//   setPaymentLoading,
//   resetCourseState,
// } = courseSlice.actions

// export default courseSlice.reducer

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,
  quizLoading: false,
  quizError: null,
  quizResults: null, // New state to hold quiz results
}

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setCourse: (state, action) => {
      state.course = action.payload
    },
    setEditCourse: (state, action) => {
      state.editCourse = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    resetCourseState: (state) => {
      state.step = 1
      state.course = null
      state.editCourse = false
      state.quizResults = null; // Reset quiz results
    },
    addQuiz: (state, action) => {
      const { sectionId, quiz } = action.payload;
      const section = state.course.courseContent.find(
        (section) => section._id === sectionId
      );
      if (section) {
        section.quiz = quiz;
      }
    },
    removeQuiz: (state, action) => {
      const { sectionId } = action.payload;
      const section = state.course.courseContent.find(
        (section) => section._id === sectionId
      );
      if (section) {
        section.quiz = null;
      }
    },
    setQuizLoading: (state, action) => {
      state.quizLoading = action.payload;
    },
    setQuizError: (state, action) => {
      state.quizError = action.payload;
    },
    // New action to update quiz results
    updateQuizResults: (state, action) => {
      state.quizResults = action.payload; // Update state with quiz results
    },
  },
})

export const {
  setStep,
  setCourse,
  setEditCourse,
  setPaymentLoading,
  resetCourseState,
  addQuiz,
  removeQuiz,
  setQuizLoading,
  setQuizError,
  updateQuizResults, // Export the new action
} = courseSlice.actions

export default courseSlice.reducer
