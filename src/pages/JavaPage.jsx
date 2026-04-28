 




import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";

function JavaPage() {

   const { slug } = useParams();
   const [openSidebar, setOpenSidebar] = useState(false);

   const [topic, setTopic] = useState(null);
   const [loadingVideo, setLoadingVideo] = useState(false);
   const [activeVideo, setActiveVideo] = useState(null);

   // ✅ SAME ENV (FIX)
   const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID1;

   useEffect(() => {

      if (!slug) return;

      setLoadingVideo(true);
      setTopic(null);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/topics/${slug}`)
         .then(res => res.json())
         .then(data => {
            setTopic(data);
            setLoadingVideo(false);
         })
         .catch(() => {
            setTopic(null);
            setLoadingVideo(false);
         });

   }, [slug]);

   const defaultVideo = {
      id: "f3uPStSg0j4",
      title: "Java Variables & Data Types 🔥",
      channel: "CodeNexus"
   };

   const videos = topic?.videos?.length
      ? topic.videos
      : topic?.videoId
         ? [{
            id: topic.videoId,
            title: topic.title,
            channel: topic.channel
         }]
         : [defaultVideo];

   return (

      <div className="h-screen bg-white overflow-hidden">

         {/* Mobile Top Bar */}
         <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b z-40 px-4 py-2 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">
               Java Topics
            </span>

            <button
               onClick={() => setOpenSidebar(true)}
               className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
            >
               Topics
            </button>
         </div>

         {/* Mobile Sidebar */}
         {openSidebar && (
            <div className="fixed inset-0 z-50 flex">
               <div className="w-64 sm:w-72 bg-white shadow-xl h-full">
                  <Sidebar closeSidebar={() => setOpenSidebar(false)} />
               </div>
               <div
                  className="flex-1 bg-black/40"
                  onClick={() => setOpenSidebar(false)}
               ></div>
            </div>
         )}

         {/* Layout */}
         <div className="flex pt-28 lg:pt-16 h-full">

            {/* Sidebar */}
            <div className="hidden lg:block w-72 bg-white border-r h-full overflow-hidden">
               <Sidebar />
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col xl:flex-row h-full">

               {/* CONTENT */}
               <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 min-w-0">

                  {!slug ? (
                     <div className="h-full flex items-center justify-center text-center">
                        <h1 className="text-3xl font-bold text-gray-800">
                           Welcome to Java Tutorials
                        </h1>
                     </div>
                  ) : (
                     <>
                        <Content key={slug} slug={slug} />

                        {/* MOBILE VIDEO */}
                           {/* MOBILE VIDEO */}
                           <div className="xl:hidden mt-6 space-y-4">

                              <h2 className="text-lg font-semibold text-gray-900 px-1">
                                 🎬 Watch Video
                              </h2>

                              {videos.map((video, index) => (
                                 <div
                                    key={index}
                                    onClick={() => setActiveVideo(video.id)}
                                    className="cursor-pointer"
                                 >
                                    <div className="rounded-xl overflow-hidden shadow-sm border bg-white active:scale-[0.98] transition">

                                       {/* IMAGE */}
                                       <div className="relative w-full aspect-video">

                                          <img
                                             src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                             alt={video.title}
                                             className="w-full h-full object-cover"
                                          />

                                          {/* PLAY BUTTON */}
                                          <div className="absolute inset-0 flex items-center justify-center">
                                             <div className="bg-white/90 backdrop-blur rounded-full p-3 shadow-md">
                                                ▶
                                             </div>
                                          </div>

                                       </div>

                                       {/* TITLE */}
                                       <div className="p-3">
                                          <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                                             {video.title}
                                          </h3>
                                          <p className="text-xs text-gray-500 mt-1">
                                             {video.channel}
                                          </p>
                                       </div>

                                    </div>
                                 </div>
                              ))}

                           </div>
                     </>
                  )}

               </div>

               

               {/* VIDEO SIDEBAR (ONLY ONE — FIXED) */}
               <div className="hidden xl:flex w-[360px] 2xl:w-[400px] border-l bg-gray-50 px-5 py-6 flex-col gap-6 overflow-y-auto">

                  {/* 🔴 SUBSCRIBE CARD */}
                  <div className="rounded-2xl p-5 bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md">

                     <h3 className="text-base font-semibold">
                        🚀 LearnStack Channel
                     </h3>

                     <p className="text-sm text-white/80 mt-1">
                        Daily Java tutorials & coding tips
                     </p>

                     <button
                        onClick={() => {
                           window.open(
                              `https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`,
                              "_blank"
                           );
                        }}
                        className="mt-4 w-full bg-white text-red-600 font-semibold py-2 rounded-xl shadow hover:scale-105 transition"
                     >
                        🔔 Subscribe Now
                     </button>

                  </div>

                  {/* TITLE */}
                  <h2 className="text-base font-semibold text-gray-800">
                     🎬 Recommended Videos
                  </h2>

                  {loadingVideo ? (
                     <p className="text-sm text-gray-500">Loading...</p>
                  ) : (

                     <div className="flex flex-col gap-5">

                        {videos.map((video, index) => (

                           <div
                              key={index}
                              onClick={() => setActiveVideo(video.id)}
                              className="group cursor-pointer"
                           >

                              <div className="rounded-xl overflow-hidden bg-white border shadow-sm hover:shadow-md transition">

                                 <div className="relative">

                                    {/* IMAGE */}
                                    <img
                                       src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                       alt={video.title}
                                       className="w-full h-40 object-cover"
                                    />

                                    {/* ✅ CLICK FIX */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                       <div className="bg-white/90 rounded-full p-2 shadow">
                                          ▶
                                       </div>
                                    </div>

                                 </div>

                                 <div className="p-3">
                                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                                       {video.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                       {video.channel}
                                    </p>
                                 </div>

                              </div>

                           </div>

                        ))}

                     </div>

                  )}

               </div>

               {activeVideo && (
                  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4">

                     {/* CLOSE BUTTON */}
                     <button
                        onClick={() => setActiveVideo(null)}
                        className="absolute top-5 right-5 text-white text-2xl"
                     >
                        ✕
                     </button>

                     <div className="w-full max-w-4xl">

                        {/* VIDEO */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-black">
                           <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                              title="YouTube video"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                           />
                        </div>

                        {/* TITLE + SUBSCRIBE */}
                        <div className="text-center mt-5">

                           <h2 className="text-white text-lg font-semibold">
                              {videos.find(v => v.id === activeVideo)?.title}
                           </h2>

                           <p className="text-gray-400 text-sm mt-1">
                              {videos.find(v => v.id === activeVideo)?.channel}
                           </p>

                           <button
                              onClick={() => {
                                 window.open(
                                    `https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`,
                                    "_blank"
                                 );
                              }}
                              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full"
                           >
                              🔔 Subscribe
                           </button>

                        </div>

                     </div>

                  </div>
               )}

            </div>

         </div>

         

      </div>
   );
}

export default JavaPage;

 




// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Sidebar from "../components/Sidebar";
// import Content from "../components/Content";

// function JavaPage() {

//    const { slug } = useParams();
//    const [openSidebar, setOpenSidebar] = useState(false);

//    const [topic, setTopic] = useState(null);
//    const [loadingVideo, setLoadingVideo] = useState(false);
//    const [activeVideo, setActiveVideo] = useState(null);

//    // ✅ SAME ENV (FIX)
//    const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID1;

//    useEffect(() => {

//       if (!slug) return;

//       setLoadingVideo(true);
//       setTopic(null);

//       fetch(`${import.meta.env.VITE_BACKEND_URL}/api/topics/${slug}`)
//          .then(res => res.json())
//          .then(data => {
//             setTopic(data);
//             setLoadingVideo(false);
//          })
//          .catch(() => {
//             setTopic(null);
//             setLoadingVideo(false);
//          });

//    }, [slug]);

//    const defaultVideo = {
//       id: "f3uPStSg0j4",
//       title: "Java Variables & Data Types 🔥",
//       channel: "CodeNexus"
//    };

//    const videos = topic?.videos?.length
//       ? topic.videos
//       : topic?.videoId
//          ? [{
//             id: topic.videoId,
//             title: topic.title,
//             channel: topic.channel
//          }]
//          : [defaultVideo];

//    return (

//       <div className="h-screen bg-white overflow-hidden">

//          {/* Mobile Top Bar */}
//          <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b z-40 px-4 py-2 flex justify-between items-center">
//             <span className="text-lg font-semibold text-gray-700">
//                Java Topics
//             </span>

//             <button
//                onClick={() => setOpenSidebar(true)}
//                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
//             >
//                Topics
//             </button>
//          </div>

//          {/* Mobile Sidebar */}
//          {openSidebar && (
//             <div className="fixed inset-0 z-50 flex">
//                <div className="w-64 sm:w-72 bg-white shadow-xl h-full">
//                   <Sidebar closeSidebar={() => setOpenSidebar(false)} />
//                </div>
//                <div
//                   className="flex-1 bg-black/40"
//                   onClick={() => setOpenSidebar(false)}
//                ></div>
//             </div>
//          )}

//          {/* Layout */}
//          <div className="flex pt-28 lg:pt-16 h-full">

//             {/* Sidebar */}
//             <div className="hidden lg:block w-72 bg-white border-r h-full overflow-hidden">
//                <Sidebar />
//             </div>

//             {/* Main */}
//             <div className="flex-1 flex flex-col xl:flex-row h-full">

//                {/* CONTENT */}
//                <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 min-w-0">

//                   {!slug ? (
//                      <div className="h-full flex items-center justify-center text-center">
//                         <h1 className="text-3xl font-bold text-gray-800">
//                            Welcome to Java Tutorials
//                         </h1>
//                      </div>
//                   ) : (
//                      <>
//                         <Content key={slug} slug={slug} />

//                         {/* MOBILE VIDEO */}
//                         <div className="xl:hidden mt-8">

//                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
//                               🎬 Watch Video
//                            </h2>

//                            {videos.map((video, index) => (
//                               <div
//                                  key={index}
//                                  onClick={() => setActiveVideo(video.id)}
//                                  className="cursor-pointer"
//                               >
//                                  <div className="rounded-2xl overflow-hidden shadow-md border bg-white">
//                                     <div className="relative">
//                                        <img
//                                           src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
//                                           alt={video.title}
//                                           className="w-full h-48 object-cover"
//                                        />
//                                        <div className="absolute inset-0 flex items-center justify-center">
//                                           <div className="bg-white rounded-full p-3 shadow">
//                                              ▶
//                                           </div>
//                                        </div>
//                                     </div>
//                                  </div>
//                               </div>
//                            ))}

//                         </div>
//                      </>
//                   )}

//                </div>

               

//                {/* VIDEO SIDEBAR (ONLY ONE — FIXED) */}
//                <div className="hidden xl:flex w-[360px] 2xl:w-[400px] border-l bg-gray-50 px-5 py-6 flex-col gap-6 overflow-y-auto">

//                   {/* 🔴 SUBSCRIBE CARD */}
//                   <div className="rounded-2xl p-5 bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md">

//                      <h3 className="text-base font-semibold">
//                         🚀 LearnStack Channel
//                      </h3>

//                      <p className="text-sm text-white/80 mt-1">
//                         Daily Java tutorials & coding tips
//                      </p>

//                      <button
//                         onClick={() => {
//                            window.open(
//                               `https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`,
//                               "_blank"
//                            );
//                         }}
//                         className="mt-4 w-full bg-white text-red-600 font-semibold py-2 rounded-xl shadow hover:scale-105 transition"
//                      >
//                         🔔 Subscribe Now
//                      </button>

//                   </div>

//                   {/* TITLE */}
//                   <h2 className="text-base font-semibold text-gray-800">
//                      🎬 Recommended Videos
//                   </h2>

//                   {loadingVideo ? (
//                      <p className="text-sm text-gray-500">Loading...</p>
//                   ) : (

//                      <div className="flex flex-col gap-5">

//                         {videos.map((video, index) => (

//                            <div
//                               key={index}
//                               onClick={() => setActiveVideo(video.id)}
//                               className="group cursor-pointer"
//                            >

//                               <div className="rounded-xl overflow-hidden bg-white border shadow-sm hover:shadow-md transition">

//                                  <div className="relative">

//                                     {/* IMAGE */}
//                                     <img
//                                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
//                                        alt={video.title}
//                                        className="w-full h-40 object-cover"
//                                     />

//                                     {/* ✅ CLICK FIX */}
//                                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                                        <div className="bg-white/90 rounded-full p-2 shadow">
//                                           ▶
//                                        </div>
//                                     </div>

//                                  </div>

//                                  <div className="p-3">
//                                     <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
//                                        {video.title}
//                                     </h3>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                        {video.channel}
//                                     </p>
//                                  </div>

//                               </div>

//                            </div>

//                         ))}

//                      </div>

//                   )}

//                </div>

//                {activeVideo && (
//                   <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4">

//                      {/* CLOSE BUTTON */}
//                      <button
//                         onClick={() => setActiveVideo(null)}
//                         className="absolute top-5 right-5 text-white text-2xl"
//                      >
//                         ✕
//                      </button>

//                      <div className="w-full max-w-4xl">

//                         {/* VIDEO */}
//                         <div className="aspect-video rounded-xl overflow-hidden bg-black">
//                            <iframe
//                               className="w-full h-full"
//                               src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
//                               title="YouTube video"
//                               allow="autoplay; encrypted-media"
//                               allowFullScreen
//                            />
//                         </div>

//                         {/* TITLE + SUBSCRIBE */}
//                         <div className="text-center mt-5">

//                            <h2 className="text-white text-lg font-semibold">
//                               {videos.find(v => v.id === activeVideo)?.title}
//                            </h2>

//                            <p className="text-gray-400 text-sm mt-1">
//                               {videos.find(v => v.id === activeVideo)?.channel}
//                            </p>

//                            <button
//                               onClick={() => {
//                                  window.open(
//                                     `https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`,
//                                     "_blank"
//                                  );
//                               }}
//                               className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full"
//                            >
//                               🔔 Subscribe
//                            </button>

//                         </div>

//                      </div>

//                   </div>
//                )}

//             </div>

//          </div>

         

//       </div>
//    );
// }

// export default JavaPage;


 