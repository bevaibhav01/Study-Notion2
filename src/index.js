import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { Toaster } from "react-hot-toast";


const store=configureStore({
  reducer:rootReducer,
})
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>

    <BrowserRouter>
    <Provider store={store}>
    <App />
    <Toaster/>
    </Provider>
    </BrowserRouter>
  
  </React.StrictMode>
);
