import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import './App.css'

const Home = lazy(() =>
  import("./pages/Home/Home")
)

const SignIn = lazy(() => 
  import("./pages/Auth/SignIn")
)

const SignUp = lazy(() =>
  import("./pages/Auth/SignUp")
)

const Profile = lazy(()=>
  import("./pages/Profile/Profile")
)

const Dashboard = lazy(()=>
  import("./pages/Dashboard/Dashboard")
)

const NotFound = lazy(()=>
  import("./pages/NotFound/NotFound")
)

const SharePage = lazy(()=>
  import("./pages/SharePage/SharePage")
)

const LoadingScreen = lazy(()=>
  import("./components/LoadingScreen/LoadingScreen")
)

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
          <Route
            path="/profile" 
            element={
              <Profile/>
            }
          />
          <Route
            path="/dashboard" 
            element={
              <Dashboard/>
            }
          />
          <Route
            path="/share/:token"
            element={
              <SharePage />
            }
          />
          <Route 
            path="*"
            element={
              <NotFound/>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}

export default App

// understand about the api and add docker  
// have to remove the manual 3000 api call and made a env config with backendURL 