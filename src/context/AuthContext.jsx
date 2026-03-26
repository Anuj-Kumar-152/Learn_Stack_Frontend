import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

   const [user, setUser] = useState(null);

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
               } else {
                  logout();
               }
            })
            .catch(() => logout());
      }
   }, []);

   // 🔥 LOGIN
   const login = (data) => {
      localStorage.setItem("token", data.token);
      setUser(data.user);
   };

   // 🔥 LOGOUT
   const logout = () => {
      localStorage.removeItem("token");
      setUser(null);
   };

   // 🔥 NEW: UPDATE USER (MAIN FIX)
   const updateUser = (newUser) => {
      setUser(newUser);
   };

   return (
      <AuthContext.Provider value={{ user, login, logout, updateUser }}>
         {children}
      </AuthContext.Provider>
   );
}