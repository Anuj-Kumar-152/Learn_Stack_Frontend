import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

   const [query, setQuery] = useState("");
   const [topics, setTopics] = useState([]);
   const [results, setResults] = useState([]);

   const navigate = useNavigate();

   useEffect(() => {

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/topics`)
         .then(res => res.json())
         .then(data => setTopics(data));

   }, []);

   const handleChange = (e) => {

      const value = e.target.value;
      setQuery(value);

      if (value.trim() === "") {
         setResults([]);
         return;
      }

      const filtered = topics.filter(topic =>
         topic.title.toLowerCase().includes(value.toLowerCase())
      );

      setResults(filtered.slice(0, 5));

   };

   const openTopic = (slug) => {

      setQuery("");
      setResults([]);

      navigate(`/java/${slug}`);

   };

   const handleEnter = (e) => {

      if (e.key === "Enter" && results.length > 0) {
         openTopic(results[0].slug);
      }

   };

   return (

      <div className="fixed top-0 left-0 w-full h-16 bg-white border-b flex items-center px-4 sm:px-6 z-50">

         {/* Logo */}

         <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
         >

            <span className="font-semibold text-lg sm:text-xl lg:text-2xl text-gray-800">
               Learn Stack
            </span>

         </div>


         {/* Search */}

         <div className="ml-auto relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">

            <Search
               size={18}
               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
               type="text"
               value={query}
               onChange={handleChange}
               onKeyDown={handleEnter}
               placeholder="Search Java topics..."
               className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 outline-none text-sm sm:text-base"
            />

            {/* Suggestions */}

            {results.length > 0 && (

               <div className="absolute top-12 w-full bg-white border rounded-lg shadow-md overflow-hidden">

                  {results.map(topic => (

                     <div
                        key={topic._id}
                        onClick={() => openTopic(topic.slug)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                     >
                        {topic.title}
                     </div>

                  ))}

               </div>

            )}

         </div>

      </div>

   )

}

export default Navbar;


 