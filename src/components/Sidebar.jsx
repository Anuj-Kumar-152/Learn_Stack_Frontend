import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";

function Sidebar({ setSlug }) {

   const categories = [
      "Java Basics",
      "OOP & Interfaces",
      "Collections",
      "Exception Handling"
   ];

   const [open, setOpen] = useState(null);
   const [topics, setTopics] = useState([]);
   const [activeTopic, setActiveTopic] = useState(null);

   const loadTopics = (category) => {

      if (open === category) {
         setOpen(null);
         return;
      }

      setOpen(category);

      fetch(`http://localhost:9000/api/topics/category/${category}`)
         .then(res => res.json())
         .then(data => setTopics(data));
   };

   const handleTopicClick = (topic) => {
      setSlug(topic.slug);
      setActiveTopic(topic._id);
   };

   return (

      <aside className="w-72 h-screen bg-slate-50 border-r flex flex-col justify-center">
          
         <div className="space-y-4 px-6">

            

            {categories.map(cat => (

               <div key={cat}>

                  <button
                     onClick={() => loadTopics(cat)}
                     className="flex items-center justify-between w-full px-4 text-sm font-semibold rounded-lg hover:bg-white hover:shadow transition"
                  >
                     <div className="flex items-center gap-2">

                        <BookOpen size={16} className="text-indigo-500" />

                        {cat}

                     </div>

                     <ChevronDown
                        size={16}
                        className={`transition-transform ${open === cat ? "rotate-180 text-indigo-600" : ""
                           }`}
                     />

                  </button>

                  {open === cat && (

                     <div className="mt-2 ml-6 space-y-1">

                        {topics.map(topic => (

                           <div
                              key={topic._id}
                              onClick={() => handleTopicClick(topic)}
                              className={`px-3 py-2 text-sm rounded-md cursor-pointer transition
                    ${activeTopic === topic._id
                                    ? "bg-indigo-100 text-indigo-700 font-medium"
                                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                 }`}
                           >
                              {topic.title}
                           </div>

                        ))}

                     </div>

                  )}

               </div>

            ))}

         </div>

      </aside>
   );
}

export default Sidebar;


// import { useState } from "react";

// function Sidebar({ setSlug }) {

//    const categories = [
//       "Java Basics",
//       "OOP & Interfaces",
//       "Collections",
//       "Exception Handling"
//    ];

//    const [open, setOpen] = useState(null);
//    const [topics, setTopics] = useState([]);

//    const loadTopics = (category) => {

//       if (open === category) {
//          setOpen(null);
//          return;
//       }

//       setOpen(category);

//       fetch(`http://localhost:9000/api/topics/category/${category}`)
//          .then(res => res.json())
//          .then(data => setTopics(data));
//    };

//    return (

//       <div style={{ width: "250px" }}>

//          {categories.map(cat => (
//             <div key={cat}>

//                <div
//                   onClick={() => loadTopics(cat)}
//                   style={{ padding: "10px", cursor: "pointer" }}
//                >
//                   {cat}
//                </div>

//                {open === cat &&

//                   topics.map(topic => (
//                      <div
//                         key={topic._id}
//                         onClick={() => setSlug(topic.slug)}
//                         style={{ paddingLeft: "20px" }}
//                      >
//                         {topic.title}
//                      </div>
//                   ))

//                }

//             </div>
//          ))}

//       </div>

//    )
// }

// export default Sidebar;