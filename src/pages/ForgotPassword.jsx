import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

   const navigate = useNavigate();

   const [form, setForm] = useState({
      identifier: "",
      password: "",
      confirmPassword: ""
   });

   const [otp, setOtp] = useState(Array(6).fill(""));
   const [showOtp, setShowOtp] = useState(false);
   const [timer, setTimer] = useState(30);

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

   // 🔥 SEND OTP / RESET PASSWORD
   const handleSubmit = async (e) => {
      e.preventDefault();

      // 🔥 STEP 1: send OTP
      if (!showOtp) {
         try {
            const res = await fetch(
               `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
               {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ identifier: form.identifier })
               }
            );

            const data = await res.json();

            if (res.ok) {
               toast.success("OTP sent to your email 📩");
               setShowOtp(true);
               setTimer(30);
            } else {
               toast.error(data.msg || "User not found");
            }

         } catch (err) {
            toast.error("Server error");
         }

         return;
      }

      // 🔥 STEP 2: reset password
      if (form.password !== form.confirmPassword) {
         return toast.error("Passwords do not match");
      }

      try {
         const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
            {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  email: form.identifier,
                  otp: otp.join(""),
                  password: form.password
               })
            }
         );

         const data = await res.json();

         if (res.ok) {
            toast.success("Password reset successful 🎉");
            setTimeout(() => navigate("/login"), 1500);
         } else {
            toast.error(data.msg || "Reset failed");
         }

      } catch (err) {
         toast.error("Server error");
      }
   };

   // 🔁 RESEND OTP
   const handleResend = async () => {
      try {
         const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
            {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ identifier: form.identifier })
            }
         );

         const data = await res.json();

         if (res.ok) {
            toast.success("OTP resent 📩");
            setTimer(30);
         } else {
            toast.error(data.msg);
         }

      } catch {
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

   // 📋 PASTE
   const handlePaste = (e) => {
      const pasteData = e.clipboardData.getData("text").trim();
      if (!/^\d{6}$/.test(pasteData)) return;

      setOtp(pasteData.split(""));
      inputsRef.current[5]?.focus();
   };

   // ⬅️ BACKSPACE
   const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
         inputsRef.current[index - 1].focus();
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

         <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow w-full max-w-md"
         >

            <h2 className="text-xl font-bold mb-4 text-center">
               Reset Password
            </h2>

            <input
               type="text"
               placeholder="Email or Username"
               className="w-full mb-3 p-2 border rounded"
               onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            />

            {showOtp && (
               <>
                  {/* 🎨 OTP BOXES */}
                  <div className="flex justify-between mb-3" onPaste={handlePaste}>
                     {otp.map((digit, i) => (
                        <input
                           key={i}
                           ref={(el) => (inputsRef.current[i] = el)}
                           maxLength="1"
                           value={digit}
                           onChange={(e) => handleOtpChange(e.target.value, i)}
                           onKeyDown={(e) => handleKeyDown(e, i)}
                           className="w-10 h-10 text-center border rounded text-lg"
                        />
                     ))}
                  </div>

                  {/* ⏳ TIMER */}
                  <p className="text-sm text-center mb-2">
                     {timer > 0 ? `Resend in ${timer}s` : "You can resend OTP"}
                  </p>

                  {/* 🔁 RESEND */}
                  {timer === 0 && (
                     <button
                        type="button"
                        onClick={handleResend}
                        className="text-indigo-600 text-sm mb-2"
                     >
                        Resend OTP
                     </button>
                  )}

                  <input
                     type="password"
                     placeholder="New Password"
                     className="w-full mb-3 p-2 border rounded"
                     onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />

                  <input
                     type="password"
                     placeholder="Confirm Password"
                     className="w-full mb-4 p-2 border rounded"
                     onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
               </>
            )}

            <button className="w-full bg-indigo-600 text-white py-2 rounded">
               {showOtp ? "Reset Password" : "Send OTP"}
            </button>

         </form>

      </div>
   );
}

export default ForgotPassword;