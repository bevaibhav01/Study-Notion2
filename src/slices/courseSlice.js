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
  quizLoading: false, // Track loading state for quizzes
  quizError: null, // Track errors related to quizzes
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
    },
    // Add Quiz Actions
    addQuiz: (state, action) => {
      const { sectionId, quiz } = action.payload;
      const section = state.course.courseContent.find(
        (section) => section._id === sectionId
      );
      if (section) {
        section.quiz = quiz; // Assign the new quiz to the section
      }
    },
    removeQuiz: (state, action) => {
      const { sectionId } = action.payload;
      const section = state.course.courseContent.find(
        (section) => section._id === sectionId
      );
      if (section) {
        section.quiz = null; // Remove the quiz from the section
      }
    },
    setQuizLoading: (state, action) => {
      state.quizLoading = action.payload;
    },
    setQuizError: (state, action) => {
      state.quizError = action.payload;
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
} = courseSlice.actions

export default courseSlice.reducer
