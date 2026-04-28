import { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import CodingProfile from "./CodingProfile"; // 🔥 ADD

function Profile() {

   const { user, updateUser } = useContext(AuthContext);
   const token = localStorage.getItem("token");

   const fileRef = useRef(null);
   const [tab, setTab] = useState("overview");

   const [form, setForm] = useState({
      name: "",
      bio: "",
      college: "",
      username: ""
   });

   const [preview, setPreview] = useState(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (user) {
         setForm({
            name: user.name || "",
            bio: user.bio || "",
            college: user.college || "",
            username: user.username || ""
         });
      }
   }, [user]);

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
               headers: { Authorization: "Bearer " + token }
            });
            const data = await res.json();
            if (data?._id) updateUser(data);
         } catch { }
      };
      fetchUser();
   }, []);

   const solved = user?.solvedQuestions ?? [];

   const handleAvatarClick = () => fileRef.current.click();

   const uploadAvatar = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("avatar", file);

      try {
         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/avatar`, {
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            body: formData
         });
         const data = await res.json();
         updateUser(data);
         toast.success("Avatar updated");
      } catch {
         toast.error("Upload failed");
      }
   };

   const updateProfile = async () => {
      try {
         setLoading(true);

         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: "Bearer " + token
            },
            body: JSON.stringify(form)
         });

         const data = await res.json();
         updateUser(data);

         toast.success("Updated");
         setTab("overview");

      } catch {
         toast.error("Error");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-100 p-6">

         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="md:col-span-2 space-y-6">

               {/* HEADER */}
               <div className="bg-white p-6 rounded-xl shadow flex items-center gap-6">

                  <div className="relative">
                     <img
                        src={
                           preview
                              ? preview
                              : user?.avatar
                                 ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
                                 : "/default-avatar.png"
                        }
                        className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
                     />

                     <button
                        onClick={handleAvatarClick}
                        className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
                     >
                        Edit
                     </button>

                     <input type="file" ref={fileRef} onChange={uploadAvatar} className="hidden" />
                  </div>

                  <div className="flex-1">
                     <h2 className="text-2xl font-bold">{user?.name}</h2>
                     <p className="text-gray-500">@{user?.username}</p>
                     <p className="text-sm text-gray-400">{user?.college}</p>

                     <span className="inline-block mt-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                        Score: {user?.score || 0}
                     </span>
                  </div>

                  <button
                     onClick={() => setTab("edit")}
                     className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                     Edit Profile
                  </button>
               </div>

               {/* TABS */}
               <div className="bg-white p-3 rounded shadow flex gap-6">
                  <button
                     onClick={() => setTab("overview")}
                     className={tab === "overview" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : ""}
                  >
                     Overview
                  </button>

                  <button
                     onClick={() => setTab("coding")}
                     className={tab === "coding" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : ""}
                  >
                     Coding
                  </button>
               </div>

               {/* OVERVIEW */}
               {tab === "overview" && (
                  <div className="space-y-4">

                     <div className="bg-white p-5 rounded-xl shadow">
                        <div className="flex justify-between">
                           <h3 className="font-semibold">About Me</h3>
                           <button onClick={() => setTab("edit")}>✏</button>
                        </div>
                        <p className="text-gray-500 mt-2">{user?.bio || "Add your bio"}</p>
                     </div>

                     <div className="bg-white p-5 rounded-xl shadow">
                        <div className="flex justify-between">
                           <h3 className="font-semibold">Education</h3>
                           <button onClick={() => setTab("edit")}>✏</button>
                        </div>
                        <p className="mt-2">{user?.college || "Add your college"}</p>
                     </div>

                  </div>
               )}

               {/* CODING */}
               {tab === "coding" && (
                  <CodingProfile user={user} />   // 🔥 MAIN FIX
               )}

               {/* EDIT */}
               {tab === "edit" && (
                  <div className="bg-white p-6 rounded-2xl shadow space-y-4">

                     <div>
                        <label className="text-sm text-gray-500">Full Name</label>
                        <input
                           className="w-full p-2 border rounded"
                           value={form.name}
                           onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                     </div>

                     <div>
                        <label className="text-sm text-gray-500">Username</label>
                        <input
                           className="w-full p-2 border rounded"
                           value={form.username}
                           onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                     </div>

                     <div>
                        <label className="text-sm text-gray-500">College</label>
                        <input
                           className="w-full p-2 border rounded"
                           value={form.college}
                           onChange={(e) => setForm({ ...form, college: e.target.value })}
                        />
                     </div>

                     <div>
                        <label className="text-sm text-gray-500">Bio</label>
                        <textarea
                           className="w-full p-2 border rounded"
                           value={form.bio}
                           onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        />
                     </div>

                     <button
                        onClick={updateProfile}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                     >
                        {loading ? "Saving..." : "Save Changes"}
                     </button>

                  </div>
               )}

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">

               <div className="bg-white p-4 rounded-xl shadow">
                  <h3 className="font-semibold mb-2">Stats</h3>
                  <p>Score: {user?.score}</p>
                  <p>Solved: {solved.length}</p>
               </div>

               <div className="bg-white p-4 rounded-xl shadow">
                  <h3 className="font-semibold mb-2">Quick Info</h3>
                  <p>@{user?.username}</p>
                  <p>{user?.college}</p>
               </div>

            </div>

         </div>

      </div>
   );
}

export default Profile;






// import { useContext, useRef, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function Profile() {

//    const { user, updateUser } = useContext(AuthContext);
//    const token = localStorage.getItem("token");

//    const fileRef = useRef(null);
//    const [tab, setTab] = useState("overview");

//    const [form, setForm] = useState({
//       name: user?.name || "",
//       bio: user?.bio || "",
//       college: user?.college || "",
//       username: user?.username || "",
//       github: user?.github || "",
//       linkedin: user?.linkedin || "",
//       skills: user?.skills || []
//    });

//    const [preview, setPreview] = useState(null);
//    const [loading, setLoading] = useState(false);

//    useEffect(() => {
//       const fetchUser = async () => {
//          try {
//             const res = await fetch(
//                `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
//                {
//                   headers: {
//                      Authorization: "Bearer " + token
//                   }
//                }
//             );

//             const data = await res.json();
//             updateUser(data);

//          } catch (err) {
//             console.error(err);
//          }
//       };

//       fetchUser();
//    }, []);

//    const solved = user?.solvedQuestions ?? [];

//    const basic = solved.filter(q => q.difficulty === "Basic").length;
//    const easy = solved.filter(q => q.difficulty === "Easy").length;
//    const medium = solved.filter(q => q.difficulty === "Medium").length;
//    const hard = solved.filter(q => q.difficulty === "Hard").length;

//    const handleAvatarClick = () => fileRef.current.click();

//    const uploadAvatar = async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       setPreview(URL.createObjectURL(file));

//       const formData = new FormData();
//       formData.append("avatar", file);

//       try {
//          setLoading(true);

//          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/avatar`, {
//             method: "POST",
//             headers: { Authorization: "Bearer " + token },
//             body: formData
//          });

//          const data = await res.json();
//          updateUser(data);

//          toast.success("Avatar updated");

//       } catch {
//          toast.error("Upload failed");
//       } finally {
//          setLoading(false);
//       }
//    };

//    const updateProfile = async () => {
//       if (form.name.length < 2) {
//          toast.error("Name too short");
//          return;
//       }

//       try {
//          setLoading(true);

//          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update`, {
//             method: "PUT",
//             headers: {
//                "Content-Type": "application/json",
//                Authorization: "Bearer " + token
//             },
//             body: JSON.stringify(form)
//          });

//          const data = await res.json();

//          if (!res.ok) {
//             toast.error(data.msg);
//             return;
//          }

//          updateUser(data);
//          toast.success("Profile updated 🎉");

//       } catch {
//          toast.error("Error");
//       } finally {
//          setLoading(false);
//       }
//    };

//    return (
//       <div className="min-h-screen bg-gray-100 py-8 px-4">
//          <div className="max-w-6xl mx-auto space-y-6">

//             {/* HEADER */}
//             <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6">

//                <div className="relative">
//                   <img
//                      src={
//                         preview
//                            ? preview
//                            : user?.avatar
//                               ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
//                               : "/default-avatar.png"
//                      }
//                      className="w-28 h-28 rounded-full border-4 border-indigo-500"
//                   />
//                   <button
//                      onClick={handleAvatarClick}
//                      className="absolute bottom-0 right-1 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
//                   >
//                      Edit
//                   </button>
//                   <input type="file" ref={fileRef} onChange={uploadAvatar} className="hidden" />
//                </div>

//                <div className="text-center md:text-left flex-1">
//                   <h2 className="text-2xl font-bold">{user?.name}</h2>
//                   <p className="text-gray-500">@{user?.username}</p>
//                   <p className="text-sm text-gray-400">{user?.college || "Add your college"}</p>

//                   <div className="mt-2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full inline-block font-semibold">
//                      Score: {user?.score || 0}
//                   </div>
//                </div>

//                <button
//                   onClick={() => setTab("profile")}
//                   className="border px-4 py-2 rounded-lg hover:bg-gray-100"
//                >
//                   Edit Profile
//                </button>
//             </div>

//             {/* TABS */}
//             <div className="flex gap-6 border-b pb-2">
//                <button onClick={() => setTab("overview")} className={tab === "overview" ? "text-green-600 border-b-2 border-green-600" : ""}>
//                   Overview
//                </button>
//                <button onClick={() => setTab("coding")} className={tab === "coding" ? "text-green-600 border-b-2 border-green-600" : ""}>
//                   Coding Score
//                </button>
//                <button onClick={() => setTab("profile")} className={tab === "profile" ? "text-green-600 border-b-2 border-green-600" : ""}>
//                   Edit
//                </button>
//             </div>

//             {/* OVERVIEW */}
//             {tab === "overview" && (
//                <div className="space-y-6">

//                   <div className="bg-white p-5 rounded-xl shadow">
//                      <div className="flex justify-between items-center mb-2">
//                         <h3 className="font-semibold">About Me</h3>
//                         <button onClick={() => setTab("profile")}>✏</button>
//                      </div>
//                      {user?.bio || <p className="text-gray-400">Let others know more about you.</p>}
//                   </div>

//                   <div className="bg-white p-5 rounded-xl shadow">
//                      <div className="flex justify-between items-center mb-2">
//                         <h3 className="font-semibold">Experience</h3>
//                         <button onClick={() => setTab("profile")}>✏</button>
//                      </div>
//                      <p className="text-gray-400">Add your work experience.</p>
//                   </div>

//                   <div className="bg-white p-5 rounded-xl shadow">
//                      <div className="flex justify-between items-center mb-2">
//                         <h3 className="font-semibold">Qualifications</h3>
//                         <button onClick={() => setTab("profile")}>✏</button>
//                      </div>

//                      {user?.college ? (
//                         <div className="border rounded p-3">
//                            <p className="font-medium">B.Tech</p>
//                            <p className="text-gray-500 text-sm">{user.college}</p>
//                         </div>
//                      ) : (
//                         <p className="text-gray-400">Add your education details.</p>
//                      )}
//                   </div>

//                </div>
//             )}

//             {/* CODING */}
//             {tab === "coding" && (
//                <>
//                   <div className="grid grid-cols-4 gap-4">
//                      <div className="bg-white p-4 rounded-xl shadow text-center">Basic {basic}</div>
//                      <div className="bg-white p-4 rounded-xl shadow text-center">Easy {easy}</div>
//                      <div className="bg-white p-4 rounded-xl shadow text-center">Medium {medium}</div>
//                      <div className="bg-white p-4 rounded-xl shadow text-center">Hard {hard}</div>
//                   </div>

//                   <div className="bg-white rounded-2xl shadow overflow-hidden">
//                      <table className="w-full text-sm">
//                         <thead className="bg-gray-200">
//                            <tr>
//                               <th className="p-3 text-left">Question</th>
//                               <th>Difficulty</th>
//                               <th>Marks</th>
//                               <th>Status</th>
//                            </tr>
//                         </thead>
//                         <tbody>
//                            {solved.map((q, i) => (
//                               <tr key={i} className="border-t">
//                                  <td className="p-3">{q.title}</td>
//                                  <td>{q.difficulty}</td>
//                                  <td>{q.difficulty === "Basic" ? 1 : q.difficulty === "Easy" ? 2 : q.difficulty === "Medium" ? 4 : 8}</td>
//                                  <td className="text-green-500">✔</td>
//                               </tr>
//                            ))}
//                         </tbody>
//                      </table>
//                   </div>
//                </>
//             )}

//             {/* PROFILE EDIT */}
//             {tab === "profile" && (
//                <div className="bg-white p-6 rounded-2xl shadow space-y-4">
//                   <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border" />
//                   <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full p-2 border" />
//                   <input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="w-full p-2 border" />
//                   <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full p-2 border" />
//                   <button onClick={updateProfile} className="bg-indigo-600 text-white px-4 py-2 rounded">
//                      {loading ? "Saving..." : "Save"}
//                   </button>
//                </div>
//             )}

//          </div>
//       </div>
//    );
// }

// export default Profile;






// import { useContext, useRef, useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom"; // ✅ Link added
// import toast from "react-hot-toast";
// import { AuthContext } from "../context/AuthContext";

// function Profile() {

//    const { user, updateUser } = useContext(AuthContext);
//    const token = localStorage.getItem("token");
//    const navigate = useNavigate();

//    const fileRef = useRef(null);

//    // 🔥 ONLY THIS PART CHANGE (top state)

//    const [form, setForm] = useState({
//       name: user?.name || "",
//       bio: user?.bio || "",
//       college: user?.college || "",
//       username: user?.username || "",
//       github: user?.github || "",       // ✅ NEW
//       linkedin: user?.linkedin || "",   // ✅ NEW
//       skills: user?.skills || []        // ✅ NEW
//    });

//    const [preview, setPreview] = useState(null);
//    const [loading, setLoading] = useState(false);

//    const [usernameStatus, setUsernameStatus] = useState(null);
//    const [checking, setChecking] = useState(false);

//    const [colleges, setColleges] = useState([]);
//    const [collegeLoading, setCollegeLoading] = useState(false);
//    const [showDropdown, setShowDropdown] = useState(false);

//    // 🔥 USERNAME CHECK
//    useEffect(() => {
//       if (!form.username || form.username === user?.username) {
//          setUsernameStatus(null);
//          return;
//       }

//       const timer = setTimeout(async () => {
//          try {
//             setChecking(true);

//             const res = await fetch(
//                `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-username?username=${form.username}`
//             );

//             const data = await res.json();
//             setUsernameStatus(data.available);

//          } catch (err) {
//             console.error(err);
//          } finally {
//             setChecking(false);
//          }
//       }, 500);

//       return () => clearTimeout(timer);

//    }, [form.username]);

//    // 🔥 COLLEGE SEARCH
//    useEffect(() => {
//       if (!form.college || form.college.length < 2) {
//          setColleges([]);
//          setCollegeLoading(false);
//          return;
//       }

//       const controller = new AbortController();

//       const timer = setTimeout(async () => {
//          try {
//             setCollegeLoading(true);

//             const res = await fetch(
//                `http://universities.hipolabs.com/search?name=${form.college}`,
//                { signal: controller.signal }
//             );

//             const data = await res.json();

//             const uniqueColleges = Array.from(
//                new Map(
//                   data.map(item => [`${item.name}-${item.country}`, item])
//                ).values()
//             );

//             setColleges(uniqueColleges.slice(0, 6));
//             setShowDropdown(true);

//          } catch (err) {
//             if (err.name !== "AbortError") {
//                console.error(err);
//             }
//          } finally {
//             setCollegeLoading(false);
//          }
//       }, 400);

//       return () => {
//          controller.abort();
//          clearTimeout(timer);
//       };

//    }, [form.college]);

//    // 🔥 AUTO CLOSE DROPDOWN
//    useEffect(() => {
//       const match = colleges.find(
//          c => c.name.toLowerCase() === form.college.toLowerCase()
//       );

//       if (match) {
//          setShowDropdown(false);
//       }
//    }, [form.college, colleges]);

//    // 🔥 OUTSIDE CLICK
//    useEffect(() => {
//       const handleClick = () => setShowDropdown(false);
//       window.addEventListener("click", handleClick);

//       return () => window.removeEventListener("click", handleClick);
//    }, []);

//    // 🔥 avatar click
//    const handleAvatarClick = () => {
//       fileRef.current.click();
//    };

//    // 🔥 avatar upload
//    const uploadAvatar = async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       setPreview(URL.createObjectURL(file));

//       const formData = new FormData();
//       formData.append("avatar", file);

//       try {
//          setLoading(true);

//          const res = await fetch(
//             `${import.meta.env.VITE_BACKEND_URL}/api/auth/avatar`,
//             {
//                method: "POST",
//                headers: {
//                   Authorization: "Bearer " + token
//                },
//                body: formData
//             }
//          );

//          const data = await res.json();
//          updateUser(data);

//          toast.success("Avatar updated 📸");

//       } catch (err) {
//          console.error(err);
//          toast.error("Upload failed");
//       } finally {
//          setLoading(false);
//       }
//    };

//    // 🔥 profile update
//    const updateProfile = async () => {

//       if (form.name.length < 2) {
//          toast.error("Name too short");
//          return;
//       }

//       if (usernameStatus === false) {
//          toast.error("Username already taken ❌");
//          return;
//       }

//       try {
//          setLoading(true);

//          const res = await fetch(
//             `${import.meta.env.VITE_BACKEND_URL}/api/auth/update`,
//             {
//                method: "PUT",
//                headers: {
//                   "Content-Type": "application/json",
//                   Authorization: "Bearer " + token
//                },
//                body: JSON.stringify(form)
//             }
//          );

//          const text = await res.text();
//          const data = text ? JSON.parse(text) : {};

//          if (!res.ok) {
//             toast.error(data.msg || "Update failed");
//             return;
//          }

//          updateUser(data);

//          toast.success("Profile updated successfully 🎉");

//          setTimeout(() => {
//             navigate("/");
//          }, 1200);

//       } catch (err) {
//          console.error(err);
//          toast.error("Something went wrong");
//       } finally {
//          setLoading(false);
//       }
//    };

//    return (
//       <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16 sm:pt-20 px-3 sm:px-4">

//          <div className="w-full max-w-lg sm:max-w-xl">

//             <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 text-center">
//                Profile Settings
//             </h2>

//             {/* Avatar */}
//             <div className="flex flex-col items-center mb-5 sm:mb-6">
//                <div className="relative group">
//                   <img
//                      src={
//                         preview
//                            ? preview
//                            : user?.avatar
//                               ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
//                               : "/default-avatar.png"
//                      }
//                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border shadow"
//                   />

//                   <button
//                      onClick={(e) => {
//                         e.stopPropagation();
//                         handleAvatarClick();
//                      }}
//                      className="absolute bottom-0 right-3 sm:right-5 bg-indigo-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
//                   >
//                      Change
//                   </button>

//                   <input
//                      type="file"
//                      ref={fileRef}
//                      onChange={uploadAvatar}
//                      className="hidden"
//                   />
//                </div>
//             </div>

//             {/* 🔥 ADD THIS (SCORE DISPLAY) */}
//             <div className="mt-3 text-center">
//                <p className="text-gray-500 text-xs sm:text-sm">Total Score</p>
//                <p className="text-xl sm:text-2xl font-bold text-indigo-600">
//                   {user?.score || 0}
//                </p>
//             </div>


//             {/* Form */}
//             <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg space-y-4 sm:space-y-6">

//                {/* Name */}
//                <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
//                      Full Name
//                   </label>
//                   <input
//                      value={form.name}
//                      onChange={(e) =>
//                         setForm({ ...form, name: e.target.value })
//                      }
//                      className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                      placeholder="Enter your full name"
//                   />
//                </div>

//                {/* Username */}
//                <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
//                      Username
//                   </label>
//                   <input
//                      value={form.username}
//                      onChange={(e) =>
//                         setForm({ ...form, username: e.target.value })
//                      }
//                      className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                      placeholder="Choose a username"
//                   />

//                   {checking && (
//                      <p className="text-gray-400 text-[10px] sm:text-xs mt-1">Checking...</p>
//                   )}

//                   {usernameStatus !== null && !checking && (
//                      <p className={`text-[10px] sm:text-xs mt-1 ${usernameStatus ? "text-green-600" : "text-red-500"}`}>
//                         {usernameStatus ? "Username available" : "Username taken"}
//                      </p>
//                   )}
//                </div>

//                {/* College */}
//                <div className="relative" onClick={(e) => e.stopPropagation()}>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
//                      College
//                   </label>

//                   <input
//                      value={form.college}
//                      onChange={(e) =>
//                         setForm({ ...form, college: e.target.value })
//                      }
//                      onFocus={() => setShowDropdown(true)}
//                      className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                      placeholder="Search your college..."
//                   />

//                   {showDropdown && (
//                      <div className="absolute w-full bg-white border rounded-lg shadow mt-1 max-h-40 sm:max-h-48 overflow-y-auto z-10">

//                         {collegeLoading && (
//                            <p className="px-3 sm:px-4 py-2 text-gray-400 text-xs sm:text-sm">
//                               Searching...
//                            </p>
//                         )}

//                         {!collegeLoading && colleges.length === 0 && (
//                            <p className="px-3 sm:px-4 py-2 text-gray-400 text-xs sm:text-sm">
//                               No results found
//                            </p>
//                         )}

//                         {!collegeLoading &&
//                            colleges.map((item, i) => (
//                               <div
//                                  key={i}
//                                  onClick={() => {
//                                     setForm({ ...form, college: item.name });
//                                     setShowDropdown(false);
//                                  }}
//                                  className="px-3 sm:px-4 py-2 hover:bg-indigo-50 cursor-pointer text-xs sm:text-sm"
//                               >
//                                  {item.name}, {item.country}
//                               </div>
//                            ))}
//                      </div>
//                   )}
//                </div>

//                {/* Bio */}
//                <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
//                      Bio
//                   </label>

//                   <textarea
//                      value={form.bio}
//                      onChange={(e) =>
//                         setForm({ ...form, bio: e.target.value })
//                      }
//                      className="w-full p-2 sm:p-3 border rounded-lg resize-none h-24 sm:h-28 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                      placeholder="Write something about yourself..."
//                   />
//                </div>

//                {/* GitHub */}
//                <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
//                      GitHub
//                   </label>
//                   <input
//                      value={form.github}
//                      onChange={(e) =>
//                         setForm({ ...form, github: e.target.value })
//                      }
//                      className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                      placeholder="https://github.com/username"
//                   />
//                </div>

//                {/* LinkedIn */}
//                <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
//                      LinkedIn
//                   </label>
//                   <input
//                      value={form.linkedin}
//                      onChange={(e) =>
//                         setForm({ ...form, linkedin: e.target.value })
//                      }
//                      className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                      placeholder="https://linkedin.com/in/username"
//                   />
//                </div>

//                {/* Skills */}
//                <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
//                      Skills
//                   </label>
//                   <input
//                      value={form.skills.join(", ")}
//                      onChange={(e) =>
//                         setForm({
//                            ...form,
//                            skills: e.target.value
//                               .split(",")
//                               .map(s => s.trim())
//                         })
//                      }
//                      className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 outline-none"
//                      placeholder="React, Node, MongoDB"
//                   />
//                </div>

//                {/* Button */}
//                <button
//                   onClick={updateProfile}
//                   disabled={loading}
//                   className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:opacity-90 transition"
//                >
//                   {loading ? "Saving..." : "Save Changes"}
//                </button>

//             </div>

//          </div>

//       </div>
//    );
// }

// export default Profile;



 