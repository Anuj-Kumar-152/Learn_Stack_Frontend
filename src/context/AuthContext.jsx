import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

   const [user, setUser] = useState(null);

   // 🔥 ADD (IMPORTANT)
   const [loading, setLoading] = useState(true);

   const token = localStorage.getItem("token");

   // 🔥 AUTO LOGIN
   useEffect(() => {
      if (token) {
         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
            headers: {
               Authorization: "Bearer " + token
            }
         })
            .then(res => res.json())
            .then(data => {
               if (data?._id) {
                  setUser(data);
                  localStorage.setItem("user", JSON.stringify(data));
               } else {
                  logout();
               }
            })
            .catch(() => logout())
            .finally(() => setLoading(false)); // 🔥 ADD
      } else {
         setLoading(false); // 🔥 ADD
      }
   }, []);

   // 🔥 LOGIN
   const login = (data) => {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
   };

   // 🔥 LOGOUT
   const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
   };

   // 🔥 UPDATE USER
   const updateUser = (newUser) => {
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
   };

   return (
      <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
         {children}
      </AuthContext.Provider>
   );
}






// import { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {

//    const [user, setUser] = useState(null);

//    const token = localStorage.getItem("token");

//    // 🔥 AUTO LOGIN
//    useEffect(() => {
//       if (token) {
//          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
//             headers: {
//                Authorization: "Bearer " + token
//             }
//          })
//             .then(res => res.json())
//             .then(data => {
//                if (data?._id) {
//                   setUser(data);

//                   // 🔥 ADD (sync with localStorage)
//                   localStorage.setItem("user", JSON.stringify(data));

//                } else {
//                   logout();
//                }
//             })
//             .catch(() => logout());
//       }
//    }, []);

//    // 🔥 LOGIN
//    const login = (data) => {
//       localStorage.setItem("token", data.token);
//       setUser(data.user);

//       // 🔥 ADD (MOST IMPORTANT)
//       localStorage.setItem("user", JSON.stringify(data.user));
//    };

//    // 🔥 LOGOUT
//    const logout = () => {
//       localStorage.removeItem("token");

//       // 🔥 ADD
//       localStorage.removeItem("user");

//       setUser(null);
//    };

//    // 🔥 NEW: UPDATE USER (UNCHANGED)
//    const updateUser = (newUser) => {
//       setUser(newUser);

//       // 🔥 ADD (keep sync)
//       localStorage.setItem("user", JSON.stringify(newUser));
//    };

//    return (
//       <AuthContext.Provider value={{ user, login, logout, updateUser }}>
//          {children}
//       </AuthContext.Provider>
//    );
// }



