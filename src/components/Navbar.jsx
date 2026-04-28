import { Search, Menu, X } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {

   const [query, setQuery] = useState("");
   const [topics, setTopics] = useState([]);
   const [results, setResults] = useState([]);
   const [openMenu, setOpenMenu] = useState(false);
   const [mobileMenu, setMobileMenu] = useState(false);

   const navigate = useNavigate();
   const { user, logout } = useContext(AuthContext);

   useEffect(() => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/topics`)
         .then(res => res.json())
         .then(data => setTopics(data));
   }, []);

   useEffect(() => {
      setOpenMenu(false);
   }, [user]);

   useEffect(() => {
      if (openMenu) {
         const timer = setTimeout(() => {
            setOpenMenu(false);
         }, 10000);
         return () => clearTimeout(timer);
      }
   }, [openMenu]);

   const handleChange = (e) => {
      const value = e.target.value;
      setQuery(value);

      const search = value.trim().toLowerCase();

      if (!search) {
         setResults([]);
         return;
      }

      let matches = [];

      topics.forEach(topic => {
         const title = topic.title?.toLowerCase() || "";
         const slug = topic.slug?.toLowerCase() || "";
         const content = topic.content?.toLowerCase() || "";

         if (title.includes(search)) {
            matches.push({ ...topic, section: null });
            return;
         }

         if (slug.includes(search)) {
            matches.push({ ...topic, section: null });
            return;
         }

         const regex = /{#([a-z0-9\-]+)}/g;
         let match;

         while ((match = regex.exec(topic.content)) !== null) {
            const sectionId = match[1];

            if (sectionId.includes(search.replace(/\s+/g, "-"))) {
               matches.push({ ...topic, section: sectionId });
               break;
            }
         }

         if (content.includes(search) && matches.length < 5) {
            matches.push({ ...topic, section: null });
         }
      });

      setResults(matches.slice(0, 5));
   };

   const openTopic = (topic) => {
      setQuery("");
      setResults([]);

      const url = topic.section
         ? `/java/${topic.slug}#${topic.section}`
         : `/java/${topic.slug}`;

      navigate(url);
   };

   const handleEnter = (e) => {
      if (e.key === "Enter" && results.length > 0) {
         openTopic(results[0]);
      }
   };

   const handleLogout = () => {
      logout();

      toast.success("Logged out successfully 👋", {
         duration: 2000
      });

      setTimeout(() => {
         navigate("/");
      }, 2000);
   };

   return (
      <div className="fixed top-0 left-0 w-full h-14 sm:h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] z-50">

         <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-3 sm:px-6">

            {/* LOGO */}
            {/* <div onClick={() => navigate("/")} className="flex items-center cursor-pointer"> 
               <img src="/images/logo.png" alt="logo" className="h-4 sm:h-12 md:h-14 object-contain" />
               LearnStack
            </div> */}
            <div
               onClick={() => navigate("/")}
               className="flex items-center cursor-pointer"
            >
               <img
                  src="/images/logo.png"
                  alt="logo"
                  className="h-5 sm:h-10 md:h-12 object-contain"
               />

               <span className="text-sm text-blue-500 sm:text-xl md:text-2xl font-semibold leading-none">
                  LearnStack
               </span>
            </div>

            {/* SEARCH (desktop) */}
            <div className="hidden md:flex flex-1 justify-center px-4">
               <div className="relative w-full max-w-md">

                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                     type="text"
                     value={query}
                     onChange={handleChange}
                     onKeyDown={handleEnter}
                     placeholder="Search Java topics..."
                     className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  {results.length > 0 && (
                     <div className="absolute top-11 w-full bg-white border border-gray-100 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto z-50">
                        {results.map((topic, i) => (
                           <div
                              key={i}
                              onClick={() => openTopic(topic)}
                              className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                           >
                              {topic.title}
                           </div>
                        ))}
                     </div>
                  )}

               </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex items-center gap-3">

               {!user ? (
                  <>
                     <button onClick={() => navigate("/login")} className="text-sm px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Login
                     </button>

                     <button onClick={() => navigate("/signup")} className="text-sm px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:opacity-90 transition">
                        Signup
                     </button>
                  </>
               ) : (
                  <div className="relative">

                     <img
                        src={
                           user?.avatar
                              ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
                              : "https://via.placeholder.com/40"
                        }
                        onClick={() => setOpenMenu(!openMenu)}
                        className="w-9 h-9 rounded-full cursor-pointer border-2 border-indigo-500 shadow-sm"
                     />

                     {openMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                           <div className="px-4 py-3 text-sm border-b">
                              @{user?.username}
                           </div>

                           <button
                              onClick={() => {
                                 navigate("/profile");
                                 setOpenMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                           >
                              Profile
                           </button>

                           <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500"
                           >
                              Logout
                           </button>
                        </div>
                     )}

                  </div>
               )}

            </div>

            {/* MOBILE BUTTON */}
            <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
               {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

         </div>

         {/* 🔥 MOBILE MENU */}
         {mobileMenu && (
            <div className="fixed top-0 left-0 w-full h-screen bg-black/50 backdrop-blur-md z-50 flex">

               <div className="w-full bg-white rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex flex-col animate-slideUp">

                  {/* HEADER */}
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                     <img src="/images/logo.png" className="h-8" />
                     <button onClick={() => setMobileMenu(false)}>
                        <X size={22} />
                     </button>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">

                     <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        placeholder="Search..."
                        className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                     />

                     {results.length > 0 && (
                        <div className="bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                           {results.map((topic, i) => (
                              <div
                                 key={i}
                                 onClick={() => {
                                    openTopic(topic);
                                    setMobileMenu(false);
                                 }}
                                 className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                              >
                                 {topic.title}
                              </div>
                           ))}
                        </div>
                     )}

                     {!user ? (
                        <div className="space-y-3">
                           <button
                              onClick={() => {
                                 navigate("/login");
                                 setMobileMenu(false);
                              }}
                              className="w-full border border-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                           >
                              Login
                           </button>

                           <button
                              onClick={() => {
                                 navigate("/signup");
                                 setMobileMenu(false);
                              }}
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition"
                           >
                              Signup
                           </button>
                        </div>
                     ) : (
                        <div className="space-y-3">
                           <button
                              onClick={() => {
                                 navigate("/profile");
                                 setMobileMenu(false);
                              }}
                              className="w-full text-left py-3 border-b text-sm"
                           >
                              Profile
                           </button>

                           <button
                              onClick={() => {
                                 handleLogout();
                                 setMobileMenu(false);
                              }}
                              className="w-full text-left py-3 text-sm text-red-500"
                           >
                              Logout
                           </button>
                        </div>
                     )}

                  </div>

               </div>

            </div>
         )}

      </div>
   );
}

export default Navbar;

 