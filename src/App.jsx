import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";   // 🔥 ADD THIS

import Home from "./pages/Home";
import JavaPage from "./pages/JavaPage";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicProfile from "./pages/PublicProfile";

import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";



function App() {
  return (
    <AuthProvider>

      {/* 🔥 TOAST GLOBAL */}
      <Toaster position="top-center" />

      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/java" element={<JavaPage />} />
          <Route path="/java/:slug" element={<JavaPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/user/:username" element={<PublicProfile />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;






// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import JavaPage from "./pages/JavaPage";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         <Route path="/" element={<Home />} />

//         <Route path="/java" element={<JavaPage />} />

//         <Route path="/java/:slug" element={<JavaPage />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;





 