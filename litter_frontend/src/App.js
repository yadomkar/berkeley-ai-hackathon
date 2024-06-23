import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Upload from "./upload/upload";
import Landing from "./landing/landing";
import Cleaning from "./cleaning/cleaning";
import Contact from "./contact/contact";
import Map from "./map/map";
import { useLogoutFunction, useRedirectFunctions, withAuthInfo } from '@propelauth/react';
import Leaderboard from "./leaderboard/leaderboard";


const App = withAuthInfo(({isLoggedIn}) => {
  const logoutFn = useLogoutFunction();
  const {redirectToSignupPage, redirectToLoginPage} = useRedirectFunctions();
  if (isLoggedIn) {
      return <Router>
      <div className="App">
        <Navbar></Navbar>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/cleaning/:id" element={<Cleaning />} />
          <Route path="/map" element={<Map />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  } else {
      return <div>
          The User is logged out.
          <button onClick={() => redirectToSignupPage()}>
              Sign up
          </button>
          <button onClick={() => redirectToLoginPage()}>
              Log in
          </button>

      </div>
  }
})

export default App;