import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

   const { user, loading } = useContext(AuthContext);

   // 🔥 ADD THIS (IMPORTANT)
   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-gray-500">Loading...</p>
         </div>
      );
   }

   // 🔥 SAME LOGIC
   if (!user) return <Navigate to="/login" />;

   return children;
}

export default ProtectedRoute;








// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//    const { user } = useContext(AuthContext);

//    if (!user) return <Navigate to="/login" />;

//    return children;
// }

// export default ProtectedRoute;