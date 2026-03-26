import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ResetPassword() {

   const { token } = useParams();
   const navigate = useNavigate();

   const [password, setPassword] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password/${token}`,
            {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ password })
            }
         );

         const data = await res.json();

         if (res.ok) {
            toast.success("Password reset successful 🎉");

            setTimeout(() => {
               navigate("/login");
            }, 1500);
         } else {
            toast.error(data.msg || "Reset failed");
         }

      } catch (err) {
         console.error(err);
         toast.error("Server error");
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

         <form
            onSubmit={handleSubmit}
            className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow w-full max-w-sm sm:max-w-md"
         >

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
               Reset Password
            </h2>

            <input
               type="password"
               placeholder="Enter new password"
               className="w-full mb-4 p-2 sm:p-3 border rounded text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
               onChange={(e) => setPassword(e.target.value)}
            />

            <button className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-indigo-700 transition">
               Reset Password
            </button>

         </form>
      </div>
   );
}

export default ResetPassword;