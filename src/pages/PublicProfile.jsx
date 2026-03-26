import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PublicProfile() {

   const { username } = useParams();
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const res = await fetch(
               `${import.meta.env.VITE_BACKEND_URL}/api/user/${username}`
            );
            const data = await res.json();
            setUser(data);
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };

      fetchUser();
   }, [username]);

   if (loading) {
      return <p className="text-center mt-20 text-gray-500">Loading profile...</p>;
   }

   if (!user) {
      return <p className="text-center mt-20 text-red-500">User not found</p>;
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-100 flex justify-center items-start pt-16 sm:pt-20 md:pt-24 px-3 sm:px-4">

         <div className="w-full max-w-xl sm:max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-5 sm:p-6 md:p-8 relative">

            {/* Top Gradient */}
            <div className="absolute top-0 left-0 w-full h-20 sm:h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl sm:rounded-t-3xl"></div>

            {/* Avatar + Name */}
            <div className="flex flex-col items-center relative -mt-12 sm:-mt-16">
               <img
                  src={
                     user.avatar
                        ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
                        : "/default-avatar.png"
                  }
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
               />

               <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-3 sm:mt-4 text-center">
                  {user.name || "No Name"}
               </h2>

               <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                  @{user.username}
               </p>
            </div>

            {/* Divider */}
            <div className="my-4 sm:my-6 border-t"></div>

            {/* Info */}
            <div className="space-y-3 sm:space-y-4 text-center">

               {user.college && (
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg flex justify-center items-center gap-2">
                     🎓 <span className="font-medium">{user.college}</span>
                  </p>
               )}

               {user.bio && (
                  <p className="text-gray-600 italic text-sm sm:text-base max-w-md sm:max-w-lg mx-auto">
                     "{user.bio}"
                  </p>
               )}

               {/* 🔥 Links */}
               {(user.github || user.linkedin) && (
                  <div className="flex justify-center gap-4 sm:gap-6 mt-3 sm:mt-4 flex-wrap">

                     {user.github && (
                        <a
                           href={user.github}
                           target="_blank"
                           rel="noreferrer"
                           className="text-indigo-600 text-sm sm:text-base font-semibold hover:underline"
                        >
                           GitHub
                        </a>
                     )}

                     {user.linkedin && (
                        <a
                           href={user.linkedin}
                           target="_blank"
                           rel="noreferrer"
                           className="text-indigo-600 text-sm sm:text-base font-semibold hover:underline"
                        >
                           LinkedIn
                        </a>
                     )}

                  </div>
               )}

               {/* 🔥 Skills */}
               {user.skills?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
                     {user.skills.map((skill, i) => (
                        <span
                           key={i}
                           className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm"
                        >
                           {skill}
                        </span>
                     ))}
                  </div>
               )}

            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-gray-400">
               Built with ❤️ on LearnStack 🚀
            </div>

         </div>

      </div>
   );

}

export default PublicProfile;