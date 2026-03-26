import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
   const { login } = useContext(AuthContext);
   const navigate = useNavigate();

   const [form, setForm] = useState({
      name: "",
      email: "",
      password: ""
   });

   const [otp, setOtp] = useState(Array(6).fill(""));
   const [showOtp, setShowOtp] = useState(false);
   const [timer, setTimer] = useState(60);

   const inputsRef = useRef([]);

   // ⏳ TIMER
   useEffect(() => {
      if (showOtp && timer > 0) {
         const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [showOtp, timer]);

   // 🔥 AUTO CLIPBOARD OTP
   const checkClipboardForOtp = async () => {
      try {
         const text = await navigator.clipboard.readText();

         if (/^\d{6}$/.test(text)) {
            const newOtp = text.split("");
            setOtp(newOtp);

            inputsRef.current[5]?.focus();
         }
      } catch (err) {
         // ignore
      }
   };

   // 🔥 RUN WHEN OTP SCREEN OPENS
   useEffect(() => {
      if (showOtp) {
         checkClipboardForOtp();
      }
   }, [showOtp]);

   // 🔥 SIGNUP
   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
         });

         const data = await res.json();

         if (res.ok) {
            toast.success("OTP sent to your email 📩");
            setShowOtp(true);
            setTimer(60);
         } else {
            toast.error(data.msg || "Signup failed");
         }

      } catch (err) {
         console.error(err);
         toast.error("Something went wrong");
      }
   };

   // 🔥 VERIFY
   const handleVerify = async (e) => {
      e.preventDefault();

      try {
         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               email: form.email,
               otp: otp.join("")
            })
         });

         const data = await res.json();

         if (data.token) {
            login(data);
            toast.success("Account verified 🎉");

            setTimeout(() => {
               navigate("/");
            }, 1500);
         } else {
            toast.error(data.msg || "Invalid OTP");
         }

      } catch (err) {
         console.error(err);
         toast.error("Verification failed");
      }
   };

   // 🔁 RESEND OTP
   const handleResend = async () => {
      try {
         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email })
         });

         const data = await res.json();

         if (res.ok) {
            toast.success(data.msg);
            setTimer(60);
         } else {
            toast.error(data.msg);
         }

      } catch (err) {
         toast.error("Failed to resend OTP");
      }
   };

   // 🎨 OTP CHANGE
   const handleOtpChange = (value, index) => {
      if (!/^[0-9]?$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
         inputsRef.current[index + 1].focus();
      }
   };

   // 🔥 PASTE FIX
   const handlePaste = (e) => {
      const pasteData = e.clipboardData.getData("text").trim();

      if (!/^\d{6}$/.test(pasteData)) return;

      const newOtp = pasteData.split("");
      setOtp(newOtp);

      inputsRef.current[5].focus();
   };

   // 🔥 BACKSPACE FIX
   const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
         inputsRef.current[index - 1].focus();
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

         <form
            onSubmit={showOtp ? handleVerify : handleSubmit}
            className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow w-full max-w-sm sm:max-w-md"
         >

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
               {showOtp ? "Verify OTP" : "Create Account"}
            </h2>

            {!showOtp && (
               <>
                  <input
                     type="text"
                     placeholder="Name"
                     className="w-full mb-3 p-2 sm:p-3 border rounded text-sm sm:text-base"
                     onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />

                  <input
                     type="email"
                     placeholder="Email"
                     className="w-full mb-3 p-2 sm:p-3 border rounded text-sm sm:text-base"
                     onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />

                  <input
                     type="password"
                     placeholder="Password"
                     className="w-full mb-3 p-2 sm:p-3 border rounded text-sm sm:text-base"
                     onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
               </>
            )}

            {showOtp && (
               <>
                  {/* 🎨 OTP BOXES */}
                  <div
                     className="flex justify-between gap-2 sm:gap-3 mb-3"
                     onPaste={handlePaste}
                  >
                     {otp.map((digit, i) => (
                        <input
                           key={i}
                           ref={(el) => (inputsRef.current[i] = el)}
                           maxLength="1"
                           value={digit}
                           onChange={(e) => handleOtpChange(e.target.value, i)}
                           onKeyDown={(e) => handleKeyDown(e, i)}
                           className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 text-center border rounded text-base sm:text-lg"
                        />
                     ))}
                  </div>

                  {/* ⏳ TIMER */}
                  <p className="text-xs sm:text-sm text-center mb-2">
                     {timer > 0 ? `Resend in ${timer}s` : "You can resend OTP"}
                  </p>

                  {/* 🔁 RESEND */}
                  {timer === 0 && (
                     <button
                        type="button"
                        onClick={handleResend}
                        className="text-indigo-600 text-xs sm:text-sm mb-2 w-full text-center"
                     >
                        Resend OTP
                     </button>
                  )}
               </>
            )}

            <button className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base">
               {showOtp ? "Verify OTP" : "Sign Up"}
            </button>

            {!showOtp && (
               <p className="text-xs sm:text-sm mt-3 text-center">
                  Already have account?{" "}
                  <Link to="/login" className="text-indigo-600 font-medium">
                     Login
                  </Link>
               </p>
            )}

         </form>
      </div>
   );
}

export default Signup;