import { useEffect, useState } from "react";
import ProblemCard from "./ProblemCard";

function ProblemsPage() {
   const [problems, setProblems] = useState([]);

   useEffect(() => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems`)
         .then(res => res.json())
         .then(setProblems)
         .catch(console.error);
   }, []);

   return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">

         <h1 className="text-3xl font-bold mb-6 text-center">
            Coding Problems 🚀
         </h1>

         <div className="max-w-4xl mx-auto space-y-4">
            {problems.map((p) => (
               <ProblemCard key={p._id} problem={p} />
            ))}
         </div>

      </div>
   );
}

export default ProblemsPage;