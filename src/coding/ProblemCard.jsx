import { useNavigate } from "react-router-dom";

function ProblemCard({ problem }) {
   const navigate = useNavigate();

   const getBadge = (difficulty) => {
      if (difficulty === "Easy") return "bg-green-100 text-green-700";
      if (difficulty === "Medium") return "bg-yellow-100 text-yellow-700";
      return "bg-red-100 text-red-700";
   };

   return (
      <div
         onClick={() => navigate(`/problems/${problem.slug}`)}
         className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer flex justify-between items-center border"
      >
         <h2 className="font-semibold text-lg">
            {problem.title}
         </h2>

         <span className={`px-3 py-1 rounded-full text-sm ${getBadge(problem.difficulty)}`}>
            {problem.difficulty}
         </span>
      </div>
   );
}

export default ProblemCard;