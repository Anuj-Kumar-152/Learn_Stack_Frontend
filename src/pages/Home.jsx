import { useNavigate } from "react-router-dom";

function Home() {

   const navigate = useNavigate();

   return (

      <div className="min-h-screen bg-slate-50 flex items-center">

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            {/* Top Text Section */}

            <div className="text-center mb-12">

               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  Learn Programming
                  <span className="block text-indigo-600">
                     The Simple Way
                  </span>
               </h1>

               <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  Beginner friendly programming tutorials with
                  clear explanations and practical examples.
               </p>

               <button
                  onClick={() => navigate("/java")}
                  className="cursor-pointer mt-8 bg-indigo-600 text-white px-6 sm:px-7 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
               >
                  Start Learning
               </button>

            </div>


            {/* Cards Section */}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">

               {/* Java Card */}

               <div
                  onClick={() => navigate("/java")}
                  className="cursor-pointer bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition"
               >
                  <div className="text-3xl mb-3">☕</div>

                  <h3 className="font-semibold text-lg">
                     Java
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                     Learn Java step by step
                  </p>
               </div>


               {/* JavaScript */}

               <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md opacity-70">
                  <div className="text-3xl mb-3">🟨</div>

                  <h3 className="font-semibold text-lg">
                     JavaScript
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                     Coming soon
                  </p>
               </div>


               {/* SQL */}

               <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md opacity-70">
                  <div className="text-3xl mb-3">🗄️</div>

                  <h3 className="font-semibold text-lg">
                     SQL
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                     Coming soon
                  </p>
               </div>


               {/* More */}

               <div className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white p-5 sm:p-6 rounded-xl shadow-md">

                  <h3 className="font-semibold text-lg">
                     More Tutorials
                  </h3>

                  <p className="text-sm mt-2 opacity-90">
                     More programming tutorials coming soon.
                  </p>

               </div>

            </div>


            {/* 🚀 NEW CODING SECTION (ADD ONLY) */}

            <div className="mt-20 text-center">

               <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Practice Coding 💻
               </h2>

               <p className="text-gray-600 mb-6">
                  Solve real coding problems like LeetCode & GFG
               </p>

               <button
                  onClick={() => navigate("/problems")}
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
               >
                  Start Solving Problems
               </button>

            </div>

         </div>

      </div>

   );
}

export default Home;