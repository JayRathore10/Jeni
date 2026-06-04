import { lazy, Suspense} from "react";
import { Route, Routes } from "react-router-dom";
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
    <div className="ap-loading-logo">
      <svg width="72" height="72" viewBox="0 0 22 22" fill="none">
        <rect className="logo-square sq-1" x="2" y="2" width="8" height="8" rx="5" fill="currentColor" />
        <rect className="logo-square sq-2" x="12" y="2" width="8" height="8" rx="2" fill="currentColor" />
        <rect className="logo-square sq-3" x="2" y="12" width="8" height="8" rx="2" fill="currentColor" />
        <rect className="logo-square sq-4" x="12" y="12" width="8" height="8" rx="5" fill="currentColor" />
      </svg>
    </div>

    <p className="ap-loading-text">Loading...</p>
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

// Add auth backend 
