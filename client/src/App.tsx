import { lazy, Suspense, useEffect, useState, ReactNode } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import './App.css'

const Home = lazy(() =>
  import("./pages/Home/Home").then((module) => ({
    default: module.Home,
  }))
)

const SignIn = lazy(() =>
  import("./pages/Auth/SignIn").then((module) => ({
    default: module.SignIn
  }))
)

const SignUp = lazy(() =>
  import("./pages/Auth/SignUp").then((module) => ({
    default: module.SignUp
  }))
)

const LoadingScreen = () => (
  <div className="ap-loading-container">
    <div className="ap-spinner"></div>
    <div className="ap-loading-text">Loading app...</div>
  </div>
);

function App() {

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route
            path="/home"
            element={
              <Home />
            }
          />
          <Route
            path="/"
            element={
              <SignIn />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp />
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
