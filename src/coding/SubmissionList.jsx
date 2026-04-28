import { useEffect, useState } from "react";

function SubmissionList({ slug }) {

   const [data, setData] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
             

            // 🔥 get user
            const user = JSON.parse(localStorage.getItem("user"));

             

            if (!user?._id) {
               console.log("❌ No user found");
               return;
            }

            

            const url = `${import.meta.env.VITE_BACKEND_URL}/api/submissions/${slug}?userId=${user?._id}`;
            

            const res = await fetch(url);

            

            const result = await res.json();

             

            setData(result);

         } catch (err) {
            console.log("❌ Fetch error:", err);
         }
      };

      fetchData();
   }, [slug]);

   if (!data.length) {
      
      return <div className="p-4 text-gray-500">No submissions yet</div>;
   }

   return (
      <div className="p-4 space-y-3">

         {data.map((s, i) => {
            console.log(`📄 Rendering submission ${i + 1}:`, s);

            return (
               <div key={i} className="border rounded-lg p-3 bg-white shadow-sm">

                  <div className="flex justify-between items-center">
                     <span
                        className={`font-semibold ${s.status.includes("Accepted")
                           ? "text-green-600"
                           : "text-red-500"
                           }`}
                     >
                        {s.status}
                     </span>

                     <span className="text-xs text-gray-500">
                        {new Date(s.createdAt).toLocaleString()}
                     </span>
                  </div>

                  <div className="text-sm mt-1 text-gray-700">
                     {s.passed}/{s.total} test cases passed
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                     Language: {s.language}
                  </div>

               </div>
            );
         })}

      </div>
   );
}

export default SubmissionList;









// import { useEffect, useState } from "react";

// function SubmissionList({ slug }) {

//    const [data, setData] = useState([]);

//    useEffect(() => {
//       const fetchData = async () => {
//          try {
//             const res = await fetch(
//                `${import.meta.env.VITE_BACKEND_URL}/api/submissions/${slug}`
//             );
//             const result = await res.json();
//             setData(result);
//          } catch (err) {
//             console.log("❌ Fetch error:", err);
//          }
//       };

//       fetchData();
//    }, [slug]);

//    if (!data.length) {
//       return <div className="p-4 text-gray-500">No submissions yet</div>;
//    }

//    return (
//       <div className="p-4 space-y-3">

//          {data.map((s, i) => (
//             <div key={i} className="border rounded-lg p-3 bg-white shadow-sm">

//                <div className="flex justify-between items-center">
//                   <span
//                      className={`font-semibold ${s.status.includes("Accepted")
//                            ? "text-green-600"
//                            : "text-red-500"
//                         }`}
//                   >
//                      {s.status}
//                   </span>

//                   <span className="text-xs text-gray-500">
//                      {new Date(s.createdAt).toLocaleString()}
//                   </span>
//                </div>

//                <div className="text-sm mt-1 text-gray-700">
//                   {s.passed}/{s.total} test cases passed
//                </div>

//                <div className="text-xs text-gray-500 mt-1">
//                   Language: {s.language}
//                </div>

//             </div>
//          ))}

//       </div>
//    );
// }

// export default SubmissionList;





 