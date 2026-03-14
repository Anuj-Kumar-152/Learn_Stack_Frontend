import { useState, useEffect } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function Sidebar({ closeSidebar }) {

   const navigate = useNavigate();
   const { slug } = useParams();

   const categories = [
      "Java Basics",
      "OOP & Interfaces",
      "Collections",
      "Exception Handling"
   ];

   const [open, setOpen] = useState(null);
   const [topics, setTopics] = useState([]);

   const loadTopics = (category) => {

      if (open === category) {
         setOpen(null);
         return;
      }

      setOpen(category);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/topics/category/${category}`)
         .then(res => res.json())
         .then(data => setTopics(data));
   };

   useEffect(() => {

      if (!slug) return;

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/topics/${slug}`)
         .then(res => res.json())
         .then(data => {

            if (data?.category) {

               setOpen(data.category);

               fetch(`${import.meta.env.VITE_BACKEND_URL}/api/topics/category/${data.category}`)
                  .then(res => res.json())
                  .then(data => setTopics(data));

            }

         });

   }, [slug]);

   return (

      <div className="w-64 lg:w-72 flex-shrink-0">

         {/* Logo (desktop only) */}
         <div className="hidden lg:flex h-32 sm:h-36 m-3 sm:m-5 rounded-xl items-center justify-center bg-amber-200 border-b">

            <img
               src="/image.png"
               alt="logo"
               className="h-24 sm:h-28 lg:h-32 w-auto rounded-xl"
            />

         </div>

         {/* Sidebar Content */}

         <div className="bg-gray-50 border-r border-gray-300 h-full overflow-y-auto">

            <div className="px-4 sm:px-6 py-3 text-base sm:text-lg text-blue-500 bg-gray-200 border-b font-bold">
               Welcome to Learn Stack
            </div>

            {categories.map(cat => (

               <div key={cat} className="border-b">

                  <div
                     onClick={() => loadTopics(cat)}
                     className="flex items-center justify-between px-4 sm:px-6 py-3 cursor-pointer hover:bg-gray-200 transition"
                  >

                     <div className="flex items-center gap-2 sm:gap-3">
                        <BookOpen size={18} className="text-indigo-500" />

                        <span className="text-gray-800 font-medium text-sm sm:text-base">
                           {cat}
                        </span>
                     </div>

                     <ChevronDown size={18} />

                  </div>

                  {open === cat &&
                      
                     topics.map(topic => (

                        <div
                           key={topic._id}
                           onClick={() => {
                              navigate(`/java/${topic.slug}`);
                              if (closeSidebar) closeSidebar();
                           }}
                           className={`pl-10 sm:pl-12 pr-4 sm:pr-6 py-1 text-sm cursor-pointer
                                 ${slug === topic.slug
                                 ? "bg-indigo-100 text-indigo-700 font-semibold border-l-4 border-indigo-500"
                                 : "text-gray-700 hover:bg-gray-200"
                              }`}
                        >
                           {topic.title}
                        </div>

                     ))
                  }

               </div>

            ))}

         </div>

      </div>

   )

}

export default Sidebar;






 




 