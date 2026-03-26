import { useParams } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import Navbar from "../components/Navbar";

function JavaPage() {

   const { slug } = useParams();
   const [openSidebar, setOpenSidebar] = useState(false);

   return (

      <div className="min-h-screen bg-white">

         

         {/* Mobile Sidebar Button */}
         <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b z-40 px-4 py-2 flex justify-between items-center">

            <span className="text-lg font-semibold text-gray-700">
               Java Topics
            </span>

            <button
               onClick={() => setOpenSidebar(true)}
               className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
            >
               Topics
            </button>

         </div>

         {/* Mobile Sidebar Drawer */}
         {openSidebar && (
            <div className="fixed inset-0 z-50 flex">

               {/* Sidebar */}
               <div className="fixed left-0 top-29 w-64 sm:w-72 bg-white shadow-xl">
                  <div className="h-full overflow-y-auto">
                     <Sidebar closeSidebar={() => setOpenSidebar(false)} />
                  </div>
               </div>

               {/* Overlay */}
               <div
                  className="flex-1 bg-black/40"
                  onClick={() => setOpenSidebar(false)}
               ></div>

            </div>
         )}

         {/* Main Layout */}
         <div className="flex pt-28 lg:pt-16 h-[calc(100vh-64px)]">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 bg-white">
               <Sidebar />
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white content-scroll overflow-y-auto px-4 sm:px-6 lg:px-10">
 

               {!slug ? (

                  <div className="h-full flex items-center justify-center text-center">

                     <div className="max-w-2xl">

                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 
                           bg-gradient-to-r from-indigo-600 to-purple-600 
                           bg-clip-text text-transparent">
                           Welcome to Java Tutorials
                        </h1>

                        <div className="w-20 sm:w-24 h-1 bg-indigo-500 mx-auto rounded mb-6"></div>

                        <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                           Select a topic from the sidebar to start learning Java.
                        </p>

                     </div>

                  </div>

               ) : (

                  <Content key={slug} slug={slug} />

               )}

            </div>

         </div>

      </div>

   )
}

export default JavaPage;


 



 