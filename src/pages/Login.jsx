import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom"; // 🔥 ADD useLocation
import toast from "react-hot-toast";

function Login() {
   const { login, user } = useContext(AuthContext);
   const navigate = useNavigate();
   const location = useLocation(); // 🔥 ADD

   const [form, setForm] = useState({
      identifier: "",
      password: ""
   });

   // ✅ already logged in → redirect (FIXED 🔥)
   useEffect(() => {
      if (user) {
         const queryParams = new URLSearchParams(location.search);
         const redirectPath = queryParams.get("redirect") || "/";
         navigate(redirectPath);
      }
   }, [user, navigate, location.search]);

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
         });

         const data = await res.json();

         if (data.token) {
            login(data);

            toast.success("Login successful 🎉", {
               duration: 2000
            });

            // 🔥 NO CHANGE IN FLOW (useEffect handle karega redirect)
            setTimeout(() => {
               // empty rakha intentionally (logic same)
            }, 2000);

         } else {
            // 🔥 OTP CASE (UNCHANGED)
            if (data.msg === "Please verify your email first") {
               toast.error("Verify your email first (check OTP)");

               setTimeout(() => {
                  navigate("/signup");
               }, 1500);
            } else {
               toast.error(data.msg || "Login failed", {
                  duration: 2000
               });
            }
         }

      } catch (err) {
         console.error(err);
         toast.error("Something went wrong", {
            duration: 2000
         });
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

         <form
            onSubmit={handleSubmit}
            className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow w-full max-w-sm sm:max-w-md"
         >

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
               Login
            </h2>

            <input
               type="text"
               placeholder="Email or Username"
               className="w-full mb-3 p-2 sm:p-3 border rounded text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
               onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            />

            <input
               type="password"
               placeholder="Password"
               className="w-full mb-3 p-2 sm:p-3 border rounded text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
               onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <p className="text-right text-xs sm:text-sm mb-3">
               <Link to="/forgot-password" className="text-indigo-600 hover:underline">
                  Forgot Password?
               </Link>
            </p>

            <button className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-indigo-700 transition">
               Login
            </button>

            <p className="text-xs sm:text-sm mt-3 text-center">
               New user?{" "}
               <Link to="/signup" className="text-indigo-600 font-medium">
                  Signup
               </Link>
            </p>

         </form>
      </div>
   );
}

export default Login;







// import { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import toast from "react-hot-toast";

// function Login() {
//    const { login, user } = useContext(AuthContext);
//    const navigate = useNavigate();

//    const [form, setForm] = useState({
//       identifier: "",
//       password: ""
//    });

//    // ✅ already logged in → redirect
//    useEffect(() => {
//       if (user) {
//          navigate("/");
//       }
//    }, [user, navigate]);

//    const handleSubmit = async (e) => {
//       e.preventDefault();

//       try {
//          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(form)
//          });

//          const data = await res.json();

//          if (data.token) {
//             login(data);

//             toast.success("Login successful 🎉", {
//                duration: 2000
//             });

//             setTimeout(() => {
//                navigate("/");
//             }, 2000);

//          } else {
//             // 🔥 ADD THIS BLOCK (OTP CASE HANDLE)
//             if (data.msg === "Please verify your email first") {
//                toast.error("Verify your email first (check OTP)");

//                setTimeout(() => {
//                   navigate("/signup"); // वापस OTP page पर
//                }, 1500);
//             } else {
//                toast.error(data.msg || "Login failed", {
//                   duration: 2000
//                });
//             }
//          }

//       } catch (err) {
//          console.error(err);
//          toast.error("Something went wrong", {
//             duration: 2000
//          });
//       }
//    };

//    return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

//          <form
//             onSubmit={handleSubmit}
//             className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow w-full max-w-sm sm:max-w-md"
//          >

//             <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
//                Login
//             </h2>

//             <input
//                type="text"
//                placeholder="Email or Username"
//                className="w-full mb-3 p-2 sm:p-3 border rounded text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
//             />

//             <input
//                type="password"
//                placeholder="Password"
//                className="w-full mb-3 p-2 sm:p-3 border rounded text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                onChange={(e) => setForm({ ...form, password: e.target.value })}
//             />

//             <p className="text-right text-xs sm:text-sm mb-3">
//                <Link to="/forgot-password" className="text-indigo-600 hover:underline">
//                   Forgot Password?
//                </Link>
//             </p>

//             <button className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-indigo-700 transition">
//                Login
//             </button>

//             <p className="text-xs sm:text-sm mt-3 text-center">
//                New user?{" "}
//                <Link to="/signup" className="text-indigo-600 font-medium">
//                   Signup
//                </Link>
//             </p>

//          </form>
//       </div>
//    );
// }

// export default Login;