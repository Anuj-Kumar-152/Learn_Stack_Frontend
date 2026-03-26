import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Link added
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

function Profile() {

   const { user, updateUser } = useContext(AuthContext);
   const token = localStorage.getItem("token");
   const navigate = useNavigate();

   const fileRef = useRef(null);

   // 🔥 ONLY THIS PART CHANGE (top state)

   const [form, setForm] = useState({
      name: user?.name || "",
      bio: user?.bio || "",
      college: user?.college || "",
      username: user?.username || "",
      github: user?.github || "",       // ✅ NEW
      linkedin: user?.linkedin || "",   // ✅ NEW
      skills: user?.skills || []        // ✅ NEW
   });

   const [preview, setPreview] = useState(null);
   const [loading, setLoading] = useState(false);

   const [usernameStatus, setUsernameStatus] = useState(null);
   const [checking, setChecking] = useState(false);

   const [colleges, setColleges] = useState([]);
   const [collegeLoading, setCollegeLoading] = useState(false);
   const [showDropdown, setShowDropdown] = useState(false);

   // 🔥 USERNAME CHECK
   useEffect(() => {
      if (!form.username || form.username === user?.username) {
         setUsernameStatus(null);
         return;
      }

      const timer = setTimeout(async () => {
         try {
            setChecking(true);

            const res = await fetch(
               `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-username?username=${form.username}`
            );

            const data = await res.json();
            setUsernameStatus(data.available);

         } catch (err) {
            console.error(err);
         } finally {
            setChecking(false);
         }
      }, 500);

      return () => clearTimeout(timer);

   }, [form.username]);

   // 🔥 COLLEGE SEARCH
   useEffect(() => {
      if (!form.college || form.college.length < 2) {
         setColleges([]);
         setCollegeLoading(false);
         return;
      }

      const controller = new AbortController();

      const timer = setTimeout(async () => {
         try {
            setCollegeLoading(true);

            const res = await fetch(
               `http://universities.hipolabs.com/search?name=${form.college}`,
               { signal: controller.signal }
            );

            const data = await res.json();

            const uniqueColleges = Array.from(
               new Map(
                  data.map(item => [`${item.name}-${item.country}`, item])
               ).values()
            );

            setColleges(uniqueColleges.slice(0, 6));
            setShowDropdown(true);

         } catch (err) {
            if (err.name !== "AbortError") {
               console.error(err);
            }
         } finally {
            setCollegeLoading(false);
         }
      }, 400);

      return () => {
         controller.abort();
         clearTimeout(timer);
      };

   }, [form.college]);

   // 🔥 AUTO CLOSE DROPDOWN
   useEffect(() => {
      const match = colleges.find(
         c => c.name.toLowerCase() === form.college.toLowerCase()
      );

      if (match) {
         setShowDropdown(false);
      }
   }, [form.college, colleges]);

   // 🔥 OUTSIDE CLICK
   useEffect(() => {
      const handleClick = () => setShowDropdown(false);
      window.addEventListener("click", handleClick);

      return () => window.removeEventListener("click", handleClick);
   }, []);

   // 🔥 avatar click
   const handleAvatarClick = () => {
      fileRef.current.click();
   };

   // 🔥 avatar upload
   const uploadAvatar = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("avatar", file);

      try {
         setLoading(true);

         const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/avatar`,
            {
               method: "POST",
               headers: {
                  Authorization: "Bearer " + token
               },
               body: formData
            }
         );

         const data = await res.json();
         updateUser(data);

         toast.success("Avatar updated 📸");

      } catch (err) {
         console.error(err);
         toast.error("Upload failed");
      } finally {
         setLoading(false);
      }
   };

   // 🔥 profile update
   const updateProfile = async () => {

      if (form.name.length < 2) {
         toast.error("Name too short");
         return;
      }

      if (usernameStatus === false) {
         toast.error("Username already taken ❌");
         return;
      }

      try {
         setLoading(true);

         const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/update`,
            {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token
               },
               body: JSON.stringify(form)
            }
         );

         const text = await res.text();
         const data = text ? JSON.parse(text) : {};

         if (!res.ok) {
            toast.error(data.msg || "Update failed");
            return;
         }

         updateUser(data);

         toast.success("Profile updated successfully 🎉");

         setTimeout(() => {
            navigate("/");
         }, 1200);

      } catch (err) {
         console.error(err);
         toast.error("Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16 sm:pt-20 px-3 sm:px-4">

         <div className="w-full max-w-lg sm:max-w-xl">

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 text-center">
               Profile Settings
            </h2>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-5 sm:mb-6">
               <div className="relative group">
                  <img
                     src={
                        preview
                           ? preview
                           : user?.avatar
                              ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
                              : "/default-avatar.png"
                     }
                     className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border shadow"
                  />

                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        handleAvatarClick();
                     }}
                     className="absolute bottom-0 right-3 sm:right-5 bg-indigo-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                  >
                     Change
                  </button>

                  <input
                     type="file"
                     ref={fileRef}
                     onChange={uploadAvatar}
                     className="hidden"
                  />
               </div>
            </div>

            {/* Form */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg space-y-4 sm:space-y-6">

               {/* Name */}
               <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                     Full Name
                  </label>
                  <input
                     value={form.name}
                     onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                     }
                     className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="Enter your full name"
                  />
               </div>

               {/* Username */}
               <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                     Username
                  </label>
                  <input
                     value={form.username}
                     onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                     }
                     className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="Choose a username"
                  />

                  {checking && (
                     <p className="text-gray-400 text-[10px] sm:text-xs mt-1">Checking...</p>
                  )}

                  {usernameStatus !== null && !checking && (
                     <p className={`text-[10px] sm:text-xs mt-1 ${usernameStatus ? "text-green-600" : "text-red-500"}`}>
                        {usernameStatus ? "Username available" : "Username taken"}
                     </p>
                  )}
               </div>

               {/* College */}
               <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                     College
                  </label>

                  <input
                     value={form.college}
                     onChange={(e) =>
                        setForm({ ...form, college: e.target.value })
                     }
                     onFocus={() => setShowDropdown(true)}
                     className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="Search your college..."
                  />

                  {showDropdown && (
                     <div className="absolute w-full bg-white border rounded-lg shadow mt-1 max-h-40 sm:max-h-48 overflow-y-auto z-10">

                        {collegeLoading && (
                           <p className="px-3 sm:px-4 py-2 text-gray-400 text-xs sm:text-sm">
                              Searching...
                           </p>
                        )}

                        {!collegeLoading && colleges.length === 0 && (
                           <p className="px-3 sm:px-4 py-2 text-gray-400 text-xs sm:text-sm">
                              No results found
                           </p>
                        )}

                        {!collegeLoading &&
                           colleges.map((item, i) => (
                              <div
                                 key={i}
                                 onClick={() => {
                                    setForm({ ...form, college: item.name });
                                    setShowDropdown(false);
                                 }}
                                 className="px-3 sm:px-4 py-2 hover:bg-indigo-50 cursor-pointer text-xs sm:text-sm"
                              >
                                 {item.name}, {item.country}
                              </div>
                           ))}
                     </div>
                  )}
               </div>

               {/* Bio */}
               <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                     Bio
                  </label>

                  <textarea
                     value={form.bio}
                     onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                     }
                     className="w-full p-2 sm:p-3 border rounded-lg resize-none h-24 sm:h-28 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="Write something about yourself..."
                  />
               </div>

               {/* GitHub */}
               <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                     GitHub
                  </label>
                  <input
                     value={form.github}
                     onChange={(e) =>
                        setForm({ ...form, github: e.target.value })
                     }
                     className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="https://github.com/username"
                  />
               </div>

               {/* LinkedIn */}
               <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                     LinkedIn
                  </label>
                  <input
                     value={form.linkedin}
                     onChange={(e) =>
                        setForm({ ...form, linkedin: e.target.value })
                     }
                     className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="https://linkedin.com/in/username"
                  />
               </div>

               {/* Skills */}
               <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                     Skills
                  </label>
                  <input
                     value={form.skills.join(", ")}
                     onChange={(e) =>
                        setForm({
                           ...form,
                           skills: e.target.value
                              .split(",")
                              .map(s => s.trim())
                        })
                     }
                     className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
                     placeholder="React, Node, MongoDB"
                  />
               </div>

               {/* Button */}
               <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:opacity-90 transition"
               >
                  {loading ? "Saving..." : "Save Changes"}
               </button>

            </div>

         </div>

      </div>
   );
}

export default Profile;






 



 

 